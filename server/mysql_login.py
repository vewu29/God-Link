"""Logging in to MySQL 8 from PyMySQL, wherever the server runs.

MySQL 8's standard login (caching_sha2_password) sends the password
RSA-encrypted when the connection isn't TLS. Two things can stop that:

- PyMySQL does the RSA step with the `cryptography` package, a compiled
  library some hosts can't install. This file does the same small job in
  plain Python — RSA with OAEP padding over SHA-1, exactly what MySQL
  expects — used only when `cryptography` is missing. The key is the
  server's public key, sent over the same connection; nothing is stored.
- Some PyMySQL releases read the server's final "OK" on that path but
  don't return it, and their login loop then fails. A small wrapper
  returns a stand-in for it.

TLS connections (the default; see connect() in core.py) need neither.
"""
import base64
import hashlib
import secrets

SHA1_LEN = 20
SCRAMBLE_LENGTH = 20


def _der(data, pos):
    """The DER element at pos: (tag, content start, content end)."""
    tag, length = data[pos], data[pos + 1]
    pos += 2
    if length & 0x80:
        count = length & 0x7F
        length = int.from_bytes(data[pos:pos + count], "big")
        pos += count
    return tag, pos, pos + length


def public_numbers(pem):
    """(n, e) from a PEM public key: "PUBLIC KEY" (what MySQL sends) or "RSA PUBLIC KEY"."""
    text = pem.decode("ascii") if isinstance(pem, (bytes, bytearray)) else pem
    lines = [line.strip() for line in text.strip().splitlines() if line.strip()]
    der = base64.b64decode("".join(line for line in lines if not line.startswith("-----")))
    if "RSA PUBLIC KEY" not in lines[0]:
        # SubjectPublicKeyInfo: SEQUENCE { SEQUENCE { algorithm }, BIT STRING { RSAPublicKey } }
        _, inner, _ = _der(der, 0)
        _, _, after_algorithm = _der(der, inner)
        tag, start, end = _der(der, after_algorithm)
        if tag != 0x03:
            raise ValueError("not an RSA public key")
        der = der[start + 1:end]  # skip the bit string's unused-bits byte
    # RSAPublicKey: SEQUENCE { INTEGER n, INTEGER e }
    _, inner, _ = _der(der, 0)
    _, start, end = _der(der, inner)
    n = int.from_bytes(der[start:end], "big")
    _, start, end_e = _der(der, end)
    return n, int.from_bytes(der[start:end_e], "big")


def _mgf1(seed, length):
    out = b""
    counter = 0
    while len(out) < length:
        out += hashlib.sha1(seed + counter.to_bytes(4, "big")).digest()
        counter += 1
    return out[:length]


def oaep_encrypt(message, n, e):
    """RSAES-OAEP (RFC 8017, section 7.1.1) with SHA-1 and MGF1-SHA-1, no label."""
    k = (n.bit_length() + 7) // 8
    if len(message) > k - 2 * SHA1_LEN - 2:
        raise ValueError("message too long for this key")
    db = hashlib.sha1(b"").digest() + b"\x00" * (k - len(message) - 2 * SHA1_LEN - 2) + b"\x01" + message
    seed = secrets.token_bytes(SHA1_LEN)
    masked_db = bytes(a ^ b for a, b in zip(db, _mgf1(seed, k - SHA1_LEN - 1)))
    masked_seed = bytes(a ^ b for a, b in zip(seed, _mgf1(masked_db, SHA1_LEN)))
    return pow(int.from_bytes(b"\x00" + masked_seed + masked_db, "big"), e, n).to_bytes(k, "big")


def sha2_rsa_encrypt(password, salt, public_key):
    """The same answer as PyMySQL's own pymysql._auth.sha2_rsa_encrypt."""
    salt = salt[:SCRAMBLE_LENGTH]
    message = bytes(b ^ salt[i % len(salt)] for i, b in enumerate(password + b"\0"))
    n, e = public_numbers(public_key)
    return oaep_encrypt(message, n, e)


class _LoggedIn:
    """Stands for the OK packet that ended a successful login (an error
    packet would already have raised)."""

    def is_auth_switch_request(self):
        return False

    def is_extra_auth_data(self):
        return False

    def is_ok_packet(self):
        return True


def install():
    """Patch PyMySQL's login steps where needed; safe to call more than once."""
    from pymysql import _auth
    if not getattr(_auth, "_have_cryptography", True):
        _auth.sha2_rsa_encrypt = sha2_rsa_encrypt
    original = _auth.caching_sha2_password_auth
    if getattr(original, "code_block_wrapped", False):
        return

    def caching_sha2_password_auth(conn, pkt):
        result = original(conn, pkt)
        return _LoggedIn() if result is None else result

    caching_sha2_password_auth.code_block_wrapped = True
    _auth.caching_sha2_password_auth = caching_sha2_password_auth
