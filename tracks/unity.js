"use strict";
/* ================= UNITY — a Code Block track =================
   Game scripting in C# with the Unity engine (Unity 6), written fresh for
   Code Block in plain words. Facts and API names follow the Unity Manual
   and Scripting Reference (docs.unity3d.com).

   Honest limits: this site cannot run the Unity editor. The PC plays each
   practice script in a tiny stand-in engine (tests/content/stubs/unity):
   Start runs once, then Update runs for a few frames, and the screen shows
   what Debug.Log would print in Unity's Console. Every script and every
   library example is compiled against that stand-in's copy of the Unity
   API in the content tests, and every practice script's output is checked
   there — but physics, rendering and real input only exist in Unity. */
cbRegisterTrack("unity", function () {
  var blocks = [
    { name: "Script Block", short: "Script", chapter: "Unity Ch. 2 · Your First Script", icon: "i-file", verb: "attach",
      line: "public class Player : MonoBehaviour { }",
      explain: "Every Unity script is a class that extends MonoBehaviour. That word lets you attach the script to a GameObject as a component, and Unity will call its special methods for you." },
    { name: "Start Block", short: "Start", chapter: "Unity Ch. 2 · Your First Script", icon: "i-play", verb: "begin",
      line: 'void Start() { Debug.Log("Hello"); }',
      explain: "Unity calls Start once, just before the first frame the script is active. Debug.Log prints a message in the Console window — your best friend for seeing what a script is doing." },
    { name: "Update Block", short: "Update", chapter: "Unity Ch. 5 · Time and Frames", icon: "i-repeat", verb: "tick",
      line: "void Update() { }",
      explain: "Unity calls Update once every frame — often 60 times a second or more. Anything that must keep happening, like checking keys or moving, goes in here." },
    { name: "SerializeField Block", short: "Serialize", chapter: "Unity Ch. 3 · The Inspector", icon: "i-sliders", verb: "expose",
      line: "[SerializeField] float speed = 5f;",
      explain: "[SerializeField] shows a private field in the Inspector, so you can tune it without editing code, while other scripts still can't touch it. The f marks 5 as a float." },
    { name: "Public Field Block", short: "Public", chapter: "Unity Ch. 3 · The Inspector", icon: "i-box", verb: "share",
      line: "public int score = 0;",
      explain: "A public field appears in the Inspector AND can be changed by other scripts. Use [SerializeField] instead when only the Inspector needs to see it." },
    { name: "Position Block", short: "Position", chapter: "Unity Ch. 4 · Moving Things", icon: "i-cursor", verb: "move",
      line: "transform.position += Vector3.up;",
      explain: "Every GameObject has a Transform: its position, rotation and scale. Vector3.up is (0, 1, 0), so this moves the object one unit up — instantly, in one frame." },
    { name: "Translate Block", short: "Translate", chapter: "Unity Ch. 5 · Time and Frames", icon: "i-swap-h", verb: "glide",
      line: "transform.Translate(Vector3.forward * speed * Time.deltaTime);",
      explain: "Time.deltaTime is the time the last frame took. Multiplying by it turns “units per frame” into “units per second,” so movement is smooth and the same speed on every computer." },
    { name: "Rotate Block", short: "Rotate", chapter: "Unity Ch. 4 · Moving Things", icon: "i-rotate", verb: "spin",
      line: "transform.Rotate(0f, 90f * Time.deltaTime, 0f);",
      explain: "Rotate turns the object by angles in degrees around x, y and z. Turning 90 × deltaTime degrees every frame spins it a quarter turn each second around the y axis." },
    { name: "Axis Block", short: "Axis", chapter: "Unity Ch. 6 · Player Input", icon: "i-keyboard", verb: "steer",
      line: 'float h = Input.GetAxis("Horizontal");',
      explain: "GetAxis reads a smooth value from -1 to 1: the arrow keys, A/D or a gamepad stick. It's how you steer: multiply it by speed to move left and right." },
    { name: "Key Block", short: "Key", chapter: "Unity Ch. 6 · Player Input", icon: "i-play-circle", verb: "press",
      line: "if (Input.GetKeyDown(KeyCode.Space)) { Jump(); }",
      explain: "GetKeyDown is true only in the one frame a key goes down — perfect for jumping. GetKey stays true while the key is held, for things like running." },
    { name: "GetComponent Block", short: "GetComp", chapter: "Unity Ch. 10 · Scripts Talking", icon: "i-link", verb: "find",
      line: "Rigidbody rb = GetComponent<Rigidbody>();",
      explain: "GetComponent finds another component on the same GameObject. Call it once in Start or Awake and keep the result in a field — searching every frame is slow." },
    { name: "Force Block", short: "Force", chapter: "Unity Ch. 7 · Physics", icon: "i-burst", verb: "push",
      line: "rb.AddForce(Vector3.up * 5f, ForceMode.Impulse);",
      explain: "AddForce pushes a Rigidbody using the physics engine. ForceMode.Impulse is an instant kick, like a jump; the default mode is a steady push, like an engine." },
    { name: "Collision Block", short: "Collide", chapter: "Unity Ch. 8 · Collisions", icon: "i-shield-alert", verb: "bump",
      line: "void OnCollisionEnter(Collision other) { }",
      explain: "Unity calls OnCollisionEnter when this object's collider hits another solid collider. other tells you what you hit — the floor, a wall, an enemy." },
    { name: "Trigger Block", short: "Trigger", chapter: "Unity Ch. 8 · Collisions", icon: "i-eye", verb: "sense",
      line: "void OnTriggerEnter(Collider other) { }",
      explain: "A trigger is a collider you can pass through, used as a sensor: a coin to collect, a finish line, a door's detection zone. Tick Is Trigger on the collider to make one." },
    { name: "Tag Block", short: "Tag", chapter: "Unity Ch. 8 · Collisions", icon: "i-tag", verb: "check",
      line: 'if (other.CompareTag("Coin")) { Destroy(other.gameObject); }',
      explain: "Tags label GameObjects, like Coin or Enemy. CompareTag checks the label quickly, and Destroy removes the coin from the scene." },
    { name: "Instantiate Block", short: "Spawn", chapter: "Unity Ch. 9 · Prefabs", icon: "i-plus-square", verb: "spawn",
      line: "Instantiate(bulletPrefab, transform.position, transform.rotation);",
      explain: "Instantiate makes a new copy of a prefab — a saved, reusable GameObject — at a position and rotation. Bullets, enemies and pickups are all spawned this way." },
    { name: "Destroy Block", short: "Destroy", chapter: "Unity Ch. 9 · Prefabs", icon: "i-x", verb: "remove",
      line: "Destroy(gameObject, 2f);",
      explain: "Destroy removes a GameObject. The second number is a delay in seconds — handy for bullets and explosions that should clean themselves up." },
    { name: "Direction Block", short: "Direction", chapter: "Unity Ch. 11 · Vectors", icon: "i-point", verb: "aim",
      line: "Vector3 dir = (target.position - transform.position).normalized;",
      explain: "Subtracting two positions gives the arrow from one to the other. normalized shrinks that arrow to length 1, so it says only which way — perfect for aiming and chasing." },
    { name: "Distance Block", short: "Distance", chapter: "Unity Ch. 11 · Vectors", icon: "i-gap", verb: "measure",
      line: "float dist = Vector3.Distance(a, b);",
      explain: "Vector3.Distance gives the straight-line distance between two points in units (Unity's units are usually meters). Enemies use it to decide when to chase or attack." },
    { name: "Clamp Block", short: "Clamp", chapter: "Unity Ch. 11 · Vectors", icon: "i-gauge", verb: "limit",
      line: "hp = Mathf.Clamp(hp - damage, 0, 100);",
      explain: "Mathf.Clamp keeps a value between a minimum and a maximum. Here health can never fall below 0 or rise above 100, whatever happens." },
    { name: "Coroutine Block", short: "Coroutine", chapter: "Unity Ch. 12 · Coroutines", icon: "i-hourglass", verb: "start",
      line: "StartCoroutine(Blink());",
      explain: "A coroutine is a method that can pause and continue later, across many frames. StartCoroutine kicks it off; the rest of the game keeps running meanwhile." },
    { name: "Wait Block", short: "Wait", chapter: "Unity Ch. 12 · Coroutines", icon: "i-clock", verb: "pause",
      line: "yield return new WaitForSeconds(1f);",
      explain: "Inside a coroutine, yield return pauses it. WaitForSeconds(1f) means “come back in one second.” Timers, countdowns and flashing effects are built this way." },
    { name: "Scene Block", short: "Scene", chapter: "Unity Ch. 14 · Scenes and Saving", icon: "i-flag", verb: "load",
      line: 'SceneManager.LoadScene("Level2");',
      explain: "A scene is one level or screen of your game. SceneManager.LoadScene swaps to another one; the scene must be listed in the Build Profiles (Build Settings) window." },
    { name: "PlayerPrefs Block", short: "Save", chapter: "Unity Ch. 14 · Scenes and Saving", icon: "i-folder", verb: "save",
      line: 'PlayerPrefs.SetInt("best", score);',
      explain: "PlayerPrefs saves small values — a best score, a volume setting — that survive after the game closes. Read them back with PlayerPrefs.GetInt(\"best\", 0)." },
    { name: "UI Text Block", short: "UI Text", chapter: "Unity Ch. 13 · UI", icon: "i-say", verb: "show",
      line: 'scoreText.text = $"Score: {score}";',
      explain: "scoreText is a TextMeshPro text on the screen's Canvas. Setting its text changes what the player sees. The $ string fills {score} with the current value." },
    { name: "Button Block", short: "Button", chapter: "Unity Ch. 13 · UI", icon: "i-cursor", verb: "listen",
      line: "playButton.onClick.AddListener(StartGame);",
      explain: "A UI Button has an onClick event. AddListener tells it which method to run when it's clicked — here, StartGame." },
    { name: "Log Block", short: "Log", chapter: "Unity Ch. 2 · Your First Script", icon: "i-help", verb: "report",
      line: 'Debug.Log($"HP: {hp}");',
      explain: "Debug.Log with a $ string prints values into the Console while the game runs. It's the quickest way to check that a number is what you think it is." },
    { name: "Asset Menu Block", short: "Asset Menu", chapter: "Unity Ch. 15 · ScriptableObjects", icon: "i-layers", verb: "create",
      line: '[CreateAssetMenu(menuName = "Game/Item")]',
      explain: "This attribute adds your ScriptableObject to the Create menu in the Project window, so designers can make new item assets with a right-click." },
    { name: "ScriptableObject Block", short: "SO", chapter: "Unity Ch. 15 · ScriptableObjects", icon: "i-boxes", verb: "store",
      line: "public class Item : ScriptableObject { public string title; }",
      explain: "A ScriptableObject is a data container saved as an asset file, not attached to a GameObject. Swords, recipes and level settings live happily in them." },
    { name: "Animator Block", short: "Animator", chapter: "Unity Ch. 16 · Animation and Audio", icon: "i-star", verb: "animate",
      line: 'animator.SetTrigger("Jump");',
      explain: "An Animator plays animations through a state machine. SetTrigger fires a one-time signal named in the Animator window, and the character switches to its jump animation." }
  ];

  var chapters = [
    { title: "What Is Unity?", chapter: "Start here · the editor, scenes, GameObjects", line: "gameObject.AddComponent<Rigidbody>();",
      content: {
        story: ["Unity is a game engine: a big toolbox and editor for building games and interactive 3D or 2D worlds. It handles drawing, physics, sound and input for you, and you add the rules of your game with C# scripts. Many famous games and countless indie games are made with it.",
          "Everything in a Unity scene is a GameObject — the player, a coin, a light, the camera. A GameObject on its own is an empty container; what makes it something is its components. A Transform gives it a place in the world, a Mesh Renderer makes it visible, a Rigidbody makes physics push it around, and your scripts give it behaviour.",
          "The editor has a few main windows: the Scene view where you arrange things, the Game view that shows what the player sees, the Hierarchy listing every GameObject, the Project window with your files, and the Inspector showing the selected object's components. Press Play to try your game right inside the editor."],
        big: "In Unity, everything is a GameObject, and GameObjects become things by having components — including your own scripts.",
        caption: "An empty GameObject collects components one by one until it becomes a player. Tap Play.",
        demo: ["Create → Empty GameObject", "+ Mesh Renderer → you can see it", "+ Rigidbody → gravity pulls it", "+ PlayerController script → it obeys you"]
      },
      deep: {
        more: ["Unity is free to start with (Unity Personal), and installs through the Unity Hub, which manages editor versions and projects. Unity 6 is the current major version. Scripts are edited in a code editor such as Visual Studio, VS Code or JetBrains Rider.",
          "Changes you make in Play mode are thrown away when you stop playing. It's the number-one beginner surprise: tune values in Play mode, note them down, then set them again after stopping."],
        ex: { code: "using UnityEngine;\n\npublic class Greeter : MonoBehaviour\n{\n    void Start()\n    {\n        Debug.Log($\"{gameObject.name} is in the scene!\");\n        Debug.Log($\"It is at {transform.position}\");\n    }\n}",
          walk: ["Line 1: the Unity toolbox — every script starts here.", "Line 3: a script is a class that extends MonoBehaviour.", "Line 5: Start runs once when the game begins.", "Line 7: gameObject is the object this script is attached to.", "Line 8: transform holds its position in the world."] },
        mistake: "Writing a script but never attaching it. A script file does nothing until it's added as a component to a GameObject in the scene — drag it onto the object, or use Add Component in the Inspector."
      } },
    { title: "Your First Script", chapter: "MonoBehaviour, Start, Update and Debug.Log", line: 'void Start() { Debug.Log("Hello"); }',
      content: {
        story: ["Create a script with Assets → Create → MonoBehaviour Script (in older versions, C# Script), and name it carefully: the file name and the class name inside must match exactly, including capital letters, or Unity can't attach it.",
          "Unity calls certain methods automatically. Start runs once, just before the object's first frame. Update runs every frame. You never call them yourself — Unity does, as long as they're spelled exactly right.",
          "Debug.Log(\"message\") prints to the Console window. Use it constantly: to check that code runs at all, to see a value, to follow the order things happen in. Clear the Console often so old messages don't confuse you."],
        big: "A script is a MonoBehaviour attached to a GameObject; Unity calls Start once and Update every frame, and Debug.Log shows you what's happening.",
        caption: "Start says hello once; Update ticks on every frame like a metronome. Tap Play.",
        demo: ["Press Play ▶", "Start → \"Hello, Unity!\"", "Update → frame 1", "Update → frame 2 …"]
      },
      deep: {
        more: ["Awake runs even earlier than Start — as soon as the object is created — and is the place to set up references to the object's own components. Start is better for anything that depends on other objects being ready.",
          "A misspelled Update (like update with a small u) is just a normal method Unity never calls, and there's no error. If a method seems to never run, check its spelling first."],
        ex: { code: "using UnityEngine;\n\npublic class FrameCounter : MonoBehaviour\n{\n    int frames = 0;\n\n    void Start()\n    {\n        Debug.Log(\"Counting frames...\");\n    }\n\n    void Update()\n    {\n        frames++;\n        if (frames % 60 == 0)\n        {\n            Debug.Log($\"{frames} frames so far\");\n        }\n    }\n}",
          walk: ["Line 5: a private counter, starting at 0.", "Lines 7–10: Start prints once.", "Line 14: Update adds one every frame.", "Lines 15–18: every 60th frame, report the count — about once a second at 60 frames per second."] },
        mistake: "Naming the file PlayerMovement.cs but the class Movement. Unity says the script class can't be found. The file name and the class name must be identical."
      } },
    { title: "Variables and the Inspector", chapter: "public, [SerializeField], Header and Range", line: "[SerializeField] float speed = 5f;",
      content: {
        story: ["Fields declared at the top of your class become settings you can change in the Inspector — no code editing needed. That's how designers tune speed, jump height and health while testing.",
          "A public field shows in the Inspector and can be changed by any other script. A private field marked [SerializeField] shows in the Inspector but stays private in code — the recommended default.",
          "Attributes make the Inspector friendlier: [Header(\"Movement\")] adds a heading, [Range(0, 10)] turns a number into a slider, and [Tooltip(\"…\")] explains a setting when you hover over it."],
        big: "Fields become Inspector settings; prefer private [SerializeField] fields, and decorate them with Header, Range and Tooltip.",
        caption: "A script's fields appear in the Inspector as boxes and sliders you can tweak. Tap Play.",
        demo: ["[Header(\"Movement\")]", "[SerializeField] float speed = 5f;", "[Range(1, 20)] → a slider", "Inspector value wins over the code's 5f"]
      },
      deep: {
        more: ["The Inspector's value wins: once a component exists in the scene, the number saved in the scene overrides the default written in code. Changing 5f to 8f in code won't change objects that already exist — reset the component or edit the Inspector.",
          "Floats need the f suffix: float speed = 5.5f;. Without it, 5.5 is a double and C# refuses to squeeze it into a float."],
        ex: { code: "using UnityEngine;\n\npublic class Mover : MonoBehaviour\n{\n    [Header(\"Movement\")]\n    [SerializeField, Range(1f, 20f)] float speed = 5f;\n    [Tooltip(\"Can this object jump?\")]\n    [SerializeField] bool canJump = true;\n    public int lives = 3;\n\n    void Start()\n    {\n        Debug.Log($\"speed {speed}, jump {canJump}, lives {lives}\");\n    }\n}",
          walk: ["Line 5: a heading in the Inspector.", "Line 6: a private float shown as a 1–20 slider.", "Lines 7–8: a checkbox with a hover hint.", "Line 9: public — other scripts can change lives.", "Line 13: report the values the Inspector holds."] },
        mistake: "Making everything public so it shows in the Inspector. Then any script can change anything, and bugs become hard to trace. Use [SerializeField] private fields instead."
      } },
    { title: "Moving Things", chapter: "Transform, Vector3, position, rotation, scale", line: "transform.position += Vector3.up;",
      content: {
        story: ["Every GameObject has a Transform with three parts: position (where it is), rotation (which way it faces) and scale (how big it is). In a script, transform gives you this object's Transform.",
          "Positions are Vector3 values: three numbers x, y and z. In Unity, y is up. Vector3.up is (0, 1, 0), Vector3.forward is (0, 0, 1) and Vector3.right is (1, 0, 0). Add vectors to move: transform.position += new Vector3(1, 0, 0) steps one unit right.",
          "Rotate turns an object by degrees around each axis, and Translate moves it along its own facing directions. localScale = new Vector3(2, 2, 2) makes an object twice as big."],
        big: "transform holds position, rotation and scale; Vector3 values describe positions and directions, with y pointing up.",
        caption: "A cube steps along the x arrow, hops up the y arrow and turns around the y axis. Tap Play.",
        demo: ["position (0, 0, 0)", "+= Vector3.right → (1, 0, 0)", "+= Vector3.up → (1, 1, 0)", "Rotate(0, 90, 0) → faces right"]
      },
      deep: {
        more: ["Unity stores rotations as Quaternions, a maths trick that avoids getting stuck. You rarely touch them directly: use transform.Rotate, Quaternion.Euler(x, y, z) to build one from degrees, and transform.eulerAngles to read degrees back.",
          "position is in world space; localPosition is relative to the parent object. Children move with their parents — a sword parented to a hand follows the hand."],
        ex: { code: "using UnityEngine;\n\npublic class Stepper : MonoBehaviour\n{\n    void Start()\n    {\n        transform.position = Vector3.zero;\n        transform.position += Vector3.right * 3f;\n        transform.position += Vector3.up;\n        transform.Rotate(0f, 90f, 0f);\n        transform.localScale = new Vector3(2f, 2f, 2f);\n        Debug.Log($\"Now at {transform.position}, facing {transform.eulerAngles.y} degrees\");\n    }\n}",
          walk: ["Line 7: start at the world's centre.", "Line 8: three units along x.", "Line 9: one unit up.", "Line 10: turn a quarter circle around y.", "Line 11: twice as big in every direction.", "Line 12: (3.00, 1.00, 0.00), facing 90 degrees."] },
        mistake: "Trying to change one part of position directly: transform.position.x = 5; is an error, because position hands you a copy. Copy, change, put back: var p = transform.position; p.x = 5; transform.position = p;."
      } },
    { title: "Time and Frames", chapter: "Update, Time.deltaTime, FixedUpdate", line: "transform.Translate(Vector3.forward * speed * Time.deltaTime);",
      content: {
        story: ["Games are drawn as a fast flip-book: each picture is a frame, and Update runs once per frame. But frame rates differ — a fast computer might run 144 frames a second, a phone 30.",
          "If you move 0.1 units every frame, the fast computer moves almost five times faster than the phone. Time.deltaTime fixes this: it's the seconds the last frame took. Multiply movement by it and speed becomes units per second, the same everywhere.",
          "Physics runs in FixedUpdate instead, on a steady clock (50 times a second by default). Put Rigidbody forces in FixedUpdate, and input checks plus non-physics movement in Update."],
        big: "Multiply anything that changes over time by Time.deltaTime, so it moves per second rather than per frame.",
        caption: "Two runners on different computers finish together, because both use deltaTime. Tap Play.",
        demo: ["fast PC: 144 frames, tiny steps", "phone: 30 frames, bigger steps", "speed * Time.deltaTime", "→ both move 5 units every second"]
      },
      deep: {
        more: ["Time.time is the seconds since the game started, handy for timers: if (Time.time > nextShot). Time.timeScale slows or pauses the whole game — set it to 0 for a pause menu, 1 for normal speed.",
          "LateUpdate runs after every Update has finished each frame, which makes it the right place for a camera that follows the player."],
        ex: { code: "using UnityEngine;\n\npublic class Glider : MonoBehaviour\n{\n    [SerializeField] float speed = 2f;\n    float travelled = 0f;\n\n    void Update()\n    {\n        float step = speed * Time.deltaTime;\n        transform.Translate(Vector3.forward * step);\n        travelled += step;\n    }\n\n    void LateUpdate()\n    {\n        if (Time.frameCount % 120 == 0)\n        {\n            Debug.Log($\"Travelled {travelled:F1} units in {Time.time:F1} seconds\");\n        }\n    }\n}",
          walk: ["Line 5: two units per second.", "Line 10: how far to move THIS frame.", "Line 11: move forward by that much.", "Line 12: keep a running total.", "Lines 15–21: every 120 frames, report distance and time — the ratio is always about 2."] },
        mistake: "Forgetting deltaTime: transform.Translate(Vector3.forward * speed); moves speed units EVERY FRAME, so the object shoots off at hundreds of units per second, faster on faster computers."
      } },
    { title: "Player Input", chapter: "Keys, axes and the Input System", line: 'float h = Input.GetAxis("Horizontal");',
      content: {
        story: ["Games listen to the player. The classic Input class answers simple questions: Input.GetKeyDown(KeyCode.Space) is true in the one frame Space goes down, Input.GetKey(KeyCode.LeftShift) while Shift is held, and Input.GetMouseButtonDown(0) when the left mouse button is clicked.",
          "Axes are smoother: Input.GetAxis(\"Horizontal\") gives a value from -1 (left) to 1 (right) from the arrow keys, A/D or a gamepad stick. Multiply by speed and deltaTime to steer.",
          "New Unity 6 projects use the Input System package, which handles keyboards, gamepads and touch screens through named actions like Move and Jump. The classic Input class still works when Active Input Handling is set to Both — great for learning — and the ideas are the same."],
        big: "Check keys with GetKeyDown and GetKey, steer with GetAxis, and graduate to the Input System's actions for bigger games.",
        caption: "Arrow keys tilt an axis needle from -1 to 1, and Space flashes for exactly one frame. Tap Play.",
        demo: ["no keys → Horizontal = 0", "→ held → Horizontal = 1", "Space down → GetKeyDown true (one frame)", "Space held → GetKey true"]
      },
      deep: {
        more: ["Read input in Update, never in FixedUpdate: a key press lasts one frame, and FixedUpdate might not run during that frame, so presses get lost. Save what you read in a field and use it in FixedUpdate if physics needs it.",
          "With the Input System, Keyboard.current.spaceKey.wasPressedThisFrame is the direct equivalent of GetKeyDown(KeyCode.Space). Input Actions go further: one Jump action can mean Space, a gamepad button and a screen tap at once."],
        ex: { code: "using UnityEngine;\n\npublic class Walker : MonoBehaviour\n{\n    [SerializeField] float speed = 4f;\n\n    void Update()\n    {\n        float h = Input.GetAxis(\"Horizontal\");\n        float v = Input.GetAxis(\"Vertical\");\n        Vector3 move = new Vector3(h, 0f, v);\n        transform.position += move * speed * Time.deltaTime;\n\n        if (Input.GetKeyDown(KeyCode.Space))\n        {\n            Debug.Log(\"Jump!\");\n        }\n    }\n}",
          walk: ["Lines 9–10: left/right and forward/back, each -1 to 1.", "Line 11: combine them into a direction on the ground.", "Line 12: move by it, per second.", "Lines 14–17: Space prints once per press."] },
        mistake: "Using GetKey for a jump. GetKey stays true every frame the key is held, so the character jumps again and again. Use GetKeyDown for one-time actions."
      } },
    { title: "Physics", chapter: "Rigidbody, colliders, gravity and forces", line: "rb.AddForce(Vector3.up * 5f, ForceMode.Impulse);",
      content: {
        story: ["Add a Rigidbody component and the physics engine takes over the object: gravity pulls it down, it slides, bounces and tumbles. Colliders give objects a physical shape — Box, Sphere, Capsule or Mesh — so they bump into each other.",
          "You move physics objects with forces instead of setting their position: rb.AddForce(Vector3.forward * 10f) pushes steadily, and ForceMode.Impulse gives one instant kick. Rigidbody.mass decides how heavy it feels, and drag slows it down.",
          "Physics code belongs in FixedUpdate, which runs on a steady clock. For a character you control directly, set Is Kinematic, or use a CharacterController instead of a Rigidbody."],
        big: "A Rigidbody puts an object under physics; colliders give it shape; push it with AddForce in FixedUpdate.",
        caption: "A ball gets an impulse kick upward, gravity slows it, and it lands on the floor's collider. Tap Play.",
        demo: ["+ Rigidbody → it falls", "+ Sphere Collider → it lands", "AddForce(up * 5, Impulse) → it hops", "mass 2 → the same kick, half the speed"]
      },
      deep: {
        more: ["An impulse changes velocity by force ÷ mass, so the same kick moves a heavy crate less than a light ball. In Unity 6 the velocity property is named linearVelocity (the old name, velocity, still works but is marked obsolete).",
          "For 2D games there's a parallel set: Rigidbody2D, BoxCollider2D, CircleCollider2D and Vector2 forces. 2D and 3D physics never interact with each other."],
        ex: { code: "using UnityEngine;\n\n[RequireComponent(typeof(Rigidbody))]\npublic class Bouncer : MonoBehaviour\n{\n    [SerializeField] float kick = 6f;\n    Rigidbody rb;\n    bool kickNext;\n\n    void Awake()\n    {\n        rb = GetComponent<Rigidbody>();\n    }\n\n    void Update()\n    {\n        if (Input.GetKeyDown(KeyCode.Space)) kickNext = true;\n    }\n\n    void FixedUpdate()\n    {\n        if (kickNext)\n        {\n            rb.AddForce(Vector3.up * kick, ForceMode.Impulse);\n            kickNext = false;\n        }\n    }\n}",
          walk: ["Line 3: RequireComponent adds a Rigidbody automatically if it's missing.", "Lines 10–13: find the Rigidbody once.", "Lines 15–18: read input in Update and remember it.", "Lines 20–27: apply the force in FixedUpdate, on the physics clock."] },
        mistake: "Moving a Rigidbody by setting transform.position every frame. It teleports through walls and fights the physics engine. Use AddForce or rb.MovePosition."
      } },
    { title: "Collisions and Triggers", chapter: "OnCollisionEnter, OnTriggerEnter, tags", line: "void OnTriggerEnter(Collider other) { }",
      content: {
        story: ["When two colliders touch, Unity tells your scripts. OnCollisionEnter(Collision other) runs when solid objects hit; OnTriggerEnter(Collider other) runs when something enters a trigger — a collider with Is Trigger ticked, which things pass through.",
          "Triggers are sensors: coins, checkpoints, the zone around a door. Solid collisions are for floors, walls and crashes. Each has Stay and Exit versions too, for “still touching” and “stopped touching.”",
          "To know WHAT you touched, use tags: set a Coin tag on coin objects, then if (other.CompareTag(\"Coin\")). At least one of the two objects needs a Rigidbody for these messages to be sent."],
        big: "Solid colliders send OnCollisionEnter, trigger colliders send OnTriggerEnter, and CompareTag tells you what you touched.",
        caption: "The player runs through a coin (a trigger) and bumps into a wall (a collision). Tap Play.",
        demo: ["player enters coin trigger", "OnTriggerEnter → CompareTag(\"Coin\")", "score += 10, Destroy(coin)", "player hits wall → OnCollisionEnter"]
      },
      deep: {
        more: ["2D games use the 2D versions: OnCollisionEnter2D(Collision2D other) and OnTriggerEnter2D(Collider2D other). Mixing a 2D method with 3D colliders silently does nothing.",
          "The Layer Collision Matrix (Project Settings → Physics) decides which layers can touch at all — for example, so enemies' bullets pass through other enemies."],
        ex: { code: "using UnityEngine;\n\npublic class Pickup : MonoBehaviour\n{\n    int coins = 0;\n\n    void OnTriggerEnter(Collider other)\n    {\n        if (other.CompareTag(\"Coin\"))\n        {\n            coins++;\n            Debug.Log($\"Coins: {coins}\");\n            Destroy(other.gameObject);\n        }\n    }\n\n    void OnCollisionEnter(Collision hit)\n    {\n        if (hit.gameObject.CompareTag(\"Enemy\"))\n        {\n            Debug.Log(\"Ouch!\");\n        }\n    }\n}",
          walk: ["Lines 7–15: a trigger touched — if it's a coin, count it and remove it.", "Lines 17–23: a solid hit — if it's an enemy, say ouch.", "Note: other is a Collider; hit is a Collision that holds the gameObject."] },
        mistake: "Ticking Is Trigger and then waiting for OnCollisionEnter, or the other way round. Triggers only send OnTrigger… messages; solid colliders only send OnCollision… messages."
      } },
    { title: "Prefabs and Spawning", chapter: "Prefabs, Instantiate and Destroy", line: "Instantiate(enemyPrefab, spot, Quaternion.identity);",
      content: {
        story: ["A prefab is a GameObject saved as a reusable template in your Project window — drag an object from the Hierarchy into the Project to make one. Every copy in your scenes stays linked, so changing the prefab changes them all.",
          "In code, Instantiate(prefab, position, rotation) makes a new copy while the game runs. Give your script a public GameObject field (or [SerializeField]), drag the prefab into it in the Inspector, and spawn as many as you like.",
          "Destroy(obj) removes an object, and Destroy(obj, 3f) removes it after 3 seconds. Spawned copies are named after the prefab with (Clone) on the end."],
        big: "Prefabs are reusable templates; Instantiate copies them into the running game and Destroy removes them.",
        caption: "A spawner stamps out enemies in a row from one prefab template. Tap Play.",
        demo: ["enemyPrefab (in the Project)", "Instantiate at x = 0", "Instantiate at x = 2", "Instantiate at x = 4"]
      },
      deep: {
        more: ["Instantiating and destroying hundreds of objects a second (bullets, sparks) can stutter. Object pooling reuses a set of objects instead: deactivate one when it's done, reactivate it next time. Unity 6 includes ObjectPool<T> in UnityEngine.Pool.",
          "Instantiate returns the new copy, so you can change it right away: var e = Instantiate(enemyPrefab); e.name = \"Boss\";."],
        ex: { code: "using UnityEngine;\n\npublic class Spawner : MonoBehaviour\n{\n    [SerializeField] GameObject enemyPrefab;\n    [SerializeField] int count = 3;\n    [SerializeField] float spacing = 2f;\n\n    void Start()\n    {\n        for (int i = 0; i < count; i++)\n        {\n            Vector3 spot = transform.position + Vector3.right * (i * spacing);\n            GameObject enemy = Instantiate(enemyPrefab, spot, Quaternion.identity);\n            Destroy(enemy, 10f);\n        }\n    }\n}",
          walk: ["Line 5: drag the prefab here in the Inspector.", "Lines 11–16: make count copies in a row.", "Line 13: each one spacing units further right.", "Line 14: Quaternion.identity means no rotation.", "Line 15: each one cleans itself up after 10 seconds."] },
        mistake: "Destroying the prefab itself instead of the copy: Destroy(enemyPrefab) tries to delete the template asset. Keep the value Instantiate returns and destroy that."
      } },
    { title: "Scripts Talking to Each Other", chapter: "GetComponent, references and events", line: "Health health = GetComponent<Health>();",
      content: {
        story: ["Games are teams of scripts: a Player script asks a Health script to take damage, a GameManager tells the UI to show the score. To talk, one script needs a reference to the other.",
          "On the same GameObject, GetComponent<Health>() finds the component. For other objects, give your script a [SerializeField] field and drag the object in the Inspector — the most reliable way. GameObject.Find and FindFirstObjectByType work too, but they're slow and break when names change.",
          "Events let scripts announce things without knowing who's listening: a Health script can raise OnDied, and the UI, the sound system and the score keeper each subscribe."],
        big: "Get references with GetComponent or Inspector fields, then call public methods — or raise events that others listen to.",
        caption: "Three scripts pass a message along like a relay baton. Tap Play.",
        demo: ["Player: health.TakeDamage(20)", "Health: hp 100 → 80", "Health: hp hits 0 → OnDied event", "UI and Score both hear it"]
      },
      deep: {
        more: ["Cache component references: call GetComponent once in Awake or Start and keep the answer in a field. Calling it every frame works, but wastes time.",
          "UnityEvent fields appear in the Inspector, so designers can wire responses without code; plain C# events (event Action) are faster and code-only. Both follow the same idea: announce, don't reach in."],
        ex: { code: "using System;\nusing UnityEngine;\n\npublic class Health : MonoBehaviour\n{\n    public event Action Died;\n    [SerializeField] int hp = 100;\n\n    public void TakeDamage(int amount)\n    {\n        hp = Mathf.Max(hp - amount, 0);\n        Debug.Log($\"HP: {hp}\");\n        if (hp == 0) Died?.Invoke();\n    }\n}\n\npublic class Player : MonoBehaviour\n{\n    Health health;\n\n    void Start()\n    {\n        health = GetComponent<Health>();\n        health.Died += () => Debug.Log(\"Game over\");\n        health.TakeDamage(60);\n        health.TakeDamage(60);\n    }\n}",
          walk: ["Line 6: an event other scripts can listen to.", "Lines 9–14: lower hp, report it, announce death at 0.", "Line 23: find the Health on the same object.", "Line 24: listen for Died.", "Lines 25–26: HP: 40, then HP: 0 and Game over."] },
        mistake: "NullReferenceException: Object reference not set. The most common Unity error — a field was never assigned in the Inspector, or GetComponent found nothing. Check the Inspector for empty slots."
      } },
    { title: "Vectors and Game Math", chapter: "Direction, distance, normalized, Lerp, Mathf", line: "Vector3 dir = (target.position - transform.position).normalized;",
      content: {
        story: ["Game maths is mostly arrows. Subtract two positions and you get the arrow from one to the other: target.position - transform.position. Its length (magnitude) is the distance, and normalized keeps just the direction with length 1.",
          "Vector3.Distance(a, b) measures distance directly. Vector3.MoveTowards(current, target, step) steps toward a target without overshooting, and Vector3.Lerp(a, b, t) finds the point a fraction t of the way between two points — 0.5 is halfway.",
          "Mathf is the toolbox for single numbers: Clamp keeps a value in a range, Abs removes the minus sign, RoundToInt rounds, Lerp blends numbers, and PingPong bounces a value back and forth."],
        big: "Subtract positions for a direction, normalize it to aim, and use Distance, MoveTowards, Lerp and Mathf.Clamp for everyday game maths.",
        caption: "An arrow stretches from the hunter to the target; normalized shrinks it to a pointer. Tap Play.",
        demo: ["target - me → (6, 0, 8)", "magnitude → 10 (the distance)", "normalized → (0.6, 0, 0.8)", "MoveTowards: one safe step closer"]
      },
      deep: {
        more: ["Vector3.Dot tells you whether two directions agree: positive means roughly the same way, negative means opposite — a quick “is the player in front of me?” test.",
          "Lerp with a fixed t each frame (like 0.1) gives a smooth ease-out: it always moves a tenth of the remaining way, slowing as it arrives. It's a favourite trick for cameras."],
        ex: { code: "using UnityEngine;\n\npublic class Chaser : MonoBehaviour\n{\n    [SerializeField] Transform target;\n    [SerializeField] float speed = 3f;\n    [SerializeField] float stopDistance = 1.5f;\n\n    void Update()\n    {\n        if (target == null) return;\n        float dist = Vector3.Distance(transform.position, target.position);\n        if (dist > stopDistance)\n        {\n            Vector3 dir = (target.position - transform.position).normalized;\n            transform.position += dir * speed * Time.deltaTime;\n        }\n    }\n}",
          walk: ["Line 5: who to chase, set in the Inspector.", "Line 11: do nothing if no target was assigned.", "Line 12: how far away it is.", "Lines 13–17: if not close enough, step toward it at speed units per second."] },
        mistake: "Moving by the un-normalized difference: position += (target - position) * speed * deltaTime moves FASTER when the target is far away, because the arrow is longer. Normalize first for a steady speed."
      } },
    { title: "Coroutines and Timers", chapter: "IEnumerator, yield, WaitForSeconds, Invoke", line: "yield return new WaitForSeconds(1f);",
      content: {
        story: ["Some things happen over time: a countdown, a flashing hit effect, an enemy wave every ten seconds. A coroutine is a method that can pause partway and continue later, without freezing the game.",
          "Write it as a method returning IEnumerator (add using System.Collections;), and pause with yield return: yield return null waits one frame, yield return new WaitForSeconds(2f) waits two seconds. Start it with StartCoroutine(MyRoutine()).",
          "For simple delays, Invoke(\"MethodName\", 2f) calls a method after two seconds, and InvokeRepeating calls one again and again. A timer float in Update works too: timer += Time.deltaTime."],
        big: "Coroutines pause with yield return and continue later; Invoke and timers handle simple delays.",
        caption: "A countdown coroutine says 3, waits, 2, waits, 1, waits — Go! — while the game keeps running. Tap Play.",
        demo: ["StartCoroutine(Countdown())", "\"3...\" then yield (wait 1s)", "\"2...\" then yield (wait 1s)", "\"1...\" … \"Go!\""]
      },
      deep: {
        more: ["Coroutines stop when their GameObject is deactivated or destroyed. StopCoroutine stops one early, and StopAllCoroutines stops every coroutine on the script.",
          "Start itself can be a coroutine: write IEnumerator Start() and you can yield inside it — handy for intro sequences."],
        ex: { code: "using System.Collections;\nusing UnityEngine;\n\npublic class Blinker : MonoBehaviour\n{\n    [SerializeField] int blinks = 3;\n    Renderer body;\n\n    void Start()\n    {\n        body = GetComponent<Renderer>();\n        StartCoroutine(Blink());\n    }\n\n    IEnumerator Blink()\n    {\n        for (int i = 0; i < blinks; i++)\n        {\n            body.enabled = false;\n            yield return new WaitForSeconds(0.1f);\n            body.enabled = true;\n            yield return new WaitForSeconds(0.1f);\n        }\n        Debug.Log(\"Done blinking\");\n    }\n}",
          walk: ["Line 1: IEnumerator lives in System.Collections.", "Line 12: start the blinking.", "Lines 17–23: hide, wait a tenth of a second, show, wait — three times.", "Line 24: runs after the loop finishes, about 0.6 seconds later."] },
        mistake: "Calling the coroutine like a normal method: Blink(); does nothing at all. It must be started: StartCoroutine(Blink());."
      } },
    { title: "UI: Text, Buttons and Canvas", chapter: "Canvas, TextMeshPro, Button.onClick", line: 'scoreText.text = $"Score: {score}";',
      content: {
        story: ["Menus, health bars and score counters live on a Canvas — a special GameObject that draws UI on top of the game. Add one with GameObject → UI, and Unity creates the Canvas and an EventSystem for clicks and taps.",
          "Text is drawn with TextMeshPro (add using TMPro;). Give your script a [SerializeField] TextMeshProUGUI field, drag the text object in, and set its text property whenever the value changes.",
          "Buttons have an onClick event. Hook it up in the Inspector by picking a public method, or in code with button.onClick.AddListener(StartGame);. Sliders, toggles and input fields work the same way."],
        big: "UI lives on a Canvas; set TextMeshPro's text to show values, and connect Button.onClick to your methods.",
        caption: "A score counter ticks up and a Play button lights when tapped. Tap Play.",
        demo: ["Canvas → Text (TMP): \"Score: 0\"", "coin collected → text = \"Score: 10\"", "Play button tapped", "onClick → StartGame()"]
      },
      deep: {
        more: ["Anchors decide how UI behaves on different screen sizes — pin a score to the top-left corner and it stays there on phones and monitors alike. Set the Canvas Scaler to Scale With Screen Size for consistent sizes.",
          "Update UI only when values change, not every frame: setting text rebuilds the text's shapes, which costs time."],
        ex: { code: "using TMPro;\nusing UnityEngine;\nusing UnityEngine.UI;\n\npublic class ScoreUI : MonoBehaviour\n{\n    [SerializeField] TextMeshProUGUI scoreText;\n    [SerializeField] Button addButton;\n    int score = 0;\n\n    void Start()\n    {\n        addButton.onClick.AddListener(AddPoint);\n        Show();\n    }\n\n    void AddPoint()\n    {\n        score += 10;\n        Show();\n    }\n\n    void Show()\n    {\n        scoreText.text = $\"Score: {score}\";\n    }\n}",
          walk: ["Lines 1–3: TextMeshPro, Unity, and the UI namespaces.", "Lines 7–8: drag the text and the button in.", "Line 13: run AddPoint on every click.", "Lines 17–21: add points, then refresh the text.", "Lines 23–26: one place that draws the score."] },
        mistake: "Using the old UnityEngine.UI.Text type with a TextMeshPro object (or the reverse). The field stays empty and you get a NullReferenceException. TextMeshPro objects need a TextMeshProUGUI field."
      } },
    { title: "Scenes and Saving", chapter: "SceneManager, PlayerPrefs, JsonUtility", line: 'SceneManager.LoadScene("Level2");',
      content: {
        story: ["A scene is one level, menu or screen. Switch with SceneManager.LoadScene(\"Level2\") (add using UnityEngine.SceneManagement;). Every scene you load must be added to the scene list in Build Profiles (File → Build Profiles; older versions: Build Settings).",
          "Loading a scene destroys everything in the old one. To keep a music player or a game manager alive across scenes, call DontDestroyOnLoad(gameObject) on it.",
          "PlayerPrefs saves small values between sessions: PlayerPrefs.SetInt(\"best\", score) and PlayerPrefs.GetInt(\"best\", 0). For bigger save data, turn a class into text with JsonUtility.ToJson and write it to a file in Application.persistentDataPath."],
        big: "SceneManager moves between scenes; PlayerPrefs keeps small settings; JsonUtility turns save data into text for files.",
        caption: "The player reaches the exit flag, the next level loads, and the best score is written down. Tap Play.",
        demo: ["exit reached → LoadScene(\"Level2\")", "old scene's objects are destroyed", "PlayerPrefs.SetInt(\"best\", 120)", "next launch: GetInt(\"best\") → 120"]
      },
      deep: {
        more: ["PlayerPrefs isn't secret or tamper-proof: on desktop it's stored in plain places the player can edit. Use it for settings and casual scores, not for anything valuable.",
          "SceneManager.LoadSceneAsync loads in the background, so you can show a loading bar instead of freezing."],
        ex: { code: "using UnityEngine;\nusing UnityEngine.SceneManagement;\n\npublic class LevelEnd : MonoBehaviour\n{\n    [SerializeField] string nextScene = \"Level2\";\n    [SerializeField] int score = 120;\n\n    void OnTriggerEnter(Collider other)\n    {\n        if (!other.CompareTag(\"Player\")) return;\n        int best = PlayerPrefs.GetInt(\"best\", 0);\n        if (score > best)\n        {\n            PlayerPrefs.SetInt(\"best\", score);\n            PlayerPrefs.Save();\n        }\n        SceneManager.LoadScene(nextScene);\n    }\n}",
          walk: ["Line 2: the scene tools.", "Line 11: ignore anything that isn't the player.", "Line 12: read the saved best, or 0 if none.", "Lines 13–17: save a new best.", "Line 18: go to the next level."] },
        mistake: "Loading a scene that isn't in the build list. It works in some editor setups but fails in the built game. Add every scene to Build Profiles."
      } },
    { title: "ScriptableObjects", chapter: "Data assets for items, stats and settings", line: "public class Item : ScriptableObject { public string title; }",
      content: {
        story: ["A ScriptableObject is a class whose data is saved as an asset file in your project, instead of living on a GameObject. Weapons, enemy stats, dialogue lines, level settings — any data many objects share fits perfectly.",
          "Write a class that extends ScriptableObject and add [CreateAssetMenu(menuName = \"Game/Item\")] above it. Now right-click in the Project window → Create → Game → Item to make as many item assets as you like, each edited in the Inspector.",
          "Scripts then hold a reference to the asset: [SerializeField] Item sword;. Change the asset once and every enemy, shop and inventory that uses it sees the change."],
        big: "ScriptableObjects are data saved as assets; [CreateAssetMenu] lets you make many of them, and scripts share them by reference.",
        caption: "A shelf of item cards — sword, shield, potion — each one an asset file. Tap Play.",
        demo: ["[CreateAssetMenu(menuName = \"Game/Item\")]", "Create → Game → Item → \"Sword\"", "damage 12, price 50", "Shop and Player both use Sword"]
      },
      deep: {
        more: ["Changes made to a ScriptableObject during Play mode in the editor are KEPT, unlike changes to scene objects. That's useful for tuning, and surprising if you use them for runtime state.",
          "Because many objects share one asset, don't store per-object state (like this enemy's current health) in it. Keep the stats in the asset and the changing values on the GameObject."],
        ex: { code: "using UnityEngine;\n\n[CreateAssetMenu(fileName = \"NewItem\", menuName = \"Game/Item\")]\npublic class Item : ScriptableObject\n{\n    public string title = \"Sword\";\n    public int damage = 12;\n    public int price = 50;\n}\n\npublic class Shop : MonoBehaviour\n{\n    [SerializeField] Item[] stock;\n\n    void Start()\n    {\n        foreach (Item item in stock)\n        {\n            Debug.Log($\"{item.title}: {item.price} gold\");\n        }\n    }\n}",
          walk: ["Line 3: adds Game → Item to the Create menu.", "Lines 4–9: the data every item has.", "Line 13: drag item assets into this list in the Inspector.", "Lines 17–20: print each item's name and price."] },
        mistake: "Using new Item() for a ScriptableObject. They must be created as assets, or in code with ScriptableObject.CreateInstance<Item>()."
      } },
    { title: "Animation and Audio", chapter: "Animator, parameters, AudioSource", line: 'animator.SetTrigger("Jump");',
      content: {
        story: ["Characters move with animation clips — idle, run, jump — played by an Animator component. The Animator Controller is a flowchart of states and the arrows between them, and parameters (floats, bools, triggers) decide which arrow to follow.",
          "Your script drives the parameters: animator.SetFloat(\"Speed\", speed) lets the controller blend from walk to run, animator.SetBool(\"Grounded\", true) and animator.SetTrigger(\"Jump\") fires a one-time jump.",
          "Sound comes from an AudioSource component playing an AudioClip, and an AudioListener (usually on the camera) hears it. audioSource.PlayOneShot(clip) plays a sound effect without cutting off other sounds."],
        big: "Scripts set Animator parameters to switch animations, and AudioSource.PlayOneShot plays sound effects.",
        caption: "Speed rises and the Animator blends walk into run; a jump trigger plays the jump with a sound. Tap Play.",
        demo: ["SetFloat(\"Speed\", 0) → Idle", "SetFloat(\"Speed\", 5) → Run", "SetTrigger(\"Jump\") → Jump", "PlayOneShot(jumpSound) → boing!"]
      },
      deep: {
        more: ["Parameter names are strings and must match the Animator window exactly, capitals included. A typo fails quietly with only a warning, so double-check names — or store them once with Animator.StringToHash.",
          "Timeline is Unity's tool for cutscenes: tracks for animation, audio and camera moves, laid out like a video editor."],
        ex: { code: "using UnityEngine;\n\npublic class Hero : MonoBehaviour\n{\n    [SerializeField] Animator animator;\n    [SerializeField] AudioSource audioSource;\n    [SerializeField] AudioClip jumpSound;\n    [SerializeField] float speed = 0f;\n\n    void Update()\n    {\n        animator.SetFloat(\"Speed\", speed);\n        if (Input.GetKeyDown(KeyCode.Space))\n        {\n            animator.SetTrigger(\"Jump\");\n            audioSource.PlayOneShot(jumpSound);\n        }\n    }\n}",
          walk: ["Lines 5–7: the Animator, a speaker, and a sound, all dragged in.", "Line 12: tell the controller how fast we're going.", "Lines 13–17: on Space, fire the Jump trigger and play the sound once."] },
        mistake: "Calling SetTrigger every frame while a key is held. Triggers queue up, and the animation can play twice. Fire it once, on GetKeyDown."
      } },
    { title: "Building and Shipping", chapter: "Build Profiles, platforms and performance", line: "Application.targetFrameRate = 60;",
      content: {
        story: ["When your game works in the editor, a build turns it into a real app for a platform: Windows, macOS, Android, iOS, the web (WebGL/WebGPU) or consoles. Open File → Build Profiles, add your scenes in order, pick a platform and press Build.",
          "Each platform has its own settings — screen orientation for phones, compression for the web, icons and names for stores. Test on the real device early: phones are slower than your computer, and touch is not a mouse.",
          "The Profiler (Window → Analysis → Profiler) shows what's using time each frame. Common fixes: cache GetComponent results, don't use Find in Update, pool objects instead of spawning hundreds, and keep textures and audio at sensible sizes."],
        big: "Build Profiles turn your project into an app for each platform; test on real devices and use the Profiler to find slow spots.",
        caption: "One project, many doors: PC, phone, web and console builds roll off the line. Tap Play.",
        demo: ["File → Build Profiles", "add scenes: Menu, Level1, Level2", "platform: Android", "Build → game.apk"]
      },
      deep: {
        more: ["Development Builds can connect the Profiler and show logs from the device, which makes finding phone-only bugs much easier.",
          "Use #if UNITY_EDITOR around code that should only run in the editor, such as debug shortcuts, so it never ships to players."],
        ex: { code: "using UnityEngine;\n\npublic class FpsMeter : MonoBehaviour\n{\n    float timer;\n    int frames;\n\n    void Update()\n    {\n        frames++;\n        timer += Time.unscaledDeltaTime;\n        if (timer >= 1f)\n        {\n            Debug.Log($\"{frames} frames per second\");\n            frames = 0;\n            timer = 0f;\n        }\n#if UNITY_EDITOR\n        if (Input.GetKeyDown(KeyCode.F1)) Debug.Log(\"Editor-only shortcut\");\n#endif\n    }\n}",
          walk: ["Lines 10–11: count frames and add up real time.", "Lines 12–17: once a second, report and reset.", "Lines 18–20: this shortcut exists only inside the editor."] },
        mistake: "Only ever testing in the editor. Builds can behave differently — different screen sizes, slower devices, missing scenes. Build and test on the target early and often."
      } }
  ];

  var shelves = [
    { title: "The Lifecycle Field Guide", chapter: "Beyond the basics · Unity shelf", line: ["Awake → OnEnable → Start", "FixedUpdate → Update → LateUpdate"],
      content: {
        story: ["Unity calls your script's special methods in a fixed order. Knowing it solves many “why is this null?” mysteries. Awake runs first, as soon as the object exists. OnEnable runs whenever the script is switched on. Start runs once before the first Update.",
          "Every frame, FixedUpdate runs zero or more times on the physics clock, then Update, then LateUpdate. When an object is switched off, OnDisable runs; when it's destroyed, OnDestroy.",
          "Rule of thumb: set up your OWN components in Awake, connect to OTHER objects in Start, move things in Update, apply physics in FixedUpdate, and follow with the camera in LateUpdate."],
        big: "Awake → OnEnable → Start, then FixedUpdate → Update → LateUpdate each frame, and OnDisable / OnDestroy at the end.",
        caption: "A clock face showing the order Unity visits each method, frame after frame. Tap Play.",
        demo: ["Awake: my own setup", "Start: talk to others", "Update: every frame", "LateUpdate: camera follows"]
      },
      deep: {
        more: ["The order in which DIFFERENT scripts run their Awake (or Update) is not guaranteed. If one script must go first, set it in Project Settings → Script Execution Order — or better, design so the order doesn't matter.",
          "OnValidate runs in the editor whenever a value changes in the Inspector — a handy place to clamp settings to sensible ranges."],
        ex: { code: "using UnityEngine;\n\npublic class LifecycleLogger : MonoBehaviour\n{\n    void Awake() { Debug.Log(\"Awake\"); }\n    void OnEnable() { Debug.Log(\"OnEnable\"); }\n    void Start() { Debug.Log(\"Start\"); }\n    void FixedUpdate() { }\n    void Update() { }\n    void LateUpdate() { }\n    void OnDisable() { Debug.Log(\"OnDisable\"); }\n    void OnDestroy() { Debug.Log(\"OnDestroy\"); }\n}",
          walk: ["Attach this to any object and press Play.", "The Console shows Awake, OnEnable, Start — in that order.", "Stop playing: OnDisable, then OnDestroy."] },
        mistake: "Reading another object's data in Awake. That object may not have run its own Awake yet. Read from others in Start."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · Unity shelf", line: ["NullReferenceException", "Debug.Log($\"{name}: {value}\");"],
      content: {
        story: ["Unity's Console lists errors in red with the script and line number — double-click one to jump to the code. Read the first error first: later ones are often side effects.",
          "The famous NullReferenceException means a variable points at nothing: an Inspector slot left empty, a GetComponent that found nothing, or an object that was destroyed. Check the Inspector for “None” in your script's fields.",
          "Other regulars: “The referenced script on this Behaviour is missing” (a script file was renamed or deleted), “Can't add script… class cannot be found” (file name ≠ class name), and nothing happening at all (a misspelled Update, or the script was never attached)."],
        big: "Read the first red error, double-click it, and check the usual suspects: empty Inspector slots, renamed scripts and misspelled methods.",
        caption: "A detective follows the Console's red trail back to an empty Inspector slot. Tap Play.",
        demo: ["NullReferenceException", "  at Player.Update () Player.cs:14", "line 14: health.TakeDamage(1)", "→ the Health slot says None"]
      },
      deep: {
        more: ["You can attach Visual Studio, VS Code or Rider to the editor and set breakpoints: the game pauses on a line, and you can inspect every variable — far faster than adding Debug.Log everywhere.",
          "Debug.Log has a second parameter: Debug.Log(\"hit\", gameObject). Clicking that message in the Console highlights the object in the Hierarchy."],
        ex: { code: "using UnityEngine;\n\npublic class SafeShooter : MonoBehaviour\n{\n    [SerializeField] GameObject bulletPrefab;\n\n    void Start()\n    {\n        if (bulletPrefab == null)\n        {\n            Debug.LogError($\"{name}: Bullet Prefab is not assigned!\", gameObject);\n            enabled = false;\n        }\n    }\n}",
          walk: ["Line 9: check the slot before using it.", "Line 11: a clear red message naming the object; clicking it highlights the object.", "Line 12: switch the script off instead of crashing every frame."] },
        mistake: "Fixing the last error in the list first. Errors cascade — one missing reference can cause ten more. Always start at the top."
      } },
    { title: "Game Feel Recipes", chapter: "Beyond the basics · Unity shelf", line: ["Vector3.Lerp(cam, target, 0.1f)", "Mathf.PingPong(Time.time, 1f)"],
      content: {
        story: ["“Game feel” is why one jump feels great and another feels floaty. Small touches add up: a camera that follows smoothly, a squash when landing, a flash when hit, a tiny screen shake on an explosion.",
          "A smooth follow camera moves part of the way toward its target every frame in LateUpdate. A bobbing pickup uses Mathf.Sin or Mathf.PingPong on its height. A hit flash is a coroutine that changes colour for a tenth of a second.",
          "Tweak by feel: change one number, press Play, try it, repeat. Expose the numbers with [SerializeField] so you can tune them live in the Inspector."],
        big: "Smooth follows, bobs, flashes and shakes make a game feel alive — tune them in Play mode with exposed fields.",
        caption: "A coin bobs, the camera glides after the player, and a hit flashes red. Tap Play.",
        demo: ["camera: Lerp toward player", "coin: y = start + Sin(time)", "hit: flash red for 0.1s", "landing: squash, then stretch"]
      },
      deep: {
        more: ["Cinemachine, a free Unity package, provides professional cameras — follow, look-at, shake, blends between shots — without writing camera code.",
          "Coyote time (a few frames to jump after leaving a ledge) and jump buffering (remembering a jump pressed just before landing) make platformers feel fair."],
        ex: { code: "using UnityEngine;\n\npublic class Bobber : MonoBehaviour\n{\n    [SerializeField] float height = 0.25f;\n    [SerializeField] float speed = 2f;\n    [SerializeField] float spin = 90f;\n    Vector3 start;\n\n    void Start()\n    {\n        start = transform.position;\n    }\n\n    void Update()\n    {\n        float offset = Mathf.Sin(Time.time * speed) * height;\n        transform.position = start + Vector3.up * offset;\n        transform.Rotate(0f, spin * Time.deltaTime, 0f);\n    }\n}",
          walk: ["Line 12: remember where the coin started.", "Line 17: Sin swings smoothly between -1 and 1 over time.", "Line 18: float above and below the start point.", "Line 19: and spin, for extra sparkle."] },
        mistake: "Smoothing a camera in Update while the player moves in FixedUpdate. The two clocks disagree and the view jitters. Move cameras in LateUpdate."
      } },
    { title: "Performance Habits", chapter: "Beyond the basics · Unity shelf", line: ["cache GetComponent in Awake", "ObjectPool<GameObject>"],
      content: {
        story: ["Most beginner games run fine — until they don't, usually on a phone. A few habits prevent most slowdowns. First: never search the scene every frame. GameObject.Find, FindFirstObjectByType and GetComponent in Update are slow; do them once and keep the answer.",
          "Second: avoid creating garbage every frame — new lists, string building and LINQ in Update all allocate memory that the garbage collector must clean up later, causing hiccups.",
          "Third: reuse objects. Spawning and destroying hundreds of bullets is costly; an object pool deactivates finished bullets and reuses them. Unity 6 includes ObjectPool<T> in UnityEngine.Pool."],
        big: "Cache references, avoid per-frame allocations, pool frequently spawned objects — and measure with the Profiler before guessing.",
        caption: "A bullet pool: used bullets return to the rack instead of being thrown away. Tap Play.",
        demo: ["Find() in Update → slow", "cache in Awake → fast", "new List() every frame → hiccups", "pool bullets → smooth"]
      },
      deep: {
        more: ["The Profiler's CPU view shows exactly which scripts take the most time each frame; the Memory view shows what's allocating. Measure first — the slow part is rarely where you expect.",
          "Physics settings matter too: fewer, simpler colliders (spheres and boxes over mesh colliders) and sensible Fixed Timestep values keep physics cheap."],
        ex: { code: "using UnityEngine;\n\npublic class CachedMover : MonoBehaviour\n{\n    [SerializeField] float speed = 2f;\n    Rigidbody rb;\n    Transform player;\n\n    void Awake()\n    {\n        rb = GetComponent<Rigidbody>();\n    }\n\n    void Start()\n    {\n        GameObject p = GameObject.FindWithTag(\"Player\");\n        if (p != null) player = p.transform;\n    }\n\n    void FixedUpdate()\n    {\n        if (player == null || rb == null) return;\n        Vector3 dir = (player.position - transform.position).normalized;\n        rb.MovePosition(transform.position + dir * speed * Time.fixedDeltaTime);\n    }\n}",
          walk: ["Line 11: find our own Rigidbody once.", "Lines 16–17: find the player once, not every frame.", "Line 22: guard against missing references.", "Lines 23–24: move toward the player using the cached references."] },
        mistake: "Optimising without measuring. Hours spent speeding up code that wasn't slow help no one; the Profiler shows where time really goes."
      } },
    { title: "2D Games", chapter: "Beyond the basics · Unity shelf", line: ["Rigidbody2D rb2d;", "void OnTriggerEnter2D(Collider2D other) { }"],
      content: {
        story: ["Unity makes 2D games with the same ideas as 3D, using a parallel set of tools: SpriteRenderer draws images, Rigidbody2D and Collider2D components handle physics, and positions use only x and y.",
          "The 2D messages end in 2D: OnCollisionEnter2D(Collision2D other) and OnTriggerEnter2D(Collider2D other). Forces are Vector2: rb2d.AddForce(Vector2.up * 8f, ForceMode2D.Impulse).",
          "Tilemaps paint levels from tiles like a pixel editor, and the 2D Sprite tools slice sprite sheets into animation frames. Start a project from the Universal 2D template to get sensible settings."],
        big: "2D uses SpriteRenderer, Rigidbody2D, Collider2D and the …2D messages — the same ideas as 3D, without z.",
        caption: "A pixel hero jumps between tile platforms, all in x and y. Tap Play.",
        demo: ["SpriteRenderer draws the hero", "Rigidbody2D + BoxCollider2D", "AddForce(Vector2.up * 8, Impulse)", "OnTriggerEnter2D → gem collected"]
      },
      deep: {
        more: ["Set Rigidbody2D Interpolate on the player for smooth movement, and freeze rotation (Constraints → Freeze Rotation Z) so the hero doesn't tip over on corners.",
          "spriteRenderer.flipX = true mirrors the sprite to face left — no need for a second set of drawings."],
        ex: { code: "using UnityEngine;\n\npublic class Hopper2D : MonoBehaviour\n{\n    [SerializeField] float jump = 8f;\n    [SerializeField] float run = 5f;\n    Rigidbody2D rb2d;\n    SpriteRenderer sprite;\n    int gems;\n\n    void Awake()\n    {\n        rb2d = GetComponent<Rigidbody2D>();\n        sprite = GetComponent<SpriteRenderer>();\n    }\n\n    void Update()\n    {\n        float h = Input.GetAxisRaw(\"Horizontal\");\n        rb2d.linearVelocity = new Vector2(h * run, rb2d.linearVelocity.y);\n        if (h != 0f) sprite.flipX = h < 0f;\n        if (Input.GetKeyDown(KeyCode.Space)) rb2d.AddForce(Vector2.up * jump, ForceMode2D.Impulse);\n    }\n\n    void OnTriggerEnter2D(Collider2D other)\n    {\n        if (other.CompareTag(\"Gem\"))\n        {\n            gems++;\n            Destroy(other.gameObject);\n        }\n    }\n}",
          walk: ["Lines 11–15: cache the 2D body and the sprite.", "Line 20: set sideways speed, keep the falling speed.", "Line 21: face the way we're running.", "Line 22: an instant hop.", "Lines 25–32: collect gems with a 2D trigger."] },
        mistake: "Adding a 3D Rigidbody to a 2D sprite, or a BoxCollider instead of a BoxCollider2D. 2D and 3D physics are separate worlds and never touch each other."
      } }
  ];

  var glossary = [
    ["Animator", "The component that plays animations using a controller of states and transitions."],
    ["Animator Controller", "The flowchart asset of animation states, arrows and parameters."],
    ["Asset", "Any file in your project: models, textures, sounds, scripts, prefabs, scenes."],
    ["AudioClip", "A sound file imported into Unity."],
    ["AudioSource", "The component that plays AudioClips in the world."],
    ["Awake", "Called first, when an object is created — set up your own components here."],
    ["Build", "Turning the project into a standalone app for a platform."],
    ["Build Profiles", "The window (File → Build Profiles) listing scenes and platforms for builds."],
    ["Camera", "The component that decides what the player sees."],
    ["Canvas", "The GameObject that holds and draws UI elements."],
    ["Collider", "A component giving an object a physical shape for collisions."],
    ["Collision", "Information about a solid contact, passed to OnCollisionEnter."],
    ["Component", "A piece of behaviour or data attached to a GameObject."],
    ["Console", "The window showing Debug.Log messages, warnings and errors."],
    ["Coroutine", "A method that can pause with yield and continue later."],
    ["CreateAssetMenu", "An attribute that adds a ScriptableObject to the Create menu."],
    ["Debug.Log", "Prints a message to the Console."],
    ["deltaTime", "Time.deltaTime: seconds the last frame took; multiply movement by it."],
    ["Destroy", "Removes a GameObject or component, optionally after a delay."],
    ["DontDestroyOnLoad", "Keeps an object alive when a new scene loads."],
    ["Euler angles", "Rotation written as degrees around x, y and z."],
    ["EventSystem", "The object that sends clicks and taps to UI elements."],
    ["FixedUpdate", "Called on the steady physics clock; put forces here."],
    ["Frame", "One picture in the game's flip-book; Update runs once per frame."],
    ["Game view", "The window showing what the player's camera sees."],
    ["GameObject", "The basic object in a scene; a container for components."],
    ["GetComponent", "Finds a component on a GameObject."],
    ["Gizmos", "Debug drawings shown in the Scene view."],
    ["Hierarchy", "The window listing every GameObject in the open scene."],
    ["Impulse", "ForceMode.Impulse: an instant kick that changes velocity at once."],
    ["Input System", "Unity's modern input package, built around named actions."],
    ["Inspector", "The window showing and editing the selected object's components."],
    ["Instantiate", "Creates a copy of a prefab or object while the game runs."],
    ["Is Kinematic", "A Rigidbody setting: moved by script, not pushed by physics."],
    ["Is Trigger", "A collider setting: things pass through and send OnTrigger messages."],
    ["LateUpdate", "Called after every Update each frame — good for cameras."],
    ["Layer", "A category for GameObjects used by cameras and physics to include or ignore them."],
    ["Lerp", "Linear interpolation: the value a fraction of the way between two others."],
    ["Material", "Describes how a surface looks: colour, texture, shininess."],
    ["Mathf", "Unity's maths toolbox for single numbers: Clamp, Lerp, Abs, Sin…"],
    ["Mesh", "The 3D shape of a model, made of triangles."],
    ["MonoBehaviour", "The base class for scripts attached to GameObjects."],
    ["normalized", "A vector with the same direction but length 1."],
    ["NullReferenceException", "The error when code uses a reference that points at nothing."],
    ["Object pooling", "Reusing objects instead of creating and destroying them."],
    ["OnCollisionEnter", "Called when a solid collision begins."],
    ["OnTriggerEnter", "Called when something enters a trigger collider."],
    ["Package Manager", "The window for adding official and third-party packages."],
    ["Parent", "A GameObject that others are nested under; children move with it."],
    ["Play mode", "Running the game inside the editor; changes made here are lost when it stops."],
    ["PlayerPrefs", "Simple saved values that survive between sessions."],
    ["Prefab", "A saved GameObject template you can reuse and spawn."],
    ["Profiler", "The tool that shows what is using time and memory each frame."],
    ["Project window", "The window showing your project's assets and folders."],
    ["Quaternion", "Unity's internal way of storing rotations."],
    ["Raycast", "Shooting an invisible line to see what it hits."],
    ["Renderer", "A component that draws something, like a MeshRenderer or SpriteRenderer."],
    ["Rigidbody", "Puts an object under the control of the physics engine."],
    ["Rigidbody2D", "The 2D version of Rigidbody."],
    ["Scene", "One level, menu or screen of your game."],
    ["Scene view", "The editing window where you arrange the world."],
    ["SceneManager", "Loads and switches scenes."],
    ["ScriptableObject", "A class whose data is saved as an asset file."],
    ["SerializeField", "Shows a private field in the Inspector."],
    ["Sprite", "A 2D image used in 2D games and UI."],
    ["SpriteRenderer", "The component that draws a sprite."],
    ["Start", "Called once before the first frame a script is active."],
    ["Tag", "A label on a GameObject, checked with CompareTag."],
    ["TextMeshPro", "Unity's high-quality text system for UI and the world."],
    ["Tilemap", "A grid for painting 2D levels from tiles."],
    ["Time.timeScale", "Speeds up, slows or pauses game time (0 pauses)."],
    ["Transform", "Position, rotation and scale; every GameObject has one."],
    ["Trigger", "A collider used as a sensor rather than a solid wall."],
    ["UnityEvent", "An event you can wire up in the Inspector."],
    ["Update", "Called once every frame."],
    ["URP", "The Universal Render Pipeline: Unity's default renderer for most projects."],
    ["Vector2", "Two numbers, x and y: a 2D position or direction."],
    ["Vector3", "Three numbers, x, y and z: a 3D position or direction."],
    ["yield return", "Pauses a coroutine until the next frame or a wait finishes."]
  ];

  var field = [
    { name: "Transform", head: "on every GameObject", what: "Position, rotation and scale, plus Translate, Rotate and LookAt.", ex: "transform.position += Vector3.up;" },
    { name: "Vector3", head: "UnityEngine", what: "3D points and directions with up, forward, Distance, Lerp and MoveTowards.", ex: "Vector3.Distance(a, b)" },
    { name: "Time", head: "UnityEngine", what: "deltaTime for smooth movement, time since start, and timeScale for pausing.", ex: "speed * Time.deltaTime" },
    { name: "Input", head: "UnityEngine (classic)", what: "Keys, mouse buttons and smooth axes.", ex: "Input.GetKeyDown(KeyCode.Space)" },
    { name: "Rigidbody", head: "Physics", what: "Gravity, velocity and forces for 3D physics objects.", ex: "rb.AddForce(Vector3.up * 5f, ForceMode.Impulse);" },
    { name: "Physics.Raycast", head: "Physics", what: "Shoots an invisible ray and reports what it hits.", ex: "Physics.Raycast(origin, dir, out RaycastHit hit, 10f)" },
    { name: "Mathf", head: "UnityEngine", what: "Clamp, Lerp, Abs, Sin, RoundToInt and other number helpers.", ex: "Mathf.Clamp(hp, 0, 100)" },
    { name: "Random", head: "UnityEngine", what: "Random numbers in ranges; note Range(int, int) excludes the max.", ex: "Random.Range(1, 7)  // 1 to 6" },
    { name: "Debug", head: "UnityEngine", what: "Log, LogWarning and LogError to the Console; DrawLine in the Scene view.", ex: "Debug.Log($\"hp {hp}\");" },
    { name: "SceneManager", head: "UnityEngine.SceneManagement", what: "Loads scenes by name or index.", ex: "SceneManager.LoadScene(\"Menu\");" },
    { name: "PlayerPrefs", head: "UnityEngine", what: "Small saved settings and scores.", ex: "PlayerPrefs.GetInt(\"best\", 0)" },
    { name: "JsonUtility", head: "UnityEngine", what: "Turns serializable classes into JSON text and back.", ex: "string json = JsonUtility.ToJson(save);" },
    { name: "TextMeshProUGUI", head: "TMPro", what: "Sharp UI text you can change from scripts.", ex: "scoreText.text = $\"Score: {score}\";" },
    { name: "ObjectPool<T>", head: "UnityEngine.Pool", what: "Reuses objects instead of creating and destroying them.", ex: "var pool = new ObjectPool<GameObject>(Create);" }
  ];

  var cheats = [
    { title: "Script Skeleton Card", body: "The shape of every Unity script.", code: "using UnityEngine;\n\npublic class MyScript : MonoBehaviour\n{\n    [SerializeField] float speed = 5f;\n\n    void Start() { }\n    void Update() { }\n}" },
    { title: "Movement Card", body: "Moving and turning, per second.", code: "transform.Translate(Vector3.forward * speed * Time.deltaTime);\ntransform.Rotate(0f, 90f * Time.deltaTime, 0f);\ntransform.position = new Vector3(0f, 1f, 0f);" },
    { title: "Input Card", body: "Keys, axes and mouse.", code: "float h = Input.GetAxis(\"Horizontal\");\nif (Input.GetKeyDown(KeyCode.Space)) Jump();\nif (Input.GetKey(KeyCode.LeftShift)) Run();\nif (Input.GetMouseButtonDown(0)) Fire();" },
    { title: "Physics Card", body: "Rigidbodies, forces and contacts.", code: "Rigidbody rb = GetComponent<Rigidbody>();\nrb.AddForce(Vector3.up * 5f, ForceMode.Impulse);\nvoid OnCollisionEnter(Collision c) { }\nvoid OnTriggerEnter(Collider other) { }" },
    { title: "Spawning Card", body: "Prefabs in, objects out.", code: "GameObject e = Instantiate(enemyPrefab, spot, Quaternion.identity);\nDestroy(e, 5f);\nif (other.CompareTag(\"Coin\")) Destroy(other.gameObject);" },
    { title: "Timer Card", body: "Waiting without freezing.", code: "IEnumerator Countdown()\n{\n    yield return new WaitForSeconds(1f);\n    Debug.Log(\"One second later\");\n}\nStartCoroutine(Countdown());\nInvoke(\"Spawn\", 2f);" },
    { title: "UI Card", body: "Text and buttons.", code: "using TMPro;\n[SerializeField] TextMeshProUGUI label;\n[SerializeField] Button play;\nlabel.text = $\"Score: {score}\";\nplay.onClick.AddListener(StartGame);" },
    { title: "Scenes & Saving Card", body: "Switching levels and remembering scores.", code: "using UnityEngine.SceneManagement;\nSceneManager.LoadScene(\"Level2\");\nPlayerPrefs.SetInt(\"best\", score);\nint best = PlayerPrefs.GetInt(\"best\", 0);" }
  ];

  /* Rounding the way Unity's Mathf.RoundToInt does: halves go to the
     even neighbour (2.5 → 2, 3.5 → 4). */
  function roundEven(x) { var f = Math.floor(x), d = x - f; return d > 0.5 ? f + 1 : d < 0.5 ? f : (f % 2 === 0 ? f : f + 1); }
  function f1(x) { return Math.fround(x).toFixed(1); }
  var projects = [
    { name: "Hello, Unity", file: "HelloUnity.cs", about: "Start speaks once, then Update counts the first few frames.",
      vars: [{ key: "frames", label: "frames to count", val: 3, min: 1, max: 8 }],
      code: function (v) { return ["using UnityEngine;", "", "public class HelloUnity : MonoBehaviour", "{", "    public int frames = " + v.frames + ";", "    int count = 0;", "", "    void Start()", "    {", "        Debug.Log(\"Hello, Unity!\");", "    }", "", "    void Update()", "    {", "        count++;", "        if (count <= frames)", "        {", "            Debug.Log($\"Frame {count}\");", "        }", "    }", "}"]; },
      run: function (v) { var o = ["Hello, Unity!"]; for (var i = 1; i <= v.frames; i++) o.push("Frame " + i); return o; },
      harness: function (v) { return "new GameObject(\"Hello\").AddComponent<HelloUnity>();\nEngine.Run(" + (v.frames + 3) + ", 0.5f);"; },
      explain: "Unity calls Start once before the first frame, then Update every frame. count++ counts frames; the if stops printing after the number in the box." },
    { name: "Coin Spinner", file: "CoinSpinner.cs", about: "A coin spins around the y axis at a speed in degrees per second. This demo plays four frames of half a second each.",
      vars: [{ key: "degreesPerSecond", label: "degrees per second", val: 90, min: 10, max: 360 }],
      code: function (v) { return ["using UnityEngine;", "", "public class CoinSpinner : MonoBehaviour", "{", "    public float degreesPerSecond = " + v.degreesPerSecond + "f;", "", "    void Update()", "    {", "        transform.Rotate(0f, degreesPerSecond * Time.deltaTime, 0f);", "        int angle = Mathf.RoundToInt(transform.eulerAngles.y);", "        Debug.Log($\"Angle: {angle}\");", "    }", "}"]; },
      run: function (v) { var o = [], a = 0; for (var i = 0; i < 4; i++) { a = (a + v.degreesPerSecond * 0.5) % 360; o.push("Angle: " + roundEven(a) % 360); } return o; },
      harness: function () { return "new GameObject(\"Coin\").AddComponent<CoinSpinner>();\nEngine.Run(4, 0.5f);"; },
      explain: "Each frame turns the coin by speed × deltaTime degrees. With half-second frames, 90 degrees per second turns 45 degrees a frame. eulerAngles wraps back to 0 after 360." },
    { name: "Countdown", file: "Countdown.cs", about: "Start is a coroutine: it counts down one second at a time while the game keeps running.",
      vars: [{ key: "seconds", val: 3, min: 1, max: 9 }],
      code: function (v) { return ["using System.Collections;", "using UnityEngine;", "", "public class Countdown : MonoBehaviour", "{", "    public int seconds = " + v.seconds + ";", "", "    IEnumerator Start()", "    {", "        for (int i = seconds; i > 0; i--)", "        {", "            Debug.Log($\"{i}...\");", "            yield return new WaitForSeconds(1f);", "        }", "        Debug.Log(\"Go!\");", "    }", "}"]; },
      run: function (v) { var o = []; for (var i = v.seconds; i > 0; i--) o.push(i + "..."); o.push("Go!"); return o; },
      harness: function (v) { return "new GameObject(\"Timer\").AddComponent<Countdown>();\nEngine.Run(" + (v.seconds * 2 + 3) + ", 0.5f);"; },
      explain: "IEnumerator Start makes Start a coroutine. yield return new WaitForSeconds(1f) pauses it for one second, then the loop carries on, until Go!" },
    { name: "Health System", file: "Health.cs", about: "Hits lower health, Mathf.Clamp keeps it between 0 and 100, and the loop stops at game over.",
      vars: [{ key: "damage", val: 30, min: 5, max: 60 }, { key: "hits", val: 4, min: 1, max: 6 }],
      code: function (v) { return ["using UnityEngine;", "", "public class Health : MonoBehaviour", "{", "    public int damage = " + v.damage + ";", "    public int hits = " + v.hits + ";", "    int hp = 100;", "", "    void Start()", "    {", "        for (int i = 1; i <= hits; i++)", "        {", "            hp = Mathf.Clamp(hp - damage, 0, 100);", "            Debug.Log($\"Hit {i}: HP {hp}\");", "            if (hp == 0)", "            {", "                Debug.Log(\"Game over\");", "                break;", "            }", "        }", "    }", "}"]; },
      run: function (v) { var o = [], hp = 100; for (var i = 1; i <= v.hits; i++) { hp = Math.max(0, Math.min(100, hp - v.damage)); o.push("Hit " + i + ": HP " + hp); if (hp === 0) { o.push("Game over"); break; } } return o; },
      harness: function () { return "new GameObject(\"Player\").AddComponent<Health>();\nEngine.Run(1, 0.5f);"; },
      explain: "Clamp means health never goes below 0, however big the hit. break leaves the loop the moment the player is down." },
    { name: "Jump Kick", file: "Jumper.cs", about: "An impulse changes a Rigidbody's speed by force ÷ mass — a heavier body launches slower.",
      vars: [{ key: "jumpForce", label: "jump force", val: 10, min: 1, max: 40 }, { key: "mass", val: 2, min: 1, max: 10 }],
      code: function (v) { return ["using UnityEngine;", "", "public class Jumper : MonoBehaviour", "{", "    public float jumpForce = " + v.jumpForce + "f;", "    public float mass = " + v.mass + "f;", "    Rigidbody rb;", "", "    void Start()", "    {", "        rb = GetComponent<Rigidbody>();", "        rb.mass = mass;", "        rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);", "        Debug.Log($\"Launch speed: {rb.linearVelocity.y:F1}\");", "    }", "}"]; },
      run: function (v) { return ["Launch speed: " + f1(Math.fround(v.jumpForce) / Math.fround(v.mass))]; },
      harness: function () { return "var g = new GameObject(\"Player\");\ng.AddComponent<Rigidbody>();\ng.AddComponent<Jumper>();\nEngine.Run(1, 0.5f);"; },
      explain: "GetComponent finds the Rigidbody on the same object. ForceMode.Impulse adds force ÷ mass to the velocity in one go. :F1 shows one decimal place." },
    { name: "Coin Collector", file: "CoinCollector.cs", about: "The player runs through coins (triggers) and a rock. Only objects tagged Coin count.",
      vars: [{ key: "coinValue", label: "coin value", val: 10, min: 1, max: 50 }, { key: "coins", label: "coins in the scene", val: 3, min: 1, max: 6 }],
      code: function (v) { return ["using UnityEngine;", "", "public class CoinCollector : MonoBehaviour", "{", "    public int coinValue = " + v.coinValue + ";", "    int score = 0;", "", "    void OnTriggerEnter(Collider other)", "    {", "        if (other.CompareTag(\"Coin\"))", "        {", "            score += coinValue;", "            Debug.Log($\"Coin! Score: {score}\");", "            Destroy(other.gameObject);", "        }", "    }", "}"]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.coins; i++) o.push("Coin! Score: " + i * v.coinValue); return o; },
      harness: function (v) { return "var player = new GameObject(\"Player\");\nplayer.AddComponent<SphereCollider>();\nplayer.AddComponent<CoinCollector>();\nEngine.Run(1, 0.5f);\nfor (int i = 0; i < " + v.coins + "; i++) {\n  var coin = new GameObject(\"Coin\") { tag = \"Coin\" };\n  coin.AddComponent<BoxCollider>().isTrigger = true;\n  Engine.Touch(player, coin, true);\n  if (i == 0) { var rock = new GameObject(\"Rock\"); rock.AddComponent<BoxCollider>().isTrigger = true; Engine.Touch(player, rock, true); }\n}"; },
      explain: "OnTriggerEnter runs for everything the player passes through; CompareTag(\"Coin\") ignores the rock. Destroy removes each coin so it can't be counted twice." },
    { name: "Enemy Spawner", file: "Spawner.cs", about: "Instantiate stamps copies of a prefab in a row. Copies are named after the prefab, with (Clone).",
      vars: [{ key: "count", val: 3, min: 1, max: 6 }, { key: "spacing", val: 2, min: 1, max: 5 }],
      code: function (v) { return ["using UnityEngine;", "", "public class Spawner : MonoBehaviour", "{", "    public GameObject enemyPrefab;", "    public int count = " + v.count + ";", "    public float spacing = " + v.spacing + "f;", "", "    void Start()", "    {", "        for (int i = 0; i < count; i++)", "        {", "            Vector3 spot = new Vector3(i * spacing, 0f, 0f);", "            GameObject enemy = Instantiate(enemyPrefab, spot, Quaternion.identity);", "            Debug.Log($\"{enemy.name} at x = {enemy.transform.position.x}\");", "        }", "    }", "}"]; },
      run: function (v) { var o = []; for (var i = 0; i < v.count; i++) o.push("Enemy(Clone) at x = " + i * v.spacing); return o; },
      harness: function () { return "var s = new GameObject(\"Spawner\").AddComponent<Spawner>();\ns.enemyPrefab = new GameObject(\"Enemy\");\nEngine.Run(1, 0.5f);"; },
      explain: "In Unity you drag the Enemy prefab onto the enemyPrefab slot in the Inspector. Each Instantiate makes a copy at the next spot along x." },
    { name: "Walk to the Flag", file: "Walker.cs", about: "MoveTowards steps toward a target at a steady speed and never overshoots. Frames here last half a second.",
      vars: [{ key: "speed", val: 2, min: 1, max: 6 }, { key: "targetX", label: "flag at x", val: 5, min: 1, max: 10 }],
      code: function (v) { return ["using UnityEngine;", "", "public class Walker : MonoBehaviour", "{", "    public float speed = " + v.speed + "f;", "    public float targetX = " + v.targetX + "f;", "", "    void Update()", "    {", "        Vector3 target = new Vector3(targetX, 0f, 0f);", "        transform.position = Vector3.MoveTowards(transform.position, target, speed * Time.deltaTime);", "        Debug.Log($\"x = {transform.position.x}\");", "        if (transform.position == target)", "        {", "            Debug.Log(\"Arrived!\");", "            enabled = false;", "        }", "    }", "}"]; },
      run: function (v) { var o = [], x = 0, step = v.speed * 0.5; while (true) { x = Math.min(x + step, v.targetX); o.push("x = " + x); if (x === v.targetX) { o.push("Arrived!"); break; } } return o; },
      harness: function (v) { return "new GameObject(\"Walker\").AddComponent<Walker>();\nEngine.Run(" + (Math.ceil(v.targetX / (v.speed * 0.5)) + 3) + ", 0.5f);"; },
      explain: "Each frame moves at most speed × deltaTime units. On the last step MoveTowards lands exactly on the target, and enabled = false stops Update for good." },
    { name: "Best Score", file: "BestScore.cs", about: "PlayerPrefs remembers the best score between games. This run starts with an old best of 60.",
      vars: [{ key: "score", val: 75, min: 0, max: 200 }],
      code: function (v) { return ["using UnityEngine;", "", "public class BestScore : MonoBehaviour", "{", "    public int score = " + v.score + ";", "", "    void Start()", "    {", "        int best = PlayerPrefs.GetInt(\"best\", 0);", "        Debug.Log($\"Old best: {best}\");", "        if (score > best)", "        {", "            PlayerPrefs.SetInt(\"best\", score);", "            Debug.Log(\"New best score!\");", "        }", "        int saved = PlayerPrefs.GetInt(\"best\", 0);", "        Debug.Log($\"Best: {saved}\");", "    }", "}"]; },
      run: function (v) { var o = ["Old best: 60"]; var best = 60; if (v.score > 60) { best = v.score; o.push("New best score!"); } o.push("Best: " + best); return o; },
      harness: function () { return "PlayerPrefs.SetInt(\"best\", 60);\nnew GameObject(\"Score\").AddComponent<BestScore>();\nEngine.Run(1, 0.5f);"; },
      explain: "GetInt reads the saved value (or 0 if there is none). The new score is saved only when it beats the old one." },
    { name: "Backpack", file: "Inventory.cs", about: "A List<string> holds items: Add puts things in, Remove takes them out, Count counts.",
      vars: [{ key: "potions", val: 2, min: 0, max: 5 }],
      code: function (v) { return ["using System.Collections.Generic;", "using UnityEngine;", "", "public class Inventory : MonoBehaviour", "{", "    public int potions = " + v.potions + ";", "    List<string> items = new List<string> { \"Sword\", \"Shield\" };", "", "    void Start()", "    {", "        for (int i = 0; i < potions; i++)", "        {", "            items.Add(\"Potion\");", "        }", "        Debug.Log($\"Items: {items.Count}\");", "        Debug.Log(string.Join(\", \", items));", "        items.Remove(\"Shield\");", "        Debug.Log($\"After dropping the shield: {items.Count}\");", "    }", "}"]; },
      run: function (v) { var items = ["Sword", "Shield"]; for (var i = 0; i < v.potions; i++) items.push("Potion"); var o = ["Items: " + items.length, items.join(", ")]; o.push("After dropping the shield: " + (items.length - 1)); return o; },
      harness: function () { return "new GameObject(\"Hero\").AddComponent<Inventory>();\nEngine.Run(1, 0.5f);"; },
      explain: "List<string> is a growable list of text. string.Join glues the items with commas, and Remove takes out the first matching item." },
    { name: "Poison Ticks", file: "Poison.cs", about: "InvokeRepeating calls Tick once a second until health runs out.",
      vars: [{ key: "hp", label: "starting hp", val: 20, min: 1, max: 60 }, { key: "damagePerTick", label: "damage per tick", val: 6, min: 1, max: 20 }],
      code: function (v) { return ["using UnityEngine;", "", "public class Poison : MonoBehaviour", "{", "    public int hp = " + v.hp + ";", "    public int damagePerTick = " + v.damagePerTick + ";", "", "    void Start()", "    {", "        InvokeRepeating(\"Tick\", 1f, 1f);", "    }", "", "    void Tick()", "    {", "        hp = Mathf.Max(hp - damagePerTick, 0);", "        Debug.Log($\"Poison! HP {hp}\");", "        if (hp == 0)", "        {", "            Debug.Log(\"Knocked out\");", "            CancelInvoke();", "        }", "    }", "}"]; },
      run: function (v) { var o = [], hp = v.hp; while (true) { hp = Math.max(hp - v.damagePerTick, 0); o.push("Poison! HP " + hp); if (hp === 0) { o.push("Knocked out"); break; } } return o; },
      harness: function (v) { return "new GameObject(\"Victim\").AddComponent<Poison>();\nEngine.Run(" + (Math.ceil(v.hp / v.damagePerTick) * 2 + 4) + ", 0.5f);"; },
      explain: "InvokeRepeating(\"Tick\", 1f, 1f) waits one second, then calls Tick every second. CancelInvoke stops the repeats once the player is knocked out." },
    { name: "Guard AI", file: "Guard.cs", about: "An enum state machine: the guard idles, chases or attacks depending on how far away the player is.",
      vars: [{ key: "chaseRange", label: "chase range", val: 8, min: 1, max: 15 }, { key: "attackRange", label: "attack range", val: 2, min: 0, max: 5 }],
      code: function (v) { return ["using UnityEngine;", "", "public class Guard : MonoBehaviour", "{", "    enum State { Idle, Chase, Attack }", "", "    public float chaseRange = " + v.chaseRange + "f;", "    public float attackRange = " + v.attackRange + "f;", "    float[] distances = { 12f, 9f, 6f, 3f, 1.5f, 5f, 10f };", "    State state = State.Idle;", "    int frame = 0;", "", "    void Update()", "    {", "        if (frame >= distances.Length) return;", "        float d = distances[frame];", "        frame++;", "        State next = d <= attackRange ? State.Attack : d <= chaseRange ? State.Chase : State.Idle;", "        if (next != state)", "        {", "            state = next;", "            Debug.Log($\"Player at {d} m: {state}\");", "        }", "    }", "}"]; },
      run: function (v) { var o = [], st = "Idle"; [12, 9, 6, 3, 1.5, 5, 10].forEach(function (d) { var nx = d <= v.attackRange ? "Attack" : d <= v.chaseRange ? "Chase" : "Idle"; if (nx !== st) { st = nx; o.push("Player at " + d + " m: " + st); } }); return o; },
      harness: function () { return "new GameObject(\"Guard\").AddComponent<Guard>();\nEngine.Run(8, 0.5f);"; },
      explain: "Each frame reads the next distance (a stand-in for Vector3.Distance to the player) and picks a state. It only reports a CHANGE of state, which is how real AI avoids spamming the Console." }
  ];

  var vt = [
    { line: "public class {c} : MonoBehaviour { }", why: "Every Unity script is a class that extends MonoBehaviour." },
    { line: 'void Start() { Debug.Log("{w}"); }', why: "Start runs once, before the first frame." },
    { line: "void Update() { {v}++; }", why: "Update runs every frame." },
    { line: "void FixedUpdate() { {f}(); }", why: "FixedUpdate runs on the physics clock." },
    { line: "void Awake() { {o} = GetComponent<Rigidbody>(); }", why: "Awake is the place to find your own components." },
    { line: "[SerializeField] float {v} = {dec}f;", why: "A private field you can still tune in the Inspector." },
    { line: "[SerializeField] int {v} = {n};", why: "Whole numbers in the Inspector, kept private in code." },
    { line: "public bool {v} = {b};", why: "A public bool shows as a checkbox in the Inspector." },
    { line: '[Header("{w}")]', why: "Header adds a heading above fields in the Inspector." },
    { line: "[Range(0f, {n}f)] public float {v};", why: "Range turns a number field into a slider." },
    { line: 'Debug.Log("{w}");', why: "Debug.Log prints a message in the Console." },
    { line: 'Debug.Log($"{w}: {{v}}");', why: "A $ string drops the value into the message." },
    { line: "transform.position += Vector3.up * {d};", why: "Add a vector to move the object." },
    { line: "transform.position = new Vector3({n}, 0f, {n2});", why: "Set a position from x, y and z." },
    { line: "transform.Translate(Vector3.forward * {v} * Time.deltaTime);", why: "Multiply by deltaTime to move per second." },
    { line: "transform.Rotate(0f, {n}f * Time.deltaTime, 0f);", why: "Rotate turns by degrees around each axis." },
    { line: "transform.localScale = Vector3.one * {d};", why: "localScale makes an object bigger or smaller." },
    { line: 'float {v} = Input.GetAxis("Horizontal");', why: "GetAxis reads a smooth -1 to 1 value." },
    { line: "if (Input.GetKeyDown(KeyCode.Space)) { {f}(); }", why: "GetKeyDown is true only on the frame the key goes down." },
    { line: "if (Input.GetKey(KeyCode.LeftShift)) { {v} *= {d}; }", why: "GetKey stays true while the key is held." },
    { line: "if (Input.GetMouseButtonDown(0)) { {f}(); }", why: "Mouse button 0 is the left button." },
    { line: "Rigidbody {o} = GetComponent<Rigidbody>();", why: "GetComponent finds another component on this object." },
    { line: "{o}.AddForce(Vector3.up * {d}f, ForceMode.Impulse);", why: "An impulse is an instant kick." },
    { line: "{o}.AddForce(transform.forward * {v});", why: "The default ForceMode pushes steadily." },
    { line: "{o}.linearVelocity = Vector3.zero;", why: "Setting velocity to zero stops a Rigidbody." },
    { line: "void OnCollisionEnter(Collision {o}) { {f}(); }", why: "Called when this object hits a solid collider." },
    { line: "void OnTriggerEnter(Collider {o}) { {f}(); }", why: "Called when something enters this trigger." },
    { line: 'if (other.CompareTag("{w}")) { {v}++; }', why: "CompareTag checks an object's label." },
    { line: "Destroy(other.gameObject);", why: "Destroy removes the object we touched." },
    { line: "Destroy(gameObject, {d}f);", why: "Destroy with a delay cleans up later." },
    { line: "Instantiate({o}, transform.position, Quaternion.identity);", why: "Instantiate spawns a copy of a prefab." },
    { line: "GameObject {o} = Instantiate({k}Prefab);", why: "Keep the copy Instantiate hands back." },
    { line: "float {v} = Vector3.Distance(transform.position, {o}.position);", why: "Distance measures how far apart two points are." },
    { line: "Vector3 {v} = ({o}.position - transform.position).normalized;", why: "Subtract positions, then normalize, to get a direction." },
    { line: "transform.position = Vector3.MoveTowards(transform.position, {o}.position, {v} * Time.deltaTime);", why: "MoveTowards steps closer without overshooting." },
    { line: "{v} = Mathf.Clamp({v}, 0, {n});", why: "Clamp keeps a value inside a range." },
    { line: "{v} = Mathf.Lerp({v}, {n}f, 0.{d}f);", why: "Lerp moves part of the way toward a target value." },
    { line: "int {v} = Random.Range(1, {n});", why: "Random.Range with whole numbers never returns the max." },
    { line: "StartCoroutine({k}Routine());", why: "StartCoroutine kicks off a coroutine." },
    { line: "yield return new WaitForSeconds({d}f);", why: "Pause the coroutine for some seconds." },
    { line: "yield return null;", why: "Pause the coroutine until the next frame." },
    { line: 'Invoke("{k}", {d}f);', why: "Invoke calls a method after a delay." },
    { line: 'InvokeRepeating("{k}", 1f, {d}f);', why: "InvokeRepeating calls a method again and again." },
    { line: "{v} += Time.deltaTime;", why: "Adding deltaTime each frame makes a timer in seconds." },
    { line: 'SceneManager.LoadScene("{w}");', why: "LoadScene switches to another scene." },
    { line: 'PlayerPrefs.SetInt("{w}", {v});', why: "PlayerPrefs saves a whole number between sessions." },
    { line: 'int {v} = PlayerPrefs.GetInt("{w}", 0);', why: "GetInt reads a saved number, with a default." },
    { line: '{o}.text = $"{w}: {{v}}";', why: "Setting a TextMeshPro text changes what the screen shows." },
    { line: "{o}.onClick.AddListener({k});", why: "AddListener connects a button to a method." },
    { line: '[CreateAssetMenu(menuName = "Game/{c}")]', why: "CreateAssetMenu puts your ScriptableObject in the Create menu." },
    { line: "public class {c} : ScriptableObject { public int {v}; }", why: "A ScriptableObject stores data as an asset." },
    { line: '{o}.SetTrigger("{w}");', why: "SetTrigger fires a one-time Animator parameter." },
    { line: '{o}.SetFloat("Speed", {v});', why: "SetFloat feeds a number to the Animator." },
    { line: "{o}.PlayOneShot({k}Clip);", why: "PlayOneShot plays a sound effect once." },
    { line: "{o}.SetActive({b});", why: "SetActive switches a GameObject on or off." },
    { line: "enabled = {b};", why: "enabled switches this script on or off." },
    { line: 'GameObject {o} = GameObject.FindWithTag("{w}");', why: "FindWithTag finds an object by its tag — do it once, not every frame." },
    { line: "if ({o} == null) return;", why: "Guard against missing references before using them." }
  ];
  var themes = [
    { name: "First Scripts", t: [0, 1, 2, 10, 11] },
    { name: "Lifecycle", t: [1, 2, 3, 4, 10] },
    { name: "Inspector Fields", t: [5, 6, 7, 8, 9] },
    { name: "Moving Things", t: [12, 13, 14, 15, 16] },
    { name: "Per-Second Moves", t: [14, 15, 43, 12, 5] },
    { name: "Player Input", t: [17, 18, 19, 20, 14] },
    { name: "Physics Pushes", t: [21, 22, 23, 24, 3] },
    { name: "Collisions", t: [25, 26, 27, 28, 29] },
    { name: "Spawning", t: [30, 31, 29, 28, 39] },
    { name: "Game Maths", t: [32, 33, 34, 35, 36] },
    { name: "Dice & Ranges", t: [37, 35, 36, 6, 11] },
    { name: "Coroutines", t: [38, 39, 40, 41, 42] },
    { name: "Timers", t: [43, 41, 42, 39, 10] },
    { name: "Scenes & Saves", t: [44, 45, 46, 11, 10] },
    { name: "UI Wiring", t: [47, 48, 11, 46, 7] },
    { name: "Data Assets", t: [49, 50, 5, 6, 0] },
    { name: "Animation & Sound", t: [51, 52, 53, 18, 1] },
    { name: "On and Off", t: [54, 55, 57, 2, 4] },
    { name: "Safe References", t: [56, 57, 21, 4, 32] },
    { name: "Unity Masters", t: [33, 34, 22, 38, 47] }
  ];
  var METHODS = ["Jump", "Heal", "Spawn", "Fire", "Reload", "Respawn", "Shoot", "Dash", "Collect", "Explode", "Open", "Close", "Flash", "Grow", "Shrink", "Spin", "Launch", "Celebrate"];
  var OBJS = ["rb", "body", "enemy", "coin", "door", "player", "target", "bullet", "label", "button", "animator", "speaker", "pickup", "portal"];

  return {
    blocks: blocks, chapters: chapters, shelves: shelves, glossary: glossary, field: field, cheats: cheats,
    projects: projects, vt: vt, themes: themes,
    /* C# methods are PascalCase in Unity, and {o} / {k} names fit the
       objects a game script juggles. */
    fill: function (k, r) {
      if (k === "f" || k === "k") return METHODS[Math.floor(r() * METHODS.length)];
      if (k === "o") return OBJS[Math.floor(r() * OBJS.length)];
      return null;
    },
    sandboxNote: "Thirty everyday Unity lines, in the order the Library teaches them — the C# you write inside Unity scripts. Each block takes 8 perfect repetitions, and your Unity progress is saved separately from every other track.",
    sourcesHTML: 'Unity facts and API names follow the <a href="https://docs.unity3d.com/Manual/index.html">Unity Manual</a> and <a href="https://docs.unity3d.com/ScriptReference/">Scripting Reference</a> (Unity 6). Every explanation is written in Code Block’s own words. Unity is a trademark of Unity Technologies; Code Block is not affiliated with it. The PC plays practice scripts in a small stand-in engine — Start once, then a few frames of Update — so what you see is what the Console would print; real physics, graphics and input live in Unity itself.'
  };
});
