// A small stand-in for the Unity scripting API, used ONLY by the content
// tests. The Unity track's code compiles against these signatures (same
// names, namespaces and shapes as Unity 6), and a tiny frame loop plays
// a script: Awake, OnEnable, Start, then Update / FixedUpdate for N
// frames, with coroutines, Invoke and Destroy honoured. Debug.Log prints
// to the console so the test can compare it with the app's PC screen.
// This is not Unity: physics, rendering and input are inert unless a
// test scripts them. It exists to catch typos and wrong outputs.
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;

namespace UnityEngine
{
    public class Object
    {
        public string name = "";
        internal bool destroyed;
        public static void Destroy(Object obj) { if (obj != null) Engine.PendingDestroy.Add(obj); }
        public static void Destroy(Object obj, float delay) { Destroy(obj); }
        public static T Instantiate<T>(T original) where T : Object { return Engine.Clone(original); }
        public static T Instantiate<T>(T original, Vector3 position, Quaternion rotation) where T : Object { var c = Engine.Clone(original); if (c is GameObject g) g.transform.position = position; else if (c is Component k) k.transform.position = position; return c; }
        public static T FindObjectOfType<T>() where T : Object { return Engine.All.OfType<T>().FirstOrDefault(); }
        public static T FindFirstObjectByType<T>() where T : Object { return FindObjectOfType<T>(); }
        public static void DontDestroyOnLoad(Object target) { }
        public override string ToString() { return name; }
        public static implicit operator bool(Object o) { return o != null && !o.destroyed; }
    }

    public class Component : Object
    {
        public GameObject gameObject;
        public Transform transform { get { return gameObject.transform; } }
        public string tag { get { return gameObject.tag; } set { gameObject.tag = value; } }
        public T GetComponent<T>() where T : class { return gameObject.GetComponent<T>(); }
        public bool TryGetComponent<T>(out T component) where T : class { component = GetComponent<T>(); return component != null; }
        public bool CompareTag(string t) { return gameObject.tag == t; }
    }

    public class Behaviour : Component { public bool enabled = true; public bool isActiveAndEnabled { get { return enabled && gameObject.activeSelf; } } }

    public class MonoBehaviour : Behaviour
    {
        public Coroutine StartCoroutine(IEnumerator routine) { var c = new Coroutine(routine, this); Engine.Coroutines.Add(c); c.Step(); return c; }
        public void StopCoroutine(Coroutine routine) { if (routine != null) routine.done = true; }
        public void StopAllCoroutines() { foreach (var c in Engine.Coroutines) if (c.owner == this) c.done = true; }
        public void Invoke(string methodName, float time) { Engine.Invokes.Add(new Engine.Pending { owner = this, method = methodName, at = Time.time + time }); }
        public void InvokeRepeating(string methodName, float time, float repeatRate) { Engine.Invokes.Add(new Engine.Pending { owner = this, method = methodName, at = Time.time + time, every = repeatRate }); }
        public void CancelInvoke() { Engine.Invokes.RemoveAll(p => p.owner == this); }
        public static void print(object message) { Debug.Log(message); }
    }

    public class GameObject : Object
    {
        public Transform transform;
        public string tag = "Untagged";
        public int layer;
        internal List<Component> components = new List<Component>();
        bool active = true;
        public bool activeSelf { get { return active; } }
        public bool activeInHierarchy { get { return active; } }
        public GameObject() : this("GameObject") { }
        public GameObject(string name) { this.name = name; transform = new Transform { gameObject = this, name = name }; components.Add(transform); Engine.All.Add(this); }
        public T AddComponent<T>() where T : Component, new() { var c = new T { gameObject = this, name = name }; components.Add(c); Engine.Attach(c); return c; }
        public T GetComponent<T>() where T : class { return components.OfType<T>().FirstOrDefault(); }
        public T[] GetComponents<T>() where T : class { return components.OfType<T>().ToArray(); }
        public bool TryGetComponent<T>(out T component) where T : class { component = GetComponent<T>(); return component != null; }
        public void SetActive(bool value) { active = value; }
        public bool CompareTag(string t) { return tag == t; }
        public static GameObject Find(string name) { return Engine.All.OfType<GameObject>().FirstOrDefault(g => g.name == name && !g.destroyed); }
        public static GameObject FindWithTag(string tag) { return Engine.All.OfType<GameObject>().FirstOrDefault(g => g.tag == tag && !g.destroyed); }
        public static GameObject[] FindGameObjectsWithTag(string tag) { return Engine.All.OfType<GameObject>().Where(g => g.tag == tag && !g.destroyed).ToArray(); }
    }

    public class Transform : Component
    {
        public Vector3 position;
        public Vector3 localPosition { get { return position; } set { position = value; } }
        public Vector3 localScale = Vector3.one;
        public Quaternion rotation = Quaternion.identity;
        public Vector3 eulerAngles { get { return rotation.eulerAngles; } set { rotation = Quaternion.Euler(value); } }
        public Vector3 localEulerAngles { get { return eulerAngles; } set { eulerAngles = value; } }
        public Transform parent;
        public Vector3 forward { get { return Vector3.forward; } }
        public Vector3 right { get { return Vector3.right; } }
        public Vector3 up { get { return Vector3.up; } }
        public int childCount { get { return 0; } }
        public void Translate(Vector3 t) { position += t; }
        public void Translate(float x, float y, float z) { position += new Vector3(x, y, z); }
        public void Rotate(Vector3 e) { eulerAngles = eulerAngles + e; }
        public void Rotate(float x, float y, float z) { Rotate(new Vector3(x, y, z)); }
        public void LookAt(Transform target) { }
        public void LookAt(Vector3 target) { }
        public void SetParent(Transform p) { parent = p; }
    }

    public struct Vector3
    {
        public float x, y, z;
        public Vector3(float x, float y, float z) { this.x = x; this.y = y; this.z = z; }
        public Vector3(float x, float y) { this.x = x; this.y = y; z = 0; }
        public static Vector3 zero { get { return new Vector3(0, 0, 0); } }
        public static Vector3 one { get { return new Vector3(1, 1, 1); } }
        public static Vector3 up { get { return new Vector3(0, 1, 0); } }
        public static Vector3 down { get { return new Vector3(0, -1, 0); } }
        public static Vector3 left { get { return new Vector3(-1, 0, 0); } }
        public static Vector3 right { get { return new Vector3(1, 0, 0); } }
        public static Vector3 forward { get { return new Vector3(0, 0, 1); } }
        public static Vector3 back { get { return new Vector3(0, 0, -1); } }
        public float magnitude { get { return (float)Math.Sqrt(x * x + y * y + z * z); } }
        public float sqrMagnitude { get { return x * x + y * y + z * z; } }
        public Vector3 normalized { get { var m = magnitude; return m > 0 ? this / m : zero; } }
        public static Vector3 operator +(Vector3 a, Vector3 b) { return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z); }
        public static Vector3 operator -(Vector3 a, Vector3 b) { return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z); }
        public static Vector3 operator -(Vector3 a) { return new Vector3(-a.x, -a.y, -a.z); }
        public static Vector3 operator *(Vector3 a, float d) { return new Vector3(a.x * d, a.y * d, a.z * d); }
        public static Vector3 operator *(float d, Vector3 a) { return a * d; }
        public static Vector3 operator /(Vector3 a, float d) { return new Vector3(a.x / d, a.y / d, a.z / d); }
        public static bool operator ==(Vector3 a, Vector3 b) { return (a - b).sqrMagnitude < 1e-10f; }
        public static bool operator !=(Vector3 a, Vector3 b) { return !(a == b); }
        public override bool Equals(object o) { return o is Vector3 v && v == this; }
        public override int GetHashCode() { return x.GetHashCode() ^ y.GetHashCode() ^ z.GetHashCode(); }
        public static float Distance(Vector3 a, Vector3 b) { return (a - b).magnitude; }
        public static Vector3 Lerp(Vector3 a, Vector3 b, float t) { t = Mathf.Clamp01(t); return a + (b - a) * t; }
        public static Vector3 MoveTowards(Vector3 current, Vector3 target, float maxDelta) { var d = target - current; var m = d.magnitude; return m <= maxDelta || m == 0 ? target : current + d / m * maxDelta; }
        public static float Dot(Vector3 a, Vector3 b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
        public static Vector3 Cross(Vector3 a, Vector3 b) { return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x); }
        public override string ToString() { return string.Format(CultureInfo.InvariantCulture, "({0:F2}, {1:F2}, {2:F2})", x, y, z); }
        public static implicit operator Vector2(Vector3 v) { return new Vector2(v.x, v.y); }
    }

    public struct Vector2
    {
        public float x, y;
        public Vector2(float x, float y) { this.x = x; this.y = y; }
        public static Vector2 zero { get { return new Vector2(0, 0); } }
        public static Vector2 one { get { return new Vector2(1, 1); } }
        public static Vector2 up { get { return new Vector2(0, 1); } }
        public static Vector2 down { get { return new Vector2(0, -1); } }
        public static Vector2 left { get { return new Vector2(-1, 0); } }
        public static Vector2 right { get { return new Vector2(1, 0); } }
        public float magnitude { get { return (float)Math.Sqrt(x * x + y * y); } }
        public Vector2 normalized { get { var m = magnitude; return m > 0 ? new Vector2(x / m, y / m) : zero; } }
        public static Vector2 operator +(Vector2 a, Vector2 b) { return new Vector2(a.x + b.x, a.y + b.y); }
        public static Vector2 operator -(Vector2 a, Vector2 b) { return new Vector2(a.x - b.x, a.y - b.y); }
        public static Vector2 operator *(Vector2 a, float d) { return new Vector2(a.x * d, a.y * d); }
        public static Vector2 operator *(float d, Vector2 a) { return a * d; }
        public static float Distance(Vector2 a, Vector2 b) { return (a - b).magnitude; }
        public static implicit operator Vector3(Vector2 v) { return new Vector3(v.x, v.y, 0); }
        public override string ToString() { return string.Format(CultureInfo.InvariantCulture, "({0:F2}, {1:F2})", x, y); }
    }

    public struct Quaternion
    {
        internal Vector3 euler;
        public static Quaternion identity { get { return new Quaternion(); } }
        public Vector3 eulerAngles { get { return euler; } set { euler = value; } }
        public static Quaternion Euler(float x, float y, float z) { return Euler(new Vector3(x, y, z)); }
        public static Quaternion Euler(Vector3 e) { return new Quaternion { euler = new Vector3(Wrap(e.x), Wrap(e.y), Wrap(e.z)) }; }
        static float Wrap(float a) { a %= 360f; return a < 0 ? a + 360f : a; }
        public static Quaternion LookRotation(Vector3 forward) { return identity; }
        public static Quaternion Slerp(Quaternion a, Quaternion b, float t) { return t >= 1 ? b : a; }
        public static Vector3 operator *(Quaternion q, Vector3 v) { return v; }
        public static Quaternion operator *(Quaternion a, Quaternion b) { return Euler(a.euler + b.euler); }
    }

    public struct Color
    {
        public float r, g, b, a;
        public Color(float r, float g, float b, float a = 1f) { this.r = r; this.g = g; this.b = b; this.a = a; }
        public static Color red { get { return new Color(1, 0, 0); } }
        public static Color green { get { return new Color(0, 1, 0); } }
        public static Color blue { get { return new Color(0, 0, 1); } }
        public static Color white { get { return new Color(1, 1, 1); } }
        public static Color black { get { return new Color(0, 0, 0); } }
        public static Color yellow { get { return new Color(1, 0.92f, 0.016f); } }
        public static Color Lerp(Color a, Color b, float t) { return t >= 1 ? b : a; }
    }

    public static class Time
    {
        public static float deltaTime = 0.02f;
        public static float fixedDeltaTime = 0.02f;
        public static float time;
        public static float timeScale = 1f;
        public static int frameCount;
        public static float unscaledDeltaTime { get { return deltaTime; } }
    }

    public static class Debug
    {
        public static void Log(object message) { Console.WriteLine(Engine.Text(message)); }
        public static void Log(object message, Object context) { Log(message); }
        public static void LogWarning(object message) { Console.WriteLine(Engine.Text(message)); }
        public static void LogWarning(object message, Object context) { LogWarning(message); }
        public static void LogError(object message) { Console.WriteLine(Engine.Text(message)); }
        public static void LogError(object message, Object context) { LogError(message); }
        public static void DrawLine(Vector3 a, Vector3 b) { }
        public static void DrawRay(Vector3 a, Vector3 d) { }
    }

    public static class Mathf
    {
        public const float PI = (float)Math.PI;
        public const float Infinity = float.PositiveInfinity;
        public static float Clamp(float v, float min, float max) { return v < min ? min : v > max ? max : v; }
        public static int Clamp(int v, int min, int max) { return v < min ? min : v > max ? max : v; }
        public static float Clamp01(float v) { return Clamp(v, 0f, 1f); }
        public static float Lerp(float a, float b, float t) { return a + (b - a) * Clamp01(t); }
        public static float MoveTowards(float current, float target, float maxDelta) { return Math.Abs(target - current) <= maxDelta ? target : current + Math.Sign(target - current) * maxDelta; }
        public static float Abs(float v) { return Math.Abs(v); }
        public static int Abs(int v) { return Math.Abs(v); }
        public static float Max(float a, float b) { return Math.Max(a, b); }
        public static int Max(int a, int b) { return Math.Max(a, b); }
        public static float Min(float a, float b) { return Math.Min(a, b); }
        public static int Min(int a, int b) { return Math.Min(a, b); }
        public static float Sqrt(float v) { return (float)Math.Sqrt(v); }
        public static float Pow(float a, float b) { return (float)Math.Pow(a, b); }
        public static float Sin(float v) { return (float)Math.Sin(v); }
        public static float Cos(float v) { return (float)Math.Cos(v); }
        public static float Round(float v) { return (float)Math.Round(v, MidpointRounding.ToEven); }
        public static int RoundToInt(float v) { return (int)Math.Round(v, MidpointRounding.ToEven); }
        public static int FloorToInt(float v) { return (int)Math.Floor(v); }
        public static int CeilToInt(float v) { return (int)Math.Ceiling(v); }
        public static float Sign(float v) { return v >= 0f ? 1f : -1f; }
        public static bool Approximately(float a, float b) { return Math.Abs(a - b) < 1e-6f; }
        public static float PingPong(float t, float length) { t %= 2 * length; return length - Math.Abs(t - length); }
        public static float Repeat(float t, float length) { return t - (float)Math.Floor(t / length) * length; }
    }

    public static class Random
    {
        static System.Random rng = new System.Random(7);
        public static float value { get { return (float)rng.NextDouble(); } }
        public static int Range(int min, int max) { return rng.Next(min, max); }
        public static float Range(float min, float max) { return min + (float)rng.NextDouble() * (max - min); }
        public static void InitState(int seed) { rng = new System.Random(seed); }
    }

    public enum KeyCode { None, Space, Return, Escape, Tab, LeftShift, RightShift, LeftControl, UpArrow, DownArrow, LeftArrow, RightArrow, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, Alpha0, Alpha1, Alpha2, Alpha3, Mouse0, Mouse1 }

    public static class Input
    {
        public static bool GetKey(KeyCode key) { return Engine.Held.Contains(key); }
        public static bool GetKeyDown(KeyCode key) { return Engine.Pressed(key); }
        public static bool GetKeyUp(KeyCode key) { return false; }
        public static bool GetButtonDown(string button) { return button == "Jump" && Engine.Pressed(KeyCode.Space); }
        public static bool GetButton(string button) { return button == "Jump" && Engine.Held.Contains(KeyCode.Space); }
        public static float GetAxis(string axis) { float v; return Engine.Axes.TryGetValue(axis, out v) ? v : 0f; }
        public static float GetAxisRaw(string axis) { return GetAxis(axis); }
        public static bool GetMouseButtonDown(int button) { return button == 0 && Engine.Pressed(KeyCode.Mouse0); }
        public static Vector3 mousePosition { get { return Vector3.zero; } }
    }

    public enum ForceMode { Force, Acceleration, Impulse, VelocityChange }
    public enum ForceMode2D { Force, Impulse }

    public class Rigidbody : Component
    {
        public Vector3 velocity;
        public Vector3 linearVelocity { get { return velocity; } set { velocity = value; } }
        public Vector3 angularVelocity;
        public float mass = 1f;
        public bool useGravity = true;
        public bool isKinematic;
        public void AddForce(Vector3 force) { AddForce(force, ForceMode.Force); }
        public void AddForce(Vector3 force, ForceMode mode) { velocity += mode == ForceMode.Impulse ? force / mass : mode == ForceMode.VelocityChange ? force : force * Time.fixedDeltaTime / mass; }
        public void AddTorque(Vector3 torque) { }
        public void MovePosition(Vector3 p) { transform.position = p; }
    }

    public class Rigidbody2D : Component
    {
        public Vector2 velocity;
        public Vector2 linearVelocity { get { return velocity; } set { velocity = value; } }
        public float gravityScale = 1f;
        public float mass = 1f;
        public void AddForce(Vector2 force) { AddForce(force, ForceMode2D.Force); }
        public void AddForce(Vector2 force, ForceMode2D mode) { velocity = velocity + (mode == ForceMode2D.Impulse ? force * (1f / mass) : force * (Time.fixedDeltaTime / mass)); }
        public void MovePosition(Vector2 p) { transform.position = p; }
    }

    public class Collider : Component { public bool isTrigger; public bool enabled = true; }
    public class BoxCollider : Collider { }
    public class SphereCollider : Collider { public float radius = 0.5f; }
    public class CapsuleCollider : Collider { }
    public class Collider2D : Component { public bool isTrigger; }
    public class BoxCollider2D : Collider2D { }
    public class CircleCollider2D : Collider2D { }
    public class CharacterController : Component { public bool isGrounded = true; public void Move(Vector3 motion) { transform.position += motion; } }

    public class Collision
    {
        public GameObject gameObject;
        public Collider collider;
        public Transform transform { get { return gameObject.transform; } }
        public Vector3 relativeVelocity;
    }
    public class Collision2D
    {
        public GameObject gameObject;
        public Collider2D collider;
        public Transform transform { get { return gameObject.transform; } }
    }

    public struct Ray { public Vector3 origin, direction; public Ray(Vector3 o, Vector3 d) { origin = o; direction = d; } }
    public struct RaycastHit { public float distance; public Vector3 point; public Transform transform; public Collider collider; }
    public static class Physics
    {
        public static Vector3 gravity = new Vector3(0, -9.81f, 0);
        public static bool Raycast(Vector3 origin, Vector3 direction, out RaycastHit hit, float maxDistance) { hit = new RaycastHit(); return false; }
        public static bool Raycast(Vector3 origin, Vector3 direction, float maxDistance) { return false; }
        public static bool Raycast(Ray ray, out RaycastHit hit) { hit = new RaycastHit(); return false; }
        public static bool Raycast(Ray ray, out RaycastHit hit, float maxDistance) { hit = new RaycastHit(); return false; }
    }

    public class Camera : Behaviour
    {
        public static Camera main;
        public float fieldOfView = 60f;
        public Ray ScreenPointToRay(Vector3 p) { return new Ray(Vector3.zero, Vector3.forward); }
    }

    public class Material : Object { public Color color = Color.white; }
    public class Renderer : Component { public Material material = new Material(); public bool enabled = true; }
    public class MeshRenderer : Renderer { }
    public class SpriteRenderer : Renderer { public Color color = Color.white; public bool flipX; }
    public class AudioClip : Object { }
    public class AudioSource : Behaviour { public AudioClip clip; public float volume = 1f; public bool loop; public void Play() { } public void Stop() { } public void PlayOneShot(AudioClip c) { } }
    public class Animator : Behaviour { public void SetTrigger(string n) { } public void SetBool(string n, bool v) { } public void SetFloat(string n, float v) { } public void SetInteger(string n, int v) { } }
    public class ParticleSystem : Component { public void Play() { } public void Stop() { } }
    public class Light : Behaviour { public float intensity = 1f; public Color color = Color.white; }

    public static class Application
    {
        public static int targetFrameRate = -1;
        public static string persistentDataPath = "save";
        public static bool isEditor = false;
        public static void Quit() { }
    }

    public class ScriptableObject : Object { public static T CreateInstance<T>() where T : ScriptableObject, new() { return new T(); } }

    public class YieldInstruction { }
    public class WaitForSeconds : YieldInstruction { internal float seconds; public WaitForSeconds(float s) { seconds = s; } }
    public class WaitForEndOfFrame : YieldInstruction { }
    public class WaitForFixedUpdate : YieldInstruction { }
    public class WaitUntil : YieldInstruction { internal Func<bool> test; public WaitUntil(Func<bool> t) { test = t; } }
    public class Coroutine : YieldInstruction
    {
        internal IEnumerator routine; internal MonoBehaviour owner; internal bool done; internal float wakeAt; internal Func<bool> until;
        internal Coroutine(IEnumerator r, MonoBehaviour o) { routine = r; owner = o; }
        internal void Step()
        {
            if (done || owner.destroyed) { done = true; return; }
            if (until != null && !until()) return;
            if (Time.time + 1e-4f < wakeAt) return;
            until = null;
            if (!routine.MoveNext()) { done = true; return; }
            var y = routine.Current;
            if (y is WaitForSeconds w) wakeAt = Time.time + w.seconds;
            else if (y is WaitUntil u) until = u.test;
            else wakeAt = Time.time + Time.deltaTime;
        }
    }

    [AttributeUsage(AttributeTargets.Field)] public class SerializeField : Attribute { }
    [AttributeUsage(AttributeTargets.Field)] public class HideInInspector : Attribute { }
    [AttributeUsage(AttributeTargets.Field)] public class HeaderAttribute : Attribute { public HeaderAttribute(string h) { } }
    [AttributeUsage(AttributeTargets.Field)] public class TooltipAttribute : Attribute { public TooltipAttribute(string t) { } }
    [AttributeUsage(AttributeTargets.Field)] public class RangeAttribute : Attribute { public RangeAttribute(float a, float b) { } }
    [AttributeUsage(AttributeTargets.Field)] public class SpaceAttribute : Attribute { public SpaceAttribute() { } public SpaceAttribute(float h) { } }
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)] public class RequireComponent : Attribute { public RequireComponent(Type t) { } }
    [AttributeUsage(AttributeTargets.Class)] public class CreateAssetMenuAttribute : Attribute { public string fileName; public string menuName; public int order; }
    [AttributeUsage(AttributeTargets.Class)] public class DisallowMultipleComponent : Attribute { }

    public static class PlayerPrefs
    {
        static Dictionary<string, object> store = new Dictionary<string, object>();
        public static void SetInt(string k, int v) { store[k] = v; }
        public static int GetInt(string k, int d = 0) { object v; return store.TryGetValue(k, out v) ? (int)v : d; }
        public static void SetFloat(string k, float v) { store[k] = v; }
        public static float GetFloat(string k, float d = 0f) { object v; return store.TryGetValue(k, out v) ? (float)v : d; }
        public static void SetString(string k, string v) { store[k] = v; }
        public static string GetString(string k, string d = "") { object v; return store.TryGetValue(k, out v) ? (string)v : d; }
        public static bool HasKey(string k) { return store.ContainsKey(k); }
        public static void DeleteKey(string k) { store.Remove(k); }
        public static void Save() { }
    }

    public static class JsonUtility
    {
        public static string ToJson(object o) { return System.Text.Json.JsonSerializer.Serialize(o, o.GetType(), new System.Text.Json.JsonSerializerOptions { IncludeFields = true }); }
        public static T FromJson<T>(string json) { return System.Text.Json.JsonSerializer.Deserialize<T>(json, new System.Text.Json.JsonSerializerOptions { IncludeFields = true }); }
    }

    /* ---------- The test's frame loop ---------- */
    public static class Engine
    {
        internal static List<Object> All = new List<Object>();
        internal static List<Object> PendingDestroy = new List<Object>();
        internal static List<Coroutine> Coroutines = new List<Coroutine>();
        internal class Pending { public MonoBehaviour owner; public string method; public float at; public float every; }
        internal static List<Pending> Invokes = new List<Pending>();
        internal static HashSet<KeyCode> Held = new HashSet<KeyCode>();
        internal static Dictionary<string, float> Axes = new Dictionary<string, float>();
        static Dictionary<int, List<KeyCode>> presses = new Dictionary<int, List<KeyCode>>();
        static List<MonoBehaviour> started = new List<MonoBehaviour>();
        static List<MonoBehaviour> waiting = new List<MonoBehaviour>();

        internal static bool Pressed(KeyCode k) { List<KeyCode> l; return presses.TryGetValue(Time.frameCount, out l) && l.Contains(k); }
        public static void PressOnFrame(int frame, KeyCode key) { if (!presses.ContainsKey(frame)) presses[frame] = new List<KeyCode>(); presses[frame].Add(key); }
        public static void SetAxis(string axis, float value) { Axes[axis] = value; }
        public static void Hold(KeyCode key) { Held.Add(key); }

        internal static string Text(object m)
        {
            if (m == null) return "Null";
            if (m is float f) return f.ToString(CultureInfo.InvariantCulture);
            if (m is IFormattable fm) return fm.ToString(null, CultureInfo.InvariantCulture);
            return m.ToString();
        }
        static void Call(object target, string method, params object[] args)
        {
            var m = target.GetType().GetMethod(method, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
            if (m == null) return;
            var result = m.Invoke(target, m.GetParameters().Length == args.Length ? args : null);
            if (result is IEnumerator e && target is MonoBehaviour mb) mb.StartCoroutine(e);
        }
        internal static void Attach(Component c)
        {
            All.Add(c);
            if (c is MonoBehaviour mb) { Call(mb, "Awake"); Call(mb, "OnEnable"); waiting.Add(mb); }
        }
        internal static T Clone<T>(T original) where T : Object
        {
            GameObject src = original as GameObject ?? (original as Component)?.gameObject;
            var copy = new GameObject(src.name + "(Clone)") { tag = src.tag };
            copy.transform.position = src.transform.position;
            foreach (var c in src.components.Where(k => !(k is Transform)))
            {
                var made = (Component)Activator.CreateInstance(c.GetType());
                made.gameObject = copy; made.name = copy.name;
                foreach (var fld in c.GetType().GetFields(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic))
                    if (fld.DeclaringType != typeof(Component) && fld.DeclaringType != typeof(Object)) fld.SetValue(made, fld.GetValue(c));
                copy.components.Add(made); Attach(made);
            }
            if (original is GameObject) return copy as T;
            return copy.components.FirstOrDefault(k => k.GetType() == original.GetType()) as T;
        }
        /* Plays the scene: Start for every new script, then Update (and
           FixedUpdate at the same rate) for `frames` frames of `dt` seconds. */
        public static void Run(int frames, float dt)
        {
            Time.deltaTime = dt; Time.fixedDeltaTime = dt; Time.time = 0; Time.frameCount = 0;
            StartWaiting();
            for (int f = 1; f <= frames; f++)
            {
                Time.frameCount = f;
                Time.time += dt;
                foreach (var mb in Live()) Call(mb, "FixedUpdate");
                foreach (var mb in Live()) Call(mb, "Update");
                foreach (var c in Coroutines.ToList()) c.Step();
                foreach (var p in Invokes.ToList())
                {
                    if (Time.time + 1e-4f < p.at || p.owner.destroyed) continue;
                    Call(p.owner, p.method);
                    if (p.every > 0) p.at += p.every; else Invokes.Remove(p);
                }
                foreach (var mb in Live()) Call(mb, "LateUpdate");
                Flush();
                StartWaiting();
            }
        }
        /* Fires a collision or trigger between two objects, the way the
           physics engine would when they touch. */
        public static void Touch(GameObject a, GameObject b, bool trigger)
        {
            foreach (var mb in a.components.OfType<MonoBehaviour>().ToList())
            {
                if (trigger) { Call(mb, "OnTriggerEnter", b.GetComponent<Collider>()); Call(mb, "OnTriggerEnter2D", b.GetComponent<Collider2D>()); }
                else { Call(mb, "OnCollisionEnter", new Collision { gameObject = b, collider = b.GetComponent<Collider>() }); Call(mb, "OnCollisionEnter2D", new Collision2D { gameObject = b, collider = b.GetComponent<Collider2D>() }); }
            }
            Flush();
        }
        static IEnumerable<MonoBehaviour> Live() { return started.Where(m => !m.destroyed && m.enabled && m.gameObject.activeSelf).ToList(); }
        static void StartWaiting() { foreach (var mb in waiting.ToList()) { waiting.Remove(mb); started.Add(mb); Call(mb, "Start"); } }
        static void Flush()
        {
            foreach (var o in PendingDestroy.ToList())
            {
                var go = o as GameObject;
                if (go != null) foreach (var c in go.components) { if (c is MonoBehaviour mb) Call(mb, "OnDestroy"); c.destroyed = true; }
                else if (o is MonoBehaviour mb2) Call(mb2, "OnDestroy");
                o.destroyed = true;
            }
            PendingDestroy.Clear();
        }
    }
}

namespace UnityEngine.SceneManagement
{
    public struct Scene { public string name; public int buildIndex; }
    public static class SceneManager
    {
        public static void LoadScene(string name) { UnityEngine.Debug.Log("[Scene] loading " + name); }
        public static void LoadScene(int index) { UnityEngine.Debug.Log("[Scene] loading " + index); }
        public static Scene GetActiveScene() { return new Scene { name = "Level1", buildIndex = 0 }; }
    }
}

namespace UnityEngine.Events
{
    public delegate void UnityAction();
    public delegate void UnityAction<T0>(T0 arg0);
    public class UnityEvent
    {
        event UnityAction calls;
        public void AddListener(UnityAction a) { calls += a; }
        public void RemoveListener(UnityAction a) { calls -= a; }
        public void Invoke() { calls?.Invoke(); }
    }
    public class UnityEvent<T0>
    {
        event UnityAction<T0> calls;
        public void AddListener(UnityAction<T0> a) { calls += a; }
        public void RemoveListener(UnityAction<T0> a) { calls -= a; }
        public void Invoke(T0 v) { calls?.Invoke(v); }
    }
}

namespace UnityEngine.UI
{
    public class Graphic : Behaviour { public Color color = Color.white; }
    public class Text : Graphic { public string text = ""; }
    public class Image : Graphic { public float fillAmount = 1f; }
    public class Button : Behaviour { public UnityEngine.Events.UnityEvent onClick = new UnityEngine.Events.UnityEvent(); public bool interactable = true; }
    public class Slider : Behaviour { public float value; public float minValue; public float maxValue = 1f; }
    public class Toggle : Behaviour { public bool isOn; }
}

namespace TMPro
{
    public class TMP_Text : UnityEngine.UI.Graphic { public string text = ""; }
    public class TextMeshProUGUI : TMP_Text { }
    public class TextMeshPro : TMP_Text { }
}

namespace UnityEngine.InputSystem
{
    public class ButtonControl { public bool wasPressedThisFrame; public bool isPressed; public bool wasReleasedThisFrame; }
    public class Keyboard
    {
        public static Keyboard current = new Keyboard();
        public ButtonControl spaceKey = new ButtonControl(), wKey = new ButtonControl(), aKey = new ButtonControl(), sKey = new ButtonControl(), dKey = new ButtonControl(), escapeKey = new ButtonControl(), eKey = new ButtonControl();
    }
    public class Mouse { public static Mouse current = new Mouse(); public ButtonControl leftButton = new ButtonControl(); }
    public class InputAction { public InputAction(string name = null) { } public T ReadValue<T>() where T : struct { return default(T); } public bool WasPressedThisFrame() { return false; } public void Enable() { } }
}
