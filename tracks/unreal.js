"use strict";
/* ================= UNREAL ENGINE — a Code Block track =================
   Gameplay programming in C++ with Unreal Engine 5, written fresh for
   Code Block in plain words. Facts and API names follow the Unreal Engine
   documentation (dev.epicgames.com/documentation) and Epic's C++ coding
   standard.

   Honest limits: this site cannot run Unreal Editor. The PC plays each
   practice Actor in a tiny stand-in engine (tests/content/stubs/unreal):
   the constructor runs, BeginPlay runs, then Tick runs for a few frames,
   and the screen shows the lines UE_LOG would write to the Output Log.
   Every practice Actor and library example is compiled with g++ (C++20)
   against that stand-in's copy of Unreal's API in the content tests, and
   every practice Actor's output is checked there — but rendering,
   physics, Blueprints and the editor only exist in Unreal itself. */
cbRegisterTrack("unreal", function () {
  var blocks = [
    { name: "Log Block", short: "UE_LOG", chapter: "Unreal Ch. 2 · Your First Actor", icon: "i-say", verb: "say",
      line: 'UE_LOG(LogTemp, Warning, TEXT("Hello"));',
      explain: "UE_LOG writes a line to the Output Log. LogTemp is a ready-made category, Warning makes the line yellow so it stands out, and TEXT() wraps text the way Unreal expects." },
    { name: "Actor Class Block", short: "AActor", chapter: "Unreal Ch. 2 · Your First Actor", icon: "i-shapes", verb: "declare",
      line: "class ACoin : public AActor",
      explain: "An Actor is anything you can place in a level. Classes that inherit from AActor start with A — ACoin, ADoor, AEnemy. That letter is an Unreal naming rule, not decoration." },
    { name: "Generated Body Block", short: "GENERATED", chapter: "Unreal Ch. 2 · Your First Actor", icon: "i-gear", verb: "generate",
      line: "GENERATED_BODY()",
      explain: "Every Unreal class needs GENERATED_BODY() as its first line. Unreal's build tools fill it with hidden code that lets the editor, Blueprints and saving understand your class." },
    { name: "Property Block", short: "UPROPERTY", chapter: "Unreal Ch. 4 · Properties", icon: "i-sliders", verb: "expose",
      line: "UPROPERTY(EditAnywhere) float Speed = 600.f;",
      explain: "UPROPERTY tells Unreal about a variable. EditAnywhere shows it in the Details panel so you can tune it without recompiling. 600.f is a float — Unreal measures distance in centimeters." },
    { name: "Function Macro Block", short: "UFUNCTION", chapter: "Unreal Ch. 12 · Blueprints and C++", icon: "i-play-circle", verb: "expose",
      line: "UFUNCTION(BlueprintCallable) void Jump();",
      explain: "UFUNCTION tells Unreal about a function. BlueprintCallable lets designers call it from a Blueprint graph — C++ builds the parts, Blueprints wire them together." },
    { name: "Tick On Block", short: "bCanEverTick", chapter: "Unreal Ch. 5 · Moving Actors", icon: "i-repeat", verb: "enable",
      line: "PrimaryActorTick.bCanEverTick = true;",
      explain: "Set in the constructor, this lets the Actor's Tick run every frame. Actors that don't need Tick should leave it off — thousands of idle Ticks add up." },
    { name: "BeginPlay Block", short: "BeginPlay", chapter: "Unreal Ch. 2 · Your First Actor", icon: "i-play", verb: "begin",
      line: "Super::BeginPlay();",
      explain: "BeginPlay runs when the game starts (or when the Actor is spawned). Calling Super::BeginPlay() first lets the parent class do its own start-up — forgetting it causes strange bugs." },
    { name: "Tick Block", short: "Tick", chapter: "Unreal Ch. 5 · Moving Actors", icon: "i-clock", verb: "tick",
      line: "virtual void Tick(float DeltaTime) override;",
      explain: "Tick runs every frame. DeltaTime is how many seconds the last frame took — multiply movement by it so speed is per second, not per frame. override says we're replacing AActor's version." },
    { name: "int32 Block", short: "int32", chapter: "Unreal Ch. 3 · Unreal's C++", icon: "i-box", verb: "count",
      line: "int32 Score = 0;",
      explain: "Unreal uses int32 instead of int, so a whole number is exactly 32 bits on every platform. Variables are written in PascalCase: Score, MaxHealth." },
    { name: "FString Block", short: "FString", chapter: "Unreal Ch. 3 · Unreal's C++", icon: "i-link", verb: "name",
      line: 'FString Name = TEXT("Hero");',
      explain: "FString is Unreal's text type. Wrap text in TEXT() so it's stored the way Unreal stores all text, safely for every language and platform." },
    { name: "Printf Block", short: "Printf", chapter: "Unreal Ch. 3 · Unreal's C++", icon: "i-pencil", verb: "format",
      line: 'FString Msg = FString::Printf(TEXT("Score: %d"), Score);',
      explain: "FString::Printf builds text with placeholders: %d for whole numbers, %f for floats, %s for text. The values after the comma fill the placeholders in order." },
    { name: "Log Value Block", short: "Log %s", chapter: "Unreal Ch. 3 · Unreal's C++", icon: "i-help", verb: "print",
      line: 'UE_LOG(LogTemp, Display, TEXT("%s"), *Msg);',
      explain: "To log an FString with %s, put a * in front: *Msg hands over the raw characters UE_LOG needs. Forgetting the * is one of the most common Unreal compile errors." },
    { name: "Location Block", short: "Location", chapter: "Unreal Ch. 5 · Moving Actors", icon: "i-cursor", verb: "move",
      line: "SetActorLocation(GetActorLocation() + FVector(0, 0, 10));",
      explain: "FVector holds X, Y, Z. In Unreal, Z points up and the units are centimeters, so this lifts the Actor 10 cm." },
    { name: "Rotation Block", short: "Rotate", chapter: "Unreal Ch. 5 · Moving Actors", icon: "i-rotate", verb: "spin",
      line: "AddActorLocalRotation(FRotator(0, 90 * DeltaTime, 0));",
      explain: "FRotator is Pitch, Yaw, Roll in degrees. Yaw turns left and right, so 90 × DeltaTime degrees each frame spins the Actor a quarter turn every second." },
    { name: "Direction Block", short: "Direction", chapter: "Unreal Ch. 13 · Containers and Math", icon: "i-point", verb: "aim",
      line: "FVector Dir = (Target - GetActorLocation()).GetSafeNormal();",
      explain: "Target minus where I am is the arrow toward the target. GetSafeNormal shrinks it to length 1 — and, unlike a plain normalize, safely handles a zero-length arrow." },
    { name: "Component Block", short: "Subobject", chapter: "Unreal Ch. 6 · Components", icon: "i-plus-square", verb: "build",
      line: 'Mesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));',
      explain: "In the constructor, CreateDefaultSubobject adds a component to the Actor. A Static Mesh Component gives it a visible 3D shape. The text is the component's name in the editor." },
    { name: "Root Block", short: "Root", chapter: "Unreal Ch. 6 · Components", icon: "i-anchor", verb: "anchor",
      line: "RootComponent = Mesh;",
      explain: "Every Actor has one root component that holds its place in the world. Other components attach under it with SetupAttachment and move with it." },
    { name: "Spawn Block", short: "Spawn", chapter: "Unreal Ch. 10 · Spawning", icon: "i-burst", verb: "spawn",
      line: "GetWorld()->SpawnActor<AActor>(ProjectileClass, Loc, Rot);",
      explain: "SpawnActor creates a new Actor in the running level at a location and rotation. GetWorld() is the level the Actor lives in." },
    { name: "Class Slot Block", short: "TSubclassOf", chapter: "Unreal Ch. 10 · Spawning", icon: "i-stamp", verb: "choose",
      line: "UPROPERTY(EditAnywhere) TSubclassOf<AActor> ProjectileClass;",
      explain: "TSubclassOf makes a slot in the Details panel where a designer picks WHICH class to spawn — often a Blueprint made from your C++ class." },
    { name: "Timer Block", short: "Timer", chapter: "Unreal Ch. 11 · Timers", icon: "i-hourglass", verb: "schedule",
      line: "GetWorldTimerManager().SetTimer(Handle, this, &ATurret::Fire, 1.0f, true);",
      explain: "SetTimer calls a function later. Here Fire runs every 1 second, and true means it loops. The FTimerHandle lets you stop it again with ClearTimer." },
    { name: "Destroy Block", short: "Destroy", chapter: "Unreal Ch. 10 · Spawning", icon: "i-x", verb: "remove",
      line: "Destroy();",
      explain: "Destroy removes this Actor from the level. Anything pointing at it should stop using it; IsValid() tells you if an Actor pointer is still safe." },
    { name: "Cast Block", short: "Cast", chapter: "Unreal Ch. 9 · Collisions", icon: "i-swap-h", verb: "check",
      line: "if (ACoin* Coin = Cast<ACoin>(OtherActor)) { Coin->Collect(); }",
      explain: "Cast checks whether an Actor is really a particular class. It gives back a pointer if yes, or nullptr if no — so the if only runs for coins." },
    { name: "Overlap Block", short: "Overlap", chapter: "Unreal Ch. 9 · Collisions", icon: "i-eye", verb: "listen",
      line: "Box->OnComponentBeginOverlap.AddDynamic(this, &ADoor::OnOverlap);",
      explain: "AddDynamic connects a component's overlap event to your function, so OnOverlap runs when something walks into the box. The function must be marked UFUNCTION()." },
    { name: "Clamp Block", short: "Clamp", chapter: "Unreal Ch. 13 · Containers and Math", icon: "i-gauge", verb: "limit",
      line: "Health = FMath::Clamp(Health - Damage, 0.f, 100.f);",
      explain: "FMath is Unreal's math toolbox. Clamp keeps Health between 0 and 100, however big the hit." },
    { name: "TArray Block", short: "TArray", chapter: "Unreal Ch. 13 · Containers and Math", icon: "i-boxes", verb: "list",
      line: "TArray<int32> Scores;",
      explain: "TArray is Unreal's growable list — like std::vector, but understood by the editor, Blueprints and saving. The type in angle brackets says what it holds." },
    { name: "Add Block", short: "Add", chapter: "Unreal Ch. 13 · Containers and Math", icon: "i-plus-square", verb: "add",
      line: "Scores.Add(10);",
      explain: "Add puts an item on the end of a TArray. Num() tells you how many items there are, and Scores[0] reaches the first one." },
    { name: "Loop Block", short: "Loop", chapter: "Unreal Ch. 13 · Containers and Math", icon: "i-rows", verb: "walk",
      line: "for (int32 i = 0; i < Scores.Num(); ++i) { }",
      explain: "A counting loop over a TArray uses Num() for the size. When you don't need the position, the shorter for (int32 S : Scores) walks the items directly." },
    { name: "Bind Input Block", short: "BindAction", chapter: "Unreal Ch. 7 · Player Input", icon: "i-keyboard", verb: "bind",
      line: "Input->BindAction(JumpAction, ETriggerEvent::Started, this, &AHero::Jump);",
      explain: "Enhanced Input connects an Input Action (an asset like IA_Jump) to a function. ETriggerEvent::Started fires once when the button goes down." },
    { name: "Screen Message Block", short: "OnScreen", chapter: "Unreal Ch. 14 · Pointers and Safety", icon: "i-flag", verb: "show",
      line: 'GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, TEXT("Hit!"));',
      explain: "Prints a debug message on the game screen for 5 seconds, in green. -1 means always add a new line instead of replacing one. Great for quick checks while playing." },
    { name: "Open Level Block", short: "OpenLevel", chapter: "Unreal Ch. 16 · Levels and Saving", icon: "i-visit", verb: "travel",
      line: 'UGameplayStatics::OpenLevel(this, FName("Level2"));',
      explain: "OpenLevel loads another map. UGameplayStatics is a toolbox of handy game functions: getting the player, playing sounds, pausing and more." }
  ];

  function ue(name, header, cpp) { return "// " + name + ".h\n" + header + "\n\n// " + name + ".cpp\n" + cpp; }
  var chapters = [
    { title: "What Is Unreal Engine?", chapter: "Start here · the editor, levels, Actors, Blueprints", line: "class AMyActor : public AActor",
      content: {
        story: ["Unreal Engine is a game engine from Epic Games, famous for realistic graphics and used for games, films and virtual sets. It's free to download through the Epic Games Launcher, with royalties only owed on very successful commercial games.",
          "A game world in Unreal is a level (also called a map). Everything placed in a level is an Actor — the player, lights, a door, a pickup. Actors are built from components: a mesh to see, a collision shape to touch, a sound to hear.",
          "You can program Unreal two ways. Blueprints are visual scripts: boxes joined by wires, made right in the editor. C++ is typed code, faster and more powerful for big systems. Most teams use both: C++ builds the core pieces, and Blueprints customize and connect them."],
        big: "Levels hold Actors, Actors are built from components, and gameplay is written in Blueprints, C++, or — usually — both together.",
        caption: "An empty level fills up with Actors: a floor, a light, a player and a glowing coin. Tap Play.",
        demo: ["New level (map)", "+ Floor Actor (a mesh)", "+ Light Actor", "+ ACoin, written in C++"]
      },
      deep: {
        more: ["The editor's main panels: the Viewport (the 3D world), the Outliner (every Actor in the level), the Details panel (the selected Actor's settings), and the Content Browser (your files). Press Play to test the game right inside the editor.",
          "To write C++ you need a C++ project and a compiler — Visual Studio on Windows, Xcode on macOS, or JetBrains Rider. Tools → New C++ Class creates a matching .h header and .cpp file for you."],
        ex: { code: ue("HelloActor", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"HelloActor.generated.h\"\n\nUCLASS()\nclass AHelloActor : public AActor\n{\n    GENERATED_BODY()\n\nprotected:\n    virtual void BeginPlay() override;\n};",
          "#include \"HelloActor.h\"\n\nvoid AHelloActor::BeginPlay()\n{\n    Super::BeginPlay();\n    UE_LOG(LogTemp, Warning, TEXT(\"Hello from %s!\"), *GetName());\n}"),
          walk: ["HelloActor.h: the header declares the class — what it is and what it can do.", "The generated.h include must come last; Unreal's tools write that file.", "UCLASS() and GENERATED_BODY() let Unreal see the class.", "HelloActor.cpp: the code file says HOW BeginPlay works.", "Super::BeginPlay() first, then a yellow line in the Output Log with the Actor's name."] },
        mistake: "Putting #include \"HelloActor.generated.h\" anywhere but last in the header. Unreal's build tools insist it's the final include, and the error message is confusing if it isn't."
      } },
    { title: "Your First Actor", chapter: "Header and source, UCLASS, BeginPlay, UE_LOG, Live Coding", line: 'UE_LOG(LogTemp, Warning, TEXT("Hello"));',
      content: {
        story: ["Each C++ class in Unreal lives in two files. The header (.h) declares the class: its variables and the names of its functions. The source file (.cpp) defines what those functions actually do. Other files include the header to use the class.",
          "Unreal adds macros you'll see everywhere: UCLASS() above the class, GENERATED_BODY() inside it, UPROPERTY() above variables and UFUNCTION() above functions. They let the editor, Blueprints, saving and the garbage collector understand your code.",
          "BeginPlay runs when play starts; always call Super::BeginPlay() first. UE_LOG writes to the Output Log (Window → Output Log). After changing C++, compile — with the editor open, Live Coding (Ctrl+Alt+F11) rebuilds without restarting."],
        big: "Headers declare, .cpp files define; UCLASS and GENERATED_BODY make a class visible to Unreal; BeginPlay starts it and UE_LOG reports.",
        caption: "Two pages side by side: the header names the parts, the source builds them. Tap Play.",
        demo: ["ACoin.h: class ACoin : public AActor", "ACoin.cpp: void ACoin::BeginPlay()", "Compile (Live Coding)", "Output Log: LogTemp: Warning: Hello"]
      },
      deep: {
        more: ["UE_LOG's verbosity changes the color and filtering: Log is plain, Display always shows, Warning is yellow, Error is red. Make your own category with DEFINE_LOG_CATEGORY_STATIC(LogCoins, Log, All); to filter your messages.",
          "Live Coding can't handle every change — adding new UPROPERTYs or classes sometimes needs a full rebuild with the editor closed. If things act strangely after a change, close the editor and build from your IDE."],
        ex: { code: ue("FrameCounter", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"FrameCounter.generated.h\"\n\nUCLASS()\nclass AFrameCounter : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    AFrameCounter();\n    virtual void Tick(float DeltaTime) override;\n\nprotected:\n    virtual void BeginPlay() override;\n\nprivate:\n    int32 Frames = 0;\n};",
          "#include \"FrameCounter.h\"\n\nAFrameCounter::AFrameCounter()\n{\n    PrimaryActorTick.bCanEverTick = true;\n}\n\nvoid AFrameCounter::BeginPlay()\n{\n    Super::BeginPlay();\n    UE_LOG(LogTemp, Display, TEXT(\"Counting frames...\"));\n}\n\nvoid AFrameCounter::Tick(float DeltaTime)\n{\n    Super::Tick(DeltaTime);\n    Frames++;\n    if (Frames % 60 == 0)\n    {\n        UE_LOG(LogTemp, Display, TEXT(\"%d frames so far\"), Frames);\n    }\n}"),
          walk: ["The constructor switches Tick on.", "BeginPlay logs once when play starts.", "Tick adds one every frame, and every 60th frame logs the count."] },
        mistake: "Forgetting Super::BeginPlay() or Super::Tick(DeltaTime). The parent class's setup never runs, and components or Blueprint events quietly stop working."
      } },
    { title: "Unreal's C++ Flavour", chapter: "Prefixes, int32, FString, FName, FText, TEXT()", line: 'FString Name = TEXT("Hero");',
      content: {
        story: ["Unreal C++ is standard C++ with house rules. Type names carry a prefix letter: A for Actors (AActor, ACharacter), U for other Unreal objects and components (UStaticMeshComponent), F for plain structs (FVector, FString), E for enums, T for templates (TArray), I for interfaces.",
          "Numbers have exact sizes: int32, uint8, int64. Floats are float or double. Bools start with b by convention: bIsAlive, bCanJump. Names are PascalCase: MaxHealth, OnHit.",
          "Text has three types. FString is everyday changeable text. FName is a fast, unchangeable name for things like tags and sockets. FText is for words the player sees, because it can be translated. Wrap text literals in TEXT(\"…\")."],
        big: "Prefixes tell you what a type is (A, U, F, E, T, I); int32 and friends fix number sizes; FString, FName and FText each have a job.",
        caption: "Name tags on every type: A for Actor, U for Object, F for plain struct, T for template. Tap Play.",
        demo: ["AActor → something in the level", "UStaticMeshComponent → a part of an Actor", "FVector → a plain value", "TArray<int32> → a template container"]
      },
      deep: {
        more: ["FString::Printf builds text with printf-style placeholders: %d for int32, %f for floats (%.1f for one decimal), %s for text — and FStrings passed to %s need a * in front.",
          "Converting between them: FName(*MyString), MyName.ToString(), FText::FromString(MyString), MyText.ToString(). FString::FromInt(42) and FString::SanitizeFloat(2.5) turn numbers into text."],
        ex: { code: ue("NameTag", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"NameTag.generated.h\"\n\nUCLASS()\nclass ANameTag : public AActor\n{\n    GENERATED_BODY()\n\nprotected:\n    virtual void BeginPlay() override;\n\nprivate:\n    FString Hero = TEXT(\"Ana\");\n    int32 Level = 3;\n    bool bIsReady = true;\n};",
          "#include \"NameTag.h\"\n\nvoid ANameTag::BeginPlay()\n{\n    Super::BeginPlay();\n    FString Line = FString::Printf(TEXT(\"%s is level %d\"), *Hero, Level);\n    UE_LOG(LogTemp, Display, TEXT(\"%s\"), *Line);\n    FName Tag(TEXT(\"Player\"));\n    FText Shown = FText::FromString(Hero.ToUpper());\n    UE_LOG(LogTemp, Display, TEXT(\"%s / %s / ready: %d\"), *Tag.ToString(), *Shown.ToString(), bIsReady);\n}"),
          walk: ["Three members: an FString, an int32 and a bool named with b.", "Printf fills %s with *Hero and %d with Level: Ana is level 3.", "An FName for a tag, and an FText for on-screen words.", "The last log shows Player / ANA / ready: 1."] },
        mistake: "Passing an FString to %s without the *. UE_LOG(LogTemp, Log, TEXT(\"%s\"), Name) won't compile (or crashes on some compilers); it must be *Name."
      } },
    { title: "Properties and the Details Panel", chapter: "UPROPERTY specifiers: EditAnywhere, VisibleAnywhere, Blueprint access", line: "UPROPERTY(EditAnywhere) float Speed = 600.f;",
      content: {
        story: ["Put UPROPERTY() above a variable and Unreal tracks it. Add specifiers to choose how it appears: EditAnywhere lets you change it in the Details panel for both the class and each placed Actor; VisibleAnywhere shows it read-only; EditDefaultsOnly allows changes only on the class, not per Actor.",
          "Blueprint access is separate: BlueprintReadWrite lets Blueprint graphs read and change it, BlueprintReadOnly only read it. Category = \"Movement\" groups properties under a heading.",
          "meta specifiers add polish: meta = (ClampMin = \"0\", ClampMax = \"100\") stops silly values. Component pointers are usually VisibleAnywhere — you edit the component's own settings, not which component it is."],
        big: "UPROPERTY plus specifiers decides who can see and change a variable: the Details panel (Edit/Visible…) and Blueprints (BlueprintRead…).",
        caption: "Variables pop up in the Details panel as boxes and sliders, grouped by category. Tap Play.",
        demo: ["UPROPERTY(EditAnywhere, Category=\"Movement\")", "float Speed = 600.f;", "Details panel → Movement → Speed", "change it per Actor, no recompile"]
      },
      deep: {
        more: ["A UPROPERTY on a pointer to an Unreal object also tells the garbage collector “this object is in use” — so the object isn't deleted out from under you. Unreal object pointers that aren't UPROPERTYs can be cleaned up unexpectedly.",
          "Values set in the Details panel override the defaults in your constructor. If a change in code seems to have no effect, the level's Actor may hold an older Details value — reset it with the yellow arrow."],
        ex: { code: ue("Mover", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"Mover.generated.h\"\n\nUCLASS()\nclass AMover : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = \"Movement\", meta = (ClampMin = \"0\"))\n    float Speed = 600.f;\n\n    UPROPERTY(EditAnywhere, Category = \"Movement\")\n    bool bCanJump = true;\n\n    UPROPERTY(VisibleAnywhere, Category = \"Stats\")\n    int32 TimesMoved = 0;\n\nprotected:\n    virtual void BeginPlay() override;\n};",
          "#include \"Mover.h\"\n\nvoid AMover::BeginPlay()\n{\n    Super::BeginPlay();\n    UE_LOG(LogTemp, Display, TEXT(\"Speed %.0f, jump %d, moved %d\"), Speed, bCanJump, TimesMoved);\n}"),
          walk: ["Speed: editable everywhere, readable and writable from Blueprints, never below 0.", "bCanJump: a checkbox under Movement.", "TimesMoved: shown but not editable.", "BeginPlay logs the values the Details panel holds."] },
        mistake: "Exposing everything as EditAnywhere and BlueprintReadWrite. Then any Actor or Blueprint can change anything. Give each property only the access it needs."
      } },
    { title: "Moving Actors", chapter: "FVector, FRotator, Tick and DeltaTime", line: "AddActorLocalRotation(FRotator(0, 90 * DeltaTime, 0));",
      content: {
        story: ["An Actor's place in the world is its location (an FVector of X, Y, Z), rotation (an FRotator of Pitch, Yaw, Roll in degrees) and scale. In Unreal, Z points up, X points forward, and one unit is one centimeter.",
          "Move with SetActorLocation(new spot) or AddActorWorldOffset(change); turn with SetActorRotation or AddActorLocalRotation. GetActorLocation() and GetActorRotation() read where it is now.",
          "Smooth movement happens in Tick, every frame. Frames vary in length, so multiply by DeltaTime (the seconds since the last frame): Speed * DeltaTime turns “centimeters per frame” into “centimeters per second.”"],
        big: "Location is an FVector (Z up, centimeters), rotation an FRotator (degrees); move a little every Tick, scaled by DeltaTime.",
        caption: "A coin hovers and turns a quarter circle every second, frame after frame. Tap Play.",
        demo: ["Location (0, 0, 100)", "AddActorWorldOffset((0, 0, 10)) → Z 110", "Yaw 0 → AddActorLocalRotation((0, 90, 0))", "→ Yaw 90"]
      },
      deep: {
        more: ["Unreal reports rotations normalized between -180 and 180 degrees, so turning past 180 shows up as negative: 270 degrees reads as -90.",
          "FMath::FInterpTo and VInterpTo ease a value or position toward a target each frame — a smooth, slowing approach that's perfect for cameras and doors."],
        ex: { code: ue("Hover", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"Hover.generated.h\"\n\nUCLASS()\nclass AHover : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    AHover();\n    virtual void Tick(float DeltaTime) override;\n\n    UPROPERTY(EditAnywhere)\n    float DegreesPerSecond = 90.f;\n\n    UPROPERTY(EditAnywhere)\n    float RiseSpeed = 20.f;\n};",
          "#include \"Hover.h\"\n\nAHover::AHover()\n{\n    PrimaryActorTick.bCanEverTick = true;\n}\n\nvoid AHover::Tick(float DeltaTime)\n{\n    Super::Tick(DeltaTime);\n    AddActorLocalRotation(FRotator(0.f, DegreesPerSecond * DeltaTime, 0.f));\n    AddActorWorldOffset(FVector(0.f, 0.f, RiseSpeed * DeltaTime));\n}"),
          walk: ["Constructor: Tick is switched on.", "Two settings in the Details panel: turn speed and rise speed.", "Tick turns around Yaw and rises along Z, both per second thanks to DeltaTime."] },
        mistake: "Moving without DeltaTime: AddActorWorldOffset(FVector(0, 0, 10)) in Tick rises 10 cm EVERY FRAME — 600 cm a second at 60 fps, but 1,200 at 120 fps."
      } },
    { title: "Components", chapter: "CreateDefaultSubobject, RootComponent, SetupAttachment", line: 'Mesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));',
      content: {
        story: ["An Actor is a container; components are its parts. A Static Mesh Component draws a 3D model, a Box Component is an invisible collision shape, a Point Light glows, an Audio Component plays sound, a Camera Component sees.",
          "Components are created in the constructor with CreateDefaultSubobject<Type>(TEXT(\"Name\")) and stored in UPROPERTY pointers. One of them becomes the RootComponent — the Actor's anchor in the world — and others attach to it with SetupAttachment(RootComponent).",
          "You can also write your own components by inheriting from UActorComponent (behavior, like a Health component) or USceneComponent (behavior with a position). Reusable components keep Actors small and tidy."],
        big: "Build an Actor from components in its constructor: create them, pick a root, attach the rest.",
        caption: "A pickup is assembled: a box to touch, a mesh to see, a light to glow. Tap Play.",
        demo: ["Box = CreateDefaultSubobject<UBoxComponent>", "RootComponent = Box", "Mesh->SetupAttachment(Box)", "Light->SetupAttachment(Box)"]
      },
      deep: {
        more: ["Components made with CreateDefaultSubobject show up in the Details panel, where their settings (the mesh to draw, the box size) can be changed per Actor or in a Blueprint child class.",
          "A UActorComponent has its own BeginPlay and TickComponent, and GetOwner() gives the Actor it's attached to — so one Health component works on players, enemies and crates alike."],
        ex: { code: ue("Pickup", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"Components/BoxComponent.h\"\n#include \"Components/StaticMeshComponent.h\"\n#include \"Pickup.generated.h\"\n\nUCLASS()\nclass APickup : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    APickup();\n\n    UPROPERTY(VisibleAnywhere)\n    UBoxComponent* Box;\n\n    UPROPERTY(VisibleAnywhere)\n    UStaticMeshComponent* Mesh;\n};",
          "#include \"Pickup.h\"\n\nAPickup::APickup()\n{\n    Box = CreateDefaultSubobject<UBoxComponent>(TEXT(\"Box\"));\n    RootComponent = Box;\n    Box->SetBoxExtent(FVector(40.f, 40.f, 40.f));\n\n    Mesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT(\"Mesh\"));\n    Mesh->SetupAttachment(Box);\n}"),
          walk: ["Two component pointers, visible in the Details panel.", "The box becomes the root and gets a size (half-extents in cm).", "The mesh attaches to the box, so it moves with it."] },
        mistake: "Calling CreateDefaultSubobject outside the constructor (for example in BeginPlay). It only works in the constructor; at runtime use NewObject and RegisterComponent instead."
      } },
    { title: "Player Input", chapter: "Enhanced Input: actions, mapping contexts, BindAction", line: "Input->BindAction(JumpAction, ETriggerEvent::Started, this, &AHero::Jump);",
      content: {
        story: ["Unreal Engine 5 uses Enhanced Input. Instead of asking about specific keys, you create Input Action assets — IA_Jump, IA_Move — and an Input Mapping Context that says which keys, buttons and sticks trigger each action.",
          "In C++, a Pawn or Character binds actions to functions in SetupPlayerInputComponent: BindAction(JumpAction, ETriggerEvent::Started, this, &AHero::Jump). Started fires once when pressed, Triggered keeps firing while held, Completed fires on release.",
          "Actions carry values: a button is a bool, a trigger a float, a stick or WASD an FVector2D. The bound function receives an FInputActionValue and reads it with Value.Get<FVector2D>()."],
        big: "Enhanced Input maps keys to Input Actions; C++ binds each action to a function and reads its value.",
        caption: "Space, the A button and a screen tap all flow into one IA_Jump action. Tap Play.",
        demo: ["IA_Jump ← Space / Gamepad A", "BindAction(IA_Jump, Started, Jump)", "player presses Space", "AHero::Jump() runs"]
      },
      deep: {
        more: ["The mapping context must be added to the player's Enhanced Input subsystem (usually in BeginPlay or when the Pawn is possessed), or no input arrives at all — the most common Enhanced Input puzzle.",
          "Modifiers and triggers on the actions handle details like dead zones, inverting an axis, or “hold for half a second” — set up in the assets, without code."],
        ex: { code: ue("Hero", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Character.h\"\n#include \"InputActionValue.h\"\n#include \"Hero.generated.h\"\n\nclass UInputAction;\n\nUCLASS()\nclass AHero : public ACharacter\n{\n    GENERATED_BODY()\n\npublic:\n    virtual void SetupPlayerInputComponent(UInputComponent* PlayerInput) override;\n\n    UPROPERTY(EditAnywhere, Category = \"Input\")\n    UInputAction* JumpAction;\n\n    UPROPERTY(EditAnywhere, Category = \"Input\")\n    UInputAction* MoveAction;\n\nprivate:\n    void Move(const FInputActionValue& Value);\n};",
          "#include \"Hero.h\"\n#include \"EnhancedInputComponent.h\"\n\nvoid AHero::SetupPlayerInputComponent(UInputComponent* PlayerInput)\n{\n    Super::SetupPlayerInputComponent(PlayerInput);\n    if (UEnhancedInputComponent* Input = Cast<UEnhancedInputComponent>(PlayerInput))\n    {\n        Input->BindAction(JumpAction, ETriggerEvent::Started, this, &ACharacter::Jump);\n        Input->BindAction(MoveAction, ETriggerEvent::Triggered, this, &AHero::Move);\n    }\n}\n\nvoid AHero::Move(const FInputActionValue& Value)\n{\n    FVector2D Axis = Value.Get<FVector2D>();\n    AddMovementInput(FVector::ForwardVector, Axis.Y);\n    AddMovementInput(FVector::RightVector, Axis.X);\n}"),
          walk: ["Two Input Action slots, filled in the editor with IA_Jump and IA_Move.", "SetupPlayerInputComponent casts to the Enhanced Input component.", "Jump uses ACharacter's built-in Jump; Move is our own.", "Move reads the stick or WASD as an FVector2D and feeds it to the character."] },
        mistake: "Binding actions but never adding the Input Mapping Context. The bindings exist, but no key is mapped to any action, so nothing happens."
      } },
    { title: "Pawns and Characters", chapter: "APawn, ACharacter, movement, Game Mode", line: "class AHero : public ACharacter",
      content: {
        story: ["A Pawn is an Actor that can be controlled — by a player or by AI. A Character is a Pawn that walks: it comes with a capsule for collision, a skeletal mesh, and the CharacterMovementComponent, which already knows how to walk, jump, fall, swim and fly.",
          "Controllers do the controlling. A PlayerController turns the player's input into commands for the Pawn it possesses; an AIController does the same for computer-run characters.",
          "The Game Mode sets the rules of a level, including which Pawn the player starts as (Default Pawn Class). Set it in World Settings or Project Settings → Maps & Modes."],
        big: "Pawns can be controlled, Characters can walk; Controllers possess them, and the Game Mode picks the player's Pawn.",
        caption: "A Controller plugs into a Character like a game pad into a robot. Tap Play.",
        demo: ["Game Mode: Default Pawn = AHero", "PlayerController possesses AHero", "AddMovementInput → walks", "Jump() → CharacterMovement jumps"]
      },
      deep: {
        more: ["GetCharacterMovement() gives the movement component, with settings like MaxWalkSpeed (centimeters per second) and JumpZVelocity — easy to change for sprinting or power-ups.",
          "UGameplayStatics::GetPlayerPawn(this, 0) finds the first player's Pawn from anywhere — handy for enemies that need to know where the player is."],
        ex: { code: ue("Sprinter", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Character.h\"\n#include \"GameFramework/CharacterMovementComponent.h\"\n#include \"Sprinter.generated.h\"\n\nUCLASS()\nclass ASprinter : public ACharacter\n{\n    GENERATED_BODY()\n\npublic:\n    UPROPERTY(EditAnywhere, Category = \"Movement\")\n    float WalkSpeed = 400.f;\n\n    UPROPERTY(EditAnywhere, Category = \"Movement\")\n    float SprintSpeed = 800.f;\n\n    void StartSprint();\n    void StopSprint();\n};",
          "#include \"Sprinter.h\"\n\nvoid ASprinter::StartSprint()\n{\n    GetCharacterMovement()->MaxWalkSpeed = SprintSpeed;\n}\n\nvoid ASprinter::StopSprint()\n{\n    GetCharacterMovement()->MaxWalkSpeed = WalkSpeed;\n}"),
          walk: ["A Character with two speeds, in centimeters per second.", "StartSprint raises the movement component's top speed.", "StopSprint puts it back — bind these to an action's Started and Completed events."] },
        mistake: "Moving a Character by setting its location every frame. It skips the movement component's collision and walking logic. Use AddMovementInput and let CharacterMovement do the work."
      } },
    { title: "Collisions and Overlaps", chapter: "Collision presets, overlap events, AddDynamic, Cast", line: "Box->OnComponentBeginOverlap.AddDynamic(this, &ADoor::OnOverlap);",
      content: {
        story: ["Each component with collision has a preset deciding what it does with other things: Block (solid, like walls), Overlap (pass through, but notice), or Ignore. Overlaps are for sensors — pickups, doors that open, finish lines.",
          "When something enters an overlapping component, it fires OnComponentBeginOverlap. Connect your function with AddDynamic in BeginPlay; the function needs UFUNCTION() and a specific list of parameters, the most useful being OtherActor — who walked in.",
          "To know what OtherActor is, Cast it: if (AHero* Hero = Cast<AHero>(OtherActor)). Or check a tag: OtherActor->ActorHasTag(TEXT(\"Coin\")). Blocking hits use OnComponentHit the same way."],
        big: "Overlap presets make sensors; bind OnComponentBeginOverlap with AddDynamic, then Cast or check tags to see who arrived.",
        caption: "The hero walks into a glowing box, the overlap event fires, and the door swings open. Tap Play.",
        demo: ["Box: collision preset OverlapAllDynamic", "AddDynamic(this, &ADoor::OnOverlap)", "hero walks in → OnOverlap(OtherActor = hero)", "Cast<AHero> succeeds → open the door"]
      },
      deep: {
        more: ["Generate Overlap Events must be ticked on BOTH components for overlaps to fire, and the presets must agree to overlap each other. When nothing fires, check both sides.",
          "AddDynamic binds to Unreal's reflected functions, which is why the target must be a UFUNCTION — a plain C++ function compiles but never gets called, or fails to bind."],
        ex: { code: ue("Door", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"Components/BoxComponent.h\"\n#include \"Door.generated.h\"\n\nUCLASS()\nclass ADoor : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    ADoor();\n\n    UPROPERTY(VisibleAnywhere)\n    UBoxComponent* Trigger;\n\nprotected:\n    virtual void BeginPlay() override;\n\n    UFUNCTION()\n    void OnOverlap(UPrimitiveComponent* OverlappedComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);\n};",
          "#include \"Door.h\"\n\nADoor::ADoor()\n{\n    Trigger = CreateDefaultSubobject<UBoxComponent>(TEXT(\"Trigger\"));\n    RootComponent = Trigger;\n}\n\nvoid ADoor::BeginPlay()\n{\n    Super::BeginPlay();\n    Trigger->OnComponentBeginOverlap.AddDynamic(this, &ADoor::OnOverlap);\n}\n\nvoid ADoor::OnOverlap(UPrimitiveComponent* OverlappedComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)\n{\n    if (OtherActor && OtherActor->ActorHasTag(TEXT(\"Player\")))\n    {\n        UE_LOG(LogTemp, Display, TEXT(\"Door opens for %s\"), *OtherActor->GetName());\n    }\n}"),
          walk: ["The header declares a trigger box and an overlap handler marked UFUNCTION().", "The constructor makes the box the root.", "BeginPlay binds the overlap event to OnOverlap.", "OnOverlap checks the visitor's tag and opens the door for players only."] },
        mistake: "Binding with AddDynamic in the constructor. Bindings made there can be lost when Blueprints are recompiled; bind in BeginPlay (or PostInitializeComponents)."
      } },
    { title: "Spawning and Destroying", chapter: "TSubclassOf, SpawnActor, Destroy, SetLifeSpan", line: "GetWorld()->SpawnActor<AActor>(ProjectileClass, Loc, Rot);",
      content: {
        story: ["Games create things while they run: bullets, enemies, particles, loot. GetWorld()->SpawnActor<T>(Class, Location, Rotation) creates a new Actor in the level and returns a pointer to it.",
          "Which class to spawn is usually chosen in the editor with a TSubclassOf<AActor> property. A designer picks a Blueprint — BP_Fireball, BP_Goblin — and your C++ spawns it without knowing the details.",
          "Destroy() removes an Actor, and SetLifeSpan(3.f) destroys it automatically after three seconds — perfect for projectiles and effects. Always check that a spawn worked: SpawnActor can return nullptr."],
        big: "TSubclassOf lets designers pick what to spawn; SpawnActor creates it; Destroy and SetLifeSpan clean up.",
        caption: "A turret fires: each shot is spawned at the barrel and vanishes three seconds later. Tap Play.",
        demo: ["UPROPERTY(EditAnywhere) TSubclassOf<AActor> Shot", "Designer picks BP_Fireball", "SpawnActor(Shot, Muzzle, Aim)", "SetLifeSpan(3) → gone in 3 s"]
      },
      deep: {
        more: ["Spawning hundreds of Actors per second is expensive. For rapid fire, an object pool — reusing hidden Actors instead of spawning new ones — keeps frame rates steady.",
          "FActorSpawnParameters controls details like who owns the new Actor and what to do if the spawn spot is blocked (SpawnCollisionHandlingOverride)."],
        ex: { code: ue("Launcher", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"Launcher.generated.h\"\n\nUCLASS()\nclass ALauncher : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    UPROPERTY(EditAnywhere, Category = \"Spawning\")\n    TSubclassOf<AActor> ShotClass;\n\n    UFUNCTION(BlueprintCallable)\n    void Fire();\n};",
          "#include \"Launcher.h\"\n#include \"Engine/World.h\"\n\nvoid ALauncher::Fire()\n{\n    if (!ShotClass) return;\n    FVector Spot = GetActorLocation() + GetActorForwardVector() * 100.f;\n    AActor* Shot = GetWorld()->SpawnActor<AActor>(ShotClass, Spot, GetActorRotation());\n    if (Shot)\n    {\n        Shot->SetLifeSpan(3.f);\n    }\n}"),
          walk: ["A class slot, filled in the editor.", "Fire does nothing if no class was chosen.", "Spawn one meter in front of the launcher, facing the same way.", "If the spawn worked, the shot destroys itself after 3 seconds."] },
        mistake: "Using the spawned pointer without checking it. If the spot was blocked or no class was set, SpawnActor returns nullptr and the next line crashes the game."
      } },
    { title: "Timers and Delays", chapter: "FTimerManager, SetTimer, ClearTimer, looping", line: "GetWorldTimerManager().SetTimer(Handle, this, &ATurret::Fire, 1.0f, true);",
      content: {
        story: ["Many things happen on a schedule: a turret fires every second, a bomb explodes after three, a buff wears off after ten. Timers do this without counting in Tick.",
          "GetWorldTimerManager().SetTimer(Handle, this, &AClass::Function, Rate, bLoop) calls Function after Rate seconds, and again every Rate seconds if bLoop is true. The FTimerHandle variable remembers the timer.",
          "Stop a timer with ClearTimer(Handle), and check it with IsTimerActive(Handle). Timers belong to the world, so they pause with the game and stop when the Actor is destroyed."],
        big: "SetTimer calls a function later (or repeatedly) and an FTimerHandle lets you stop it — cheaper and clearer than counting in Tick.",
        caption: "A turret's timer ticks: bang, wait, bang, wait — until the ammo runs out and the timer stops. Tap Play.",
        demo: ["SetTimer(Handle, Fire, 1.0, loop)", "1 s → Fire()", "2 s → Fire()", "ammo 0 → ClearTimer(Handle)"]
      },
      deep: {
        more: ["A sixth parameter sets a different first delay: SetTimer(Handle, this, &AMine::Arm, 0.5f, true, 2.f) waits two seconds, then repeats every half second.",
          "Prefer timers over Tick for anything that happens occasionally. An Actor that ticks every frame just to check a countdown wastes work thousands of times a minute."],
        ex: { code: ue("Bomb", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"Bomb.generated.h\"\n\nUCLASS()\nclass ABomb : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    UPROPERTY(EditAnywhere)\n    float FuseSeconds = 3.f;\n\nprotected:\n    virtual void BeginPlay() override;\n\nprivate:\n    FTimerHandle FuseTimer;\n    void Explode();\n};",
          "#include \"Bomb.h\"\n#include \"TimerManager.h\"\n\nvoid ABomb::BeginPlay()\n{\n    Super::BeginPlay();\n    GetWorldTimerManager().SetTimer(FuseTimer, this, &ABomb::Explode, FuseSeconds, false);\n}\n\nvoid ABomb::Explode()\n{\n    UE_LOG(LogTemp, Warning, TEXT(\"Boom!\"));\n    Destroy();\n}"),
          walk: ["The fuse length is editable in the Details panel.", "A private FTimerHandle remembers the timer.", "BeginPlay lights the fuse: Explode runs once, after FuseSeconds.", "Explode logs and removes the bomb."] },
        mistake: "Passing a function that doesn't match: SetTimer needs a function with no parameters returning void. A function with parameters won't compile in this form."
      } },
    { title: "Blueprints and C++ Together", chapter: "BlueprintCallable, BlueprintImplementableEvent, Blueprint children", line: "UFUNCTION(BlueprintCallable) void Jump();",
      content: {
        story: ["The usual Unreal workflow: write the core of a class in C++, then make a Blueprint class that inherits from it. The Blueprint adds the mesh, sounds, effects and tuning — designers work there without touching code.",
          "UFUNCTION(BlueprintCallable) lets Blueprints call your C++ function. UFUNCTION(BlueprintImplementableEvent) declares an event that C++ triggers and the Blueprint implements — perfect for “play the hit effect” moments.",
          "Properties marked BlueprintReadWrite or BlueprintReadOnly appear in Blueprint graphs. Keep heavy logic in C++, and let Blueprints handle the visuals and wiring."],
        big: "C++ builds the parts, Blueprint children customize them; BlueprintCallable and BlueprintImplementableEvent are the bridges.",
        caption: "A C++ class on the left, its Blueprint child on the right, wires running between them. Tap Play.",
        demo: ["C++: AEnemy with TakeHit()", "UFUNCTION(BlueprintCallable) TakeHit", "Blueprint BP_Goblin : AEnemy", "BP adds mesh, sounds, OnHit effect"]
      },
      deep: {
        more: ["BlueprintNativeEvent is the middle ground: C++ provides a default (the _Implementation function) and a Blueprint may override it.",
          "Name Blueprint assets with a BP_ prefix (BP_Goblin), and keep C++ class names without it (AGoblin). Teams rely on these naming conventions to find things fast."],
        ex: { code: ue("Enemy", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"Enemy.generated.h\"\n\nUCLASS(Blueprintable)\nclass AEnemy : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = \"Stats\")\n    float Health = 100.f;\n\n    UFUNCTION(BlueprintCallable, Category = \"Combat\")\n    void TakeHit(float Damage);\n\n    UFUNCTION(BlueprintImplementableEvent, Category = \"Combat\")\n    void OnHitEffect();\n};",
          "#include \"Enemy.h\"\n\nvoid AEnemy::TakeHit(float Damage)\n{\n    Health = FMath::Clamp(Health - Damage, 0.f, 100.f);\n    OnHitEffect();\n    if (Health <= 0.f)\n    {\n        Destroy();\n    }\n}"),
          walk: ["Blueprintable lets designers make Blueprint children.", "Health is readable in Blueprints, editable in the Details panel.", "TakeHit can be called from Blueprint graphs.", "OnHitEffect has no C++ body — each Blueprint child draws its own effect."] },
        mistake: "Writing a body for a BlueprintImplementableEvent in the .cpp. It's implemented in Blueprints only; a C++ body causes a duplicate-definition error."
      } },
    { title: "Containers and Math", chapter: "TArray, TMap, TSet, FMath", line: "TArray<int32> Scores;",
      content: {
        story: ["Unreal has its own containers that the editor, Blueprints and saving understand. TArray<T> is an ordered, growable list: Add, Num, Remove, Contains, and [i] to reach an item.",
          "TMap<Key, Value> stores pairs looked up by key — scores by player name, prices by item. Find returns a pointer to the value, or nullptr if the key isn't there. TSet<T> keeps unique values for fast “is it in here?” checks.",
          "FMath holds the math: Clamp, Max, Min, Abs, RandRange (whole numbers, both ends included), FRandRange (decimals), Lerp, FInterpTo, RoundToInt and Sqrt."],
        big: "TArray lists, TMap looks up by key, TSet keeps unique values, and FMath does the sums.",
        caption: "A row of score boxes (TArray), a wall of named drawers (TMap) and a dice cup (FMath). Tap Play.",
        demo: ["TArray<int32> Scores; Scores.Add(10)", "Scores.Num() → 1", "TMap<FString, int32> Ages; Ages.Add(\"Ana\", 12)", "FMath::RandRange(1, 6) → a die roll"]
      },
      deep: {
        more: ["Range-based loops work on Unreal containers: for (int32 S : Scores), and for (const auto& Pair : Ages) with Pair.Key and Pair.Value.",
          "Removing items while looping forward skips elements; loop backwards (for (int32 i = Items.Num() - 1; i >= 0; --i)) or use RemoveAll with a test."],
        ex: { code: ue("Scoreboard", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"Scoreboard.generated.h\"\n\nUCLASS()\nclass AScoreboard : public AActor\n{\n    GENERATED_BODY()\n\nprotected:\n    virtual void BeginPlay() override;\n\nprivate:\n    TArray<int32> Scores;\n    TMap<FString, int32> Best;\n};",
          "#include \"Scoreboard.h\"\n\nvoid AScoreboard::BeginPlay()\n{\n    Super::BeginPlay();\n    Scores.Add(40);\n    Scores.Add(75);\n    Scores.Add(60);\n    int32 Total = 0;\n    for (int32 S : Scores)\n    {\n        Total += S;\n    }\n    Best.Add(TEXT(\"Ana\"), 75);\n    if (int32* AnaBest = Best.Find(TEXT(\"Ana\")))\n    {\n        UE_LOG(LogTemp, Display, TEXT(\"%d scores, total %d, Ana's best %d\"), Scores.Num(), Total, *AnaBest);\n    }\n}"),
          walk: ["A TArray of scores and a TMap of best scores by name.", "Add three scores and total them with a range loop.", "Find returns a pointer — check it before reading the value with *.", "Logs: 3 scores, total 175, Ana's best 75."] },
        mistake: "Reading an index that doesn't exist: Scores[5] in a three-item TArray crashes the game with an out-of-bounds check. Use IsValidIndex(5) or Num() first."
      } },
    { title: "Pointers and Safety", chapter: "UObject pointers, garbage collection, IsValid, nullptr", line: "if (IsValid(Target)) { Target->Destroy(); }",
      content: {
        story: ["Unreal objects (UObjects and Actors) are created and destroyed by the engine, which cleans up unused ones with a garbage collector. Your C++ refers to them with pointers like AActor* or UStaticMeshComponent*.",
          "A UObject pointer stored as a member should be a UPROPERTY (in Unreal Engine 5, often written TObjectPtr<AActor>). That tells the garbage collector you're using the object and lets it set the pointer to null if the object is destroyed.",
          "Before using a pointer, check it: if (Target) catches nullptr, and IsValid(Target) also catches objects that are being destroyed. Most Unreal crashes are a pointer used without a check."],
        big: "Store Unreal object pointers as UPROPERTYs and check them with IsValid before use — unchecked pointers cause most crashes.",
        caption: "A pointer reaches for an Actor that has already been destroyed — and IsValid catches it in time. Tap Play.",
        demo: ["UPROPERTY() AActor* Target;", "Target destroyed elsewhere", "IsValid(Target) → false", "skip it — no crash"]
      },
      deep: {
        more: ["Never use new and delete for UObjects. Create Actors with SpawnActor, components with CreateDefaultSubobject (or NewObject at runtime), and let the engine destroy them.",
          "check(Condition) stops the game immediately in development builds when something that must be true isn't; ensure(Condition) logs and continues. They catch bugs early, close to their cause."],
        ex: { code: ue("Follower", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"Follower.generated.h\"\n\nUCLASS()\nclass AFollower : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    AFollower();\n    virtual void Tick(float DeltaTime) override;\n\n    UPROPERTY(EditAnywhere)\n    TObjectPtr<AActor> Leader;\n\n    UPROPERTY(EditAnywhere)\n    float Speed = 300.f;\n};",
          "#include \"Follower.h\"\n\nAFollower::AFollower()\n{\n    PrimaryActorTick.bCanEverTick = true;\n}\n\nvoid AFollower::Tick(float DeltaTime)\n{\n    Super::Tick(DeltaTime);\n    if (!IsValid(Leader))\n    {\n        return;\n    }\n    FVector Dir = (Leader->GetActorLocation() - GetActorLocation()).GetSafeNormal();\n    AddActorWorldOffset(Dir * Speed * DeltaTime);\n}"),
          walk: ["Leader is a TObjectPtr UPROPERTY: visible to the garbage collector.", "Tick returns early if there's no valid leader.", "Otherwise, step toward the leader at Speed centimeters per second."] },
        mistake: "Keeping a raw AActor* member without UPROPERTY. When that Actor is destroyed, the pointer still points at the old memory, and using it crashes — sometimes much later."
      } },
    { title: "UI with UMG", chapter: "Widget Blueprints, UUserWidget, TextBlock, AddToViewport", line: "Widget->AddToViewport();",
      content: {
        story: ["Unreal's UI system is UMG (Unreal Motion Graphics). You design screens in a Widget Blueprint: drag in text, buttons, progress bars and images, and arrange them visually.",
          "From C++, CreateWidget<UUserWidget>(GetWorld(), WidgetClass) builds the widget and AddToViewport() puts it on screen. A common pattern is a C++ widget class with UPROPERTY(meta = (BindWidget)) pointers to the text blocks designed in the Blueprint.",
          "Update UI when values change: ScoreText->SetText(FText::AsNumber(Score)), HealthBar->SetPercent(Health / 100.f). FText is the right type for anything the player reads, because it can be translated."],
        big: "Design screens in Widget Blueprints, create them with CreateWidget and AddToViewport, and update them with SetText and SetPercent.",
        caption: "A health bar and a score appear over the game and update as the hero is hit. Tap Play.",
        demo: ["WBP_HUD: ScoreText + HealthBar", "CreateWidget → AddToViewport", "ScoreText->SetText(…)", "HealthBar->SetPercent(0.6)"]
      },
      deep: {
        more: ["BindWidget connects a C++ pointer to a widget by NAME: the text block in the Blueprint must be named exactly like the C++ variable, or the Blueprint won't compile.",
          "For many UI changes, events beat polling: have the player broadcast OnHealthChanged, and let the widget update only then."],
        ex: { code: ue("Hud", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"Blueprint/UserWidget.h\"\n#include \"Components/TextBlock.h\"\n#include \"Components/ProgressBar.h\"\n#include \"Hud.generated.h\"\n\nUCLASS()\nclass UHud : public UUserWidget\n{\n    GENERATED_BODY()\n\npublic:\n    UPROPERTY(meta = (BindWidget))\n    UTextBlock* ScoreText;\n\n    UPROPERTY(meta = (BindWidget))\n    UProgressBar* HealthBar;\n\n    void ShowScore(int32 Score);\n    void ShowHealth(float Health);\n};",
          "#include \"Hud.h\"\n\nvoid UHud::ShowScore(int32 Score)\n{\n    ScoreText->SetText(FText::AsNumber(Score));\n}\n\nvoid UHud::ShowHealth(float Health)\n{\n    HealthBar->SetPercent(Health / 100.f);\n}"),
          walk: ["A C++ widget class with two BindWidget pointers.", "The Widget Blueprint must contain a TextBlock named ScoreText and a ProgressBar named HealthBar.", "ShowScore sets the number; ShowHealth sets the bar from 0 to 1."] },
        mistake: "Creating the same widget again every time a value changes. Create it once (in BeginPlay), keep the pointer, and only update its contents."
      } },
    { title: "Levels, Game Modes and Saving", chapter: "OpenLevel, GameModeBase, GameInstance, SaveGame", line: 'UGameplayStatics::OpenLevel(this, FName("Level2"));',
      content: {
        story: ["Levels are separate maps. UGameplayStatics::OpenLevel(this, FName(\"Level2\")) travels to another one, and everything in the old level is destroyed. The Game Mode of each level decides its rules.",
          "To keep data between levels — the player's score, settings — use a Game Instance class: one object that lives for the whole time the game is running, from start to quit.",
          "To keep data between play sessions, make a USaveGame subclass with UPROPERTY fields, then UGameplayStatics::SaveGameToSlot to write it and LoadGameFromSlot to read it back."],
        big: "OpenLevel changes maps, the Game Instance survives level changes, and SaveGame objects survive quitting.",
        caption: "The hero reaches the portal, the next map loads, and the score travels along in the Game Instance. Tap Play.",
        demo: ["portal overlap → OpenLevel(\"Level2\")", "old level's Actors destroyed", "GameInstance keeps Score = 120", "SaveGameToSlot(\"Slot1\")"]
      },
      deep: {
        more: ["Levels can also stream: big worlds load nearby pieces in the background with Level Streaming or World Partition, instead of one giant load screen.",
          "Set your project's starting level and default Game Mode in Project Settings → Maps & Modes; each level can override the Game Mode in World Settings."],
        ex: { code: ue("Portal", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"Portal.generated.h\"\n\nUCLASS()\nclass APortal : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    UPROPERTY(EditAnywhere)\n    FName NextLevel = TEXT(\"Level2\");\n\n    virtual void NotifyActorBeginOverlap(AActor* OtherActor) override;\n};",
          "#include \"Portal.h\"\n#include \"Kismet/GameplayStatics.h\"\n\nvoid APortal::NotifyActorBeginOverlap(AActor* OtherActor)\n{\n    Super::NotifyActorBeginOverlap(OtherActor);\n    if (OtherActor && OtherActor->ActorHasTag(TEXT(\"Player\")))\n    {\n        UGameplayStatics::OpenLevel(this, NextLevel);\n    }\n}"),
          walk: ["The next level's name is editable per portal.", "NotifyActorBeginOverlap is an Actor-level overlap event — no binding needed.", "Only the player travels; OpenLevel loads the next map."] },
        mistake: "Storing the score on the player Character and expecting it in the next level. The Character is destroyed with the old level; keep lasting data in the Game Instance."
      } },
    { title: "Packaging and Performance", chapter: "Packaging, platforms, stat commands, Unreal Insights", line: "SetActorTickEnabled(false);",
      content: {
        story: ["Packaging turns your project into a game players can install. Choose Platforms → Windows (or Android, iOS, Linux…) → Package Project. The first package takes a while because shaders and content are cooked for the platform.",
          "Performance matters on every platform. Console commands show what's happening: stat fps for frame rate, stat unit for where time goes (Game, Draw, GPU). Unreal Insights records a detailed timeline of every frame.",
          "Easy wins: switch off Tick on Actors that don't need it, use timers instead of counting in Tick, keep collision simple, and test on the weakest device you want to support."],
        big: "Package for each platform, measure with stat commands and Unreal Insights, and switch off work you don't need — especially Tick.",
        caption: "One project, packaged for PC, console and phone, with a frame-time graph checking each. Tap Play.",
        demo: ["Platforms → Windows → Package", "stat fps → 120", "stat unit → Game 4 ms, GPU 7 ms", "Tick off on 500 props → faster"]
      },
      deep: {
        more: ["Development and Shipping builds differ: Development keeps logging and console commands for testing; Shipping strips them for speed and safety.",
          "Use #if WITH_EDITOR for code that should only exist in the editor, and UE_BUILD_SHIPPING checks to keep debug helpers out of the final game."],
        ex: { code: ue("Prop", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"Prop.generated.h\"\n\nUCLASS()\nclass AProp : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    AProp();\n};",
          "#include \"Prop.h\"\n\nAProp::AProp()\n{\n    PrimaryActorTick.bCanEverTick = false;\n}"),
          walk: ["A decorative prop that never needs to update.", "bCanEverTick = false means it costs nothing per frame — multiply that by hundreds of props."] },
        mistake: "Leaving Tick on everywhere by default. New C++ Actors from the editor's template turn Tick on; switch it off unless the Actor truly needs it."
      } }
  ];

  var shelves = [
    { title: "The Actor Lifecycle", chapter: "Beyond the basics · Unreal shelf", line: ["Constructor → BeginPlay → Tick", "EndPlay → Destroyed"],
      content: {
        story: ["An Actor's life has a fixed order. The constructor runs first — even in the editor, before play — so it's only for setting defaults and creating components. PostInitializeComponents runs once the components exist.",
          "BeginPlay runs when play starts (or when the Actor is spawned during play): the right place for gameplay setup, binding events and starting timers. Tick then runs every frame, if it's switched on.",
          "EndPlay runs when the Actor is destroyed, the level changes or the game ends: the place to clear timers and unbind events."],
        big: "Constructor for defaults and components, BeginPlay for gameplay setup, Tick every frame, EndPlay for cleanup.",
        caption: "A timeline: built in the editor, wakes at play, ticks along, tidies up at the end. Tap Play.",
        demo: ["Constructor: defaults, components", "BeginPlay: bind events, start timers", "Tick: every frame (if on)", "EndPlay: clear timers"]
      },
      deep: {
        more: ["The constructor also runs for the class default object, a template copy Unreal keeps for every class. That's why constructors must never touch the world, spawn Actors or start gameplay.",
          "Components have a similar lifecycle: OnRegister, BeginPlay, TickComponent and EndPlay."],
        ex: { code: ue("LifecycleLogger", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"LifecycleLogger.generated.h\"\n\nUCLASS()\nclass ALifecycleLogger : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    ALifecycleLogger();\n\nprotected:\n    virtual void BeginPlay() override;\n    virtual void EndPlay(const EEndPlayReason::Type Reason) override;\n};",
          "#include \"LifecycleLogger.h\"\n\nALifecycleLogger::ALifecycleLogger()\n{\n    PrimaryActorTick.bCanEverTick = false;\n}\n\nvoid ALifecycleLogger::BeginPlay()\n{\n    Super::BeginPlay();\n    UE_LOG(LogTemp, Display, TEXT(\"BeginPlay\"));\n}\n\nvoid ALifecycleLogger::EndPlay(const EEndPlayReason::Type Reason)\n{\n    UE_LOG(LogTemp, Display, TEXT(\"EndPlay\"));\n    Super::EndPlay(Reason);\n}"),
          walk: ["The constructor only sets a default.", "BeginPlay logs when play starts.", "EndPlay logs when the Actor goes away — then calls the parent's EndPlay."] },
        mistake: "Spawning Actors or reading other Actors in the constructor. The world doesn't exist yet when constructors run in the editor; do it in BeginPlay."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · Unreal shelf", line: ["UE_LOG(LogTemp, Error, TEXT(\"%s\"), *Why);", "if (!ensure(Mesh)) return;"],
      content: {
        story: ["Start with the Output Log (Window → Output Log): filter by category or search for Error and Warning. Red and yellow lines usually point straight at the problem.",
          "Crashes show a call stack: the list of functions that were running. Your own function names near the top are where to look. Most crashes are a null or destroyed pointer — check pointers with if (Ptr) or IsValid(Ptr).",
          "Other classics: a UFUNCTION missing on an AddDynamic target, a forgotten Super:: call, a generated.h include not last, a Details-panel value overriding your code, and Live Coding leaving the editor out of date — close it and rebuild."],
        big: "Read the Output Log, follow the call stack to your code, check pointers, and rebuild cleanly when things look haunted.",
        caption: "A detective walks a crash's call stack down to one unchecked pointer. Tap Play.",
        demo: ["Unhandled Exception: EXCEPTION_ACCESS_VIOLATION", "  ADoor::OnOverlap() Door.cpp:31", "line 31: Hero->Health …", "Hero was nullptr → add a check"]
      },
      deep: {
        more: ["Attach your IDE's debugger to the editor (Debug → Attach to Process, or run from the IDE) to pause on breakpoints and inspect variables while playing.",
          "Visual Logger (Window → Visual Logger) records what AI and gameplay did over time, so you can scrub back to the moment something went wrong."],
        ex: { code: ue("SafeTurret", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"SafeTurret.generated.h\"\n\nUCLASS()\nclass ASafeTurret : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    UPROPERTY(EditAnywhere)\n    TSubclassOf<AActor> ShotClass;\n\nprotected:\n    virtual void BeginPlay() override;\n};",
          "#include \"SafeTurret.h\"\n\nvoid ASafeTurret::BeginPlay()\n{\n    Super::BeginPlay();\n    if (!ShotClass)\n    {\n        UE_LOG(LogTemp, Error, TEXT(\"%s has no ShotClass set!\"), *GetName());\n        SetActorTickEnabled(false);\n        return;\n    }\n}"),
          walk: ["Check the class slot before ever using it.", "Log a clear red error naming this Actor.", "Switch off Tick so it doesn't fail every frame."] },
        mistake: "Ignoring warnings because the game still runs. Today's yellow warning about a missing asset is tomorrow's crash on a player's machine."
      } },
    { title: "Unreal Coding Conventions", chapter: "Beyond the basics · Unreal shelf", line: ["bool bIsAlive = true;", "class UHealthComponent : public UActorComponent"],
      content: {
        story: ["Epic's coding standard keeps Unreal projects readable. Types get prefixes (A, U, F, E, T, I, S for Slate widgets). Everything is PascalCase: classes, functions, variables. Booleans start with b: bIsDead, bCanFire.",
          "Prefer int32/uint8 over int/char, TArray/TMap over std containers, and FString over std::string when talking to the engine. Put member declarations in the header and code in the .cpp.",
          "Asset names follow prefixes too: BP_ for Blueprints, WBP_ for widgets, SM_ for static meshes, M_ for materials, T_ for textures, IA_ for Input Actions. Consistent names make big projects searchable."],
        big: "Prefixes on types and assets, PascalCase everywhere, b for bools, and Unreal's own types — the team will thank you.",
        caption: "A tidy shelf where every label follows the same pattern: BP_, SM_, M_, IA_. Tap Play.",
        demo: ["class UHealthComponent", "bool bIsAlive", "BP_Goblin, SM_Rock, IA_Jump", "int32 not int"]
      },
      deep: {
        more: ["Use const and references for things you don't change: void Heal(const FString& Reason). Pass small structs like FVector by const reference too.",
          "Forward declare classes in headers (class UBoxComponent;) and include their headers in the .cpp. It keeps compile times down in large projects."],
        ex: { code: ue("HealthComponent", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"Components/ActorComponent.h\"\n#include \"HealthComponent.generated.h\"\n\nUCLASS(ClassGroup = (Custom), meta = (BlueprintSpawnableComponent))\nclass UHealthComponent : public UActorComponent\n{\n    GENERATED_BODY()\n\npublic:\n    UPROPERTY(EditAnywhere, Category = \"Health\")\n    float MaxHealth = 100.f;\n\n    UFUNCTION(BlueprintCallable, Category = \"Health\")\n    void ApplyDamage(float Amount);\n\n    bool IsDead() const { return bIsDead; }\n\nprivate:\n    float Health = 100.f;\n    bool bIsDead = false;\n};",
          "#include \"HealthComponent.h\"\n\nvoid UHealthComponent::ApplyDamage(float Amount)\n{\n    if (bIsDead) return;\n    Health = FMath::Clamp(Health - Amount, 0.f, MaxHealth);\n    bIsDead = Health <= 0.f;\n}"),
          walk: ["A reusable component: U prefix, PascalCase, b for the bool.", "BlueprintSpawnableComponent lets designers add it to any Actor.", "ApplyDamage clamps and updates bIsDead; IsDead is a const getter."] },
        mistake: "Mixing styles — some snake_case, some camelCase, std::vector here and TArray there. Code that looks consistent is easier to trust and to review."
      } },
    { title: "Gameplay Recipes", chapter: "Beyond the basics · Unreal shelf", line: ["FMath::FInterpTo(Current, Target, DeltaTime, 5.f)", "UGameplayStatics::GetPlayerPawn(this, 0)"],
      content: {
        story: ["Most games reuse the same handful of pieces: a pickup that adds to a score, a door that slides open, an enemy that chases the player, a health system that ends the game. Each is a few dozen lines in Unreal.",
          "A sliding door eases its location toward an open position with FMath::VInterpTo each Tick. A chaser asks UGameplayStatics::GetPlayerPawn for the player and steps toward them. A rotating pickup spins in Tick and destroys itself on overlap.",
          "Combine recipes with components: a Health component on both the player and enemies, a Pickup Actor used for coins, keys and potions with different settings."],
        big: "Pickups, doors, chasers and health are small recipes — build them as reusable Actors and components.",
        caption: "A coin spins, a door glides open and a slime chases the hero, all from short recipes. Tap Play.",
        demo: ["Door: VInterpTo(open spot)", "Chaser: GetPlayerPawn → step closer", "Coin: spin, overlap → +10", "Health: clamp, die at 0"]
      },
      deep: {
        more: ["FInterpTo eases out — fast at first, slowing near the target. FInterpConstantTo moves at a steady speed. Pick by feel.",
          "AI that only needs “walk toward the player” can start this simply; bigger AI uses Behavior Trees and the Navigation System to find paths around obstacles."],
        ex: { code: ue("SlidingDoor", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"SlidingDoor.generated.h\"\n\nUCLASS()\nclass ASlidingDoor : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    ASlidingDoor();\n    virtual void Tick(float DeltaTime) override;\n\n    UPROPERTY(EditAnywhere)\n    FVector OpenOffset = FVector(0.f, 0.f, 300.f);\n\n    UPROPERTY(EditAnywhere)\n    bool bOpen = false;\n\nprotected:\n    virtual void BeginPlay() override;\n\nprivate:\n    FVector ClosedSpot;\n};",
          "#include \"SlidingDoor.h\"\n\nASlidingDoor::ASlidingDoor()\n{\n    PrimaryActorTick.bCanEverTick = true;\n}\n\nvoid ASlidingDoor::BeginPlay()\n{\n    Super::BeginPlay();\n    ClosedSpot = GetActorLocation();\n}\n\nvoid ASlidingDoor::Tick(float DeltaTime)\n{\n    Super::Tick(DeltaTime);\n    FVector Goal = bOpen ? ClosedSpot + OpenOffset : ClosedSpot;\n    SetActorLocation(FMath::VInterpTo(GetActorLocation(), Goal, DeltaTime, 4.f));\n}"),
          walk: ["Where the door goes when open, editable per door.", "BeginPlay remembers the closed position.", "Each Tick eases toward open or closed, depending on bOpen."] },
        mistake: "Calling GetPlayerPawn every frame in many Actors. Cache the pointer in BeginPlay (and check it with IsValid before use)."
      } },
    { title: "Performance Habits", chapter: "Beyond the basics · Unreal shelf", line: ["stat unit", "PrimaryActorTick.TickInterval = 0.2f;"],
      content: {
        story: ["Measure before you optimize. stat fps and stat unit (typed in the console with the ~ key) show frame rate and whether the game thread, drawing or GPU is the slow part. Unreal Insights records detailed timelines.",
          "Common game-thread fixes: switch off Tick where it isn't needed, tick less often with PrimaryActorTick.TickInterval, replace polling with timers and events, and avoid searching for Actors every frame.",
          "Common rendering fixes: fewer, simpler materials, Level of Detail meshes, sensible shadow settings, and Nanite and virtual textures where they fit your platform."],
        big: "Measure with stat unit and Insights, then cut wasted Ticks, searches and heavy assets.",
        caption: "A frame-time bar shrinks as idle Ticks are switched off. Tap Play.",
        demo: ["stat unit → Game 14 ms (slow!)", "500 props ticking for nothing", "bCanEverTick = false", "Game 5 ms"]
      },
      deep: {
        more: ["TickInterval lets an Actor think a few times a second instead of every frame — plenty for an enemy deciding whether to chase.",
          "Significance and LOD systems let far-away Actors do less work, so crowds and big worlds stay fast."],
        ex: { code: ue("LazyThinker", "#pragma once\n\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"LazyThinker.generated.h\"\n\nUCLASS()\nclass ALazyThinker : public AActor\n{\n    GENERATED_BODY()\n\npublic:\n    ALazyThinker();\n    virtual void Tick(float DeltaTime) override;\n\nprivate:\n    int32 Thoughts = 0;\n};",
          "#include \"LazyThinker.h\"\n\nALazyThinker::ALazyThinker()\n{\n    PrimaryActorTick.bCanEverTick = true;\n    PrimaryActorTick.TickInterval = 0.2f;\n}\n\nvoid ALazyThinker::Tick(float DeltaTime)\n{\n    Super::Tick(DeltaTime);\n    Thoughts++;\n}"),
          walk: ["Tick is on, but only five times a second.", "DeltaTime is then about 0.2 seconds, so per-second math still works."] },
        mistake: "Guessing where the slowness is. Hours spent speeding up code that wasn't slow help no one; stat unit and Insights show the truth in seconds."
      } }
  ];

  var glossary = [
    ["Actor", "Anything placed or spawned in a level; classes start with A."],
    ["ActorComponent", "A reusable piece of behavior attached to an Actor."],
    ["AddDynamic", "Connects a dynamic delegate (like an overlap event) to a UFUNCTION."],
    ["AI Controller", "A Controller that drives a Pawn with computer logic."],
    ["Asset", "Any file in the Content Browser: meshes, materials, sounds, Blueprints."],
    ["BeginPlay", "Runs when play starts or the Actor is spawned."],
    ["Blueprint", "Unreal's visual scripting: nodes joined by wires."],
    ["BlueprintCallable", "Lets Blueprints call a C++ function."],
    ["BlueprintImplementableEvent", "A function declared in C++ but implemented in Blueprints."],
    ["BlueprintReadWrite", "Lets Blueprints read and change a property."],
    ["Cast", "Checks if an object is a given class; returns nullptr if not."],
    ["Character", "A Pawn that walks, with a capsule and CharacterMovementComponent."],
    ["CharacterMovementComponent", "Built-in walking, jumping, falling and swimming."],
    ["Collision preset", "A component's rule for blocking, overlapping or ignoring others."],
    ["Component", "A building block of an Actor: mesh, collision, light, sound…"],
    ["Content Browser", "The panel holding the project's assets."],
    ["Controller", "Possesses a Pawn and gives it commands."],
    ["CreateDefaultSubobject", "Creates a component in an Actor's constructor."],
    ["DeltaTime", "Seconds since the last frame; scale movement by it."],
    ["Details panel", "Shows and edits the selected Actor's properties."],
    ["Destroy", "Removes an Actor from the level."],
    ["EditAnywhere", "UPROPERTY specifier: editable in the Details panel everywhere."],
    ["Enhanced Input", "UE5's input system of Input Actions and Mapping Contexts."],
    ["EndPlay", "Runs when an Actor leaves play: destroyed, level change or quit."],
    ["FName", "A fast, unchangeable name used for tags, sockets and levels."],
    ["FMath", "Unreal's math toolbox: Clamp, Lerp, RandRange, InterpTo…"],
    ["FRotator", "A rotation as Pitch, Yaw and Roll in degrees."],
    ["FString", "Unreal's everyday changeable text type."],
    ["FText", "Text the player reads, ready for translation."],
    ["FTimerHandle", "Remembers a timer so it can be checked or cleared."],
    ["FVector", "Three numbers X, Y, Z: a position or direction (Z is up)."],
    ["Game Instance", "One object that lives for the whole game session, across levels."],
    ["Game Mode", "Sets the rules of a level, like the default Pawn."],
    ["Garbage collection", "Unreal deleting UObjects nothing refers to anymore."],
    ["GENERATED_BODY", "The macro every Unreal class needs as its first line."],
    ["generated.h", "The header Unreal's tools write for each class; included last."],
    ["GEngine", "The global engine object, used for on-screen debug messages."],
    ["GetWorld", "Returns the level an Actor lives in."],
    ["Input Action", "An asset naming something the player can do, like IA_Jump."],
    ["Input Mapping Context", "Maps keys and buttons to Input Actions."],
    ["int32", "Unreal's 32-bit whole number type."],
    ["IsValid", "Checks a pointer is non-null and not being destroyed."],
    ["Level", "A map: one world of Actors, loaded and played."],
    ["Live Coding", "Recompiling C++ while the editor stays open (Ctrl+Alt+F11)."],
    ["LogTemp", "A ready-made log category for UE_LOG."],
    ["Material", "Describes how a surface looks."],
    ["Mesh", "A 3D model; static meshes don't bend, skeletal meshes animate."],
    ["Nanite", "UE5's virtualized geometry for very detailed meshes."],
    ["Lumen", "UE5's dynamic global illumination and reflections."],
    ["Output Log", "The window showing UE_LOG messages, warnings and errors."],
    ["Overlap", "Two components passing through each other and noticing."],
    ["Packaging", "Building the project into an installable game."],
    ["Pawn", "An Actor that can be possessed and controlled."],
    ["PIE", "Play In Editor: testing the game inside the editor."],
    ["PlayerController", "The Controller that turns player input into Pawn commands."],
    ["Possess", "A Controller taking control of a Pawn."],
    ["PrimaryActorTick", "An Actor's tick settings, like bCanEverTick and TickInterval."],
    ["Reflection", "Unreal's system that lets the engine see your classes and properties."],
    ["RootComponent", "The component that holds an Actor's place in the world."],
    ["SaveGame", "A class whose UPROPERTYs can be saved to a slot on disk."],
    ["SetTimer", "Schedules a function to run later or repeatedly."],
    ["SpawnActor", "Creates a new Actor in the level during play."],
    ["Static Mesh Component", "A component that draws a non-animated 3D model."],
    ["Super", "The parent class; Super::BeginPlay() runs the parent's version."],
    ["TArray", "Unreal's growable list container."],
    ["TEXT()", "Wraps a text literal in Unreal's character format."],
    ["Tick", "Runs every frame on Actors that have it switched on."],
    ["TMap", "Unreal's key-value container."],
    ["TObjectPtr", "UE5's pointer type for UObject member properties."],
    ["TSet", "Unreal's container of unique values."],
    ["TSubclassOf", "A property that holds a class to spawn, chosen in the editor."],
    ["UCLASS", "The macro marking a class for Unreal's reflection."],
    ["UE_LOG", "Writes a line to the Output Log."],
    ["UFUNCTION", "The macro marking a function for Unreal (Blueprints, events, timers)."],
    ["UMG", "Unreal Motion Graphics: the UI system and Widget Blueprints."],
    ["UObject", "The base of all Unreal objects; classes start with U."],
    ["UPROPERTY", "The macro marking a variable for the editor, Blueprints and GC."],
    ["Viewport", "The 3D window where you see and arrange the level."],
    ["Widget Blueprint", "A visual UI screen made with UMG."],
    ["World Partition", "UE5's system for streaming big open worlds in pieces."]
  ];

  var field = [
    { name: "UE_LOG", head: "CoreMinimal.h", what: "Writes to the Output Log with a category and verbosity.", ex: "UE_LOG(LogTemp, Warning, TEXT(\"%d\"), Ammo);" },
    { name: "FString::Printf", head: "CoreMinimal.h", what: "Builds text with %d, %f and %s placeholders.", ex: "FString::Printf(TEXT(\"%.1f m\"), Dist)" },
    { name: "FVector", head: "CoreMinimal.h", what: "Positions and directions; Dist, GetSafeNormal, UpVector.", ex: "FVector::Dist(A, B)" },
    { name: "FRotator", head: "CoreMinimal.h", what: "Pitch, Yaw, Roll in degrees.", ex: "FRotator(0.f, 90.f, 0.f)" },
    { name: "FMath", head: "CoreMinimal.h", what: "Clamp, RandRange, Lerp, FInterpTo, RoundToInt.", ex: "FMath::RandRange(1, 6)" },
    { name: "TArray", head: "CoreMinimal.h", what: "A growable list: Add, Num, Remove, Contains.", ex: "Enemies.Add(NewEnemy);" },
    { name: "TMap", head: "CoreMinimal.h", what: "Key-value pairs with Add, Find and Contains.", ex: "if (int32* Gold = Purse.Find(TEXT(\"Ana\"))) { }" },
    { name: "GetWorldTimerManager", head: "TimerManager.h", what: "Schedules, loops and clears timers.", ex: "GetWorldTimerManager().ClearTimer(Handle);" },
    { name: "SpawnActor", head: "Engine/World.h", what: "Creates Actors during play.", ex: "GetWorld()->SpawnActor<AActor>(Cls, Loc, Rot);" },
    { name: "UGameplayStatics", head: "Kismet/GameplayStatics.h", what: "Player lookups, sounds, level changes, saving.", ex: "UGameplayStatics::GetPlayerPawn(this, 0)" },
    { name: "Cast", head: "CoreMinimal.h", what: "Safely checks and converts an object's class.", ex: "if (AHero* H = Cast<AHero>(Other)) { }" },
    { name: "CreateDefaultSubobject", head: "constructor only", what: "Adds a component to an Actor while it's being built.", ex: "Box = CreateDefaultSubobject<UBoxComponent>(TEXT(\"Box\"));" },
    { name: "UEnhancedInputComponent", head: "EnhancedInputComponent.h", what: "Binds Input Actions to functions.", ex: "Input->BindAction(Jump, ETriggerEvent::Started, this, &AHero::Jump);" },
    { name: "GEngine->AddOnScreenDebugMessage", head: "Engine/Engine.h", what: "Quick debug text on the game screen.", ex: "GEngine->AddOnScreenDebugMessage(-1, 2.f, FColor::Red, TEXT(\"Hit\"));" }
  ];

  var cheats = [
    { title: "Actor Header Card", body: "The shape of every Actor header.", code: "#pragma once\n#include \"CoreMinimal.h\"\n#include \"GameFramework/Actor.h\"\n#include \"MyActor.generated.h\"\n\nUCLASS()\nclass AMyActor : public AActor\n{\n    GENERATED_BODY()\npublic:\n    AMyActor();\n    virtual void Tick(float DeltaTime) override;\nprotected:\n    virtual void BeginPlay() override;\n};" },
    { title: "Actor Source Card", body: "The matching .cpp.", code: "#include \"MyActor.h\"\n\nAMyActor::AMyActor()\n{\n    PrimaryActorTick.bCanEverTick = true;\n}\n\nvoid AMyActor::BeginPlay()\n{\n    Super::BeginPlay();\n}\n\nvoid AMyActor::Tick(float DeltaTime)\n{\n    Super::Tick(DeltaTime);\n}" },
    { title: "Properties Card", body: "Who can see and change what.", code: "UPROPERTY(EditAnywhere, Category = \"Stats\")\nfloat Health = 100.f;\nUPROPERTY(VisibleAnywhere)\nUStaticMeshComponent* Mesh;\nUPROPERTY(EditAnywhere, BlueprintReadWrite)\nint32 Coins = 0;" },
    { title: "Moving Card", body: "Location and rotation, per second.", code: "AddActorWorldOffset(FVector(0.f, 0.f, Speed * DeltaTime));\nAddActorLocalRotation(FRotator(0.f, 90.f * DeltaTime, 0.f));\nSetActorLocation(FVector(0.f, 0.f, 100.f));" },
    { title: "Logging Card", body: "Seeing what your code does.", code: "UE_LOG(LogTemp, Log, TEXT(\"plain\"));\nUE_LOG(LogTemp, Warning, TEXT(\"%d coins\"), Coins);\nUE_LOG(LogTemp, Error, TEXT(\"%s\"), *Name);\nGEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Green, TEXT(\"Hi\"));" },
    { title: "Overlap Card", body: "Noticing who walked in.", code: "Box->OnComponentBeginOverlap.AddDynamic(this, &AMyActor::OnOverlap);\n\nUFUNCTION()\nvoid OnOverlap(UPrimitiveComponent* Comp, AActor* Other,\n    UPrimitiveComponent* OtherComp, int32 Index,\n    bool bSweep, const FHitResult& Hit);" },
    { title: "Spawn & Timer Card", body: "Making things and scheduling them.", code: "UPROPERTY(EditAnywhere) TSubclassOf<AActor> ShotClass;\nAActor* Shot = GetWorld()->SpawnActor<AActor>(ShotClass, Loc, Rot);\nShot->SetLifeSpan(3.f);\nGetWorldTimerManager().SetTimer(Handle, this, &AMyActor::Fire, 1.f, true);" },
    { title: "Containers Card", body: "Lists, maps and math.", code: "TArray<int32> Scores;\nScores.Add(10);\nScores.Num();\nTMap<FString, int32> Gold;\nGold.Add(TEXT(\"Ana\"), 50);\nint32 Roll = FMath::RandRange(1, 6);" }
  ];

  /* printf-style fixed decimals the way C prints them: exact ties go to
     the even digit (1.25 → "1.2" with %.1f). */
  function fixedC(x, d) {
    var s = x * Math.pow(10, d);
    if (Number.isInteger(s * 2) && !Number.isInteger(s)) { var n = Math.floor(s); if (n % 2 !== 0) n += 1; return (n / Math.pow(10, d)).toFixed(d); }
    return x.toFixed(d);
  }
  function normYaw(a) { a = a % 360; if (a > 180) a -= 360; else if (a <= -180) a += 360; return a; }
  function roundUE(a) { return Math.floor(a + 0.5); }
  function H(name, parent, includes, decls) { return ["// " + name + ".h", "#pragma once", "", "#include \"CoreMinimal.h\"", "#include \"" + (parent === "AActor" ? "GameFramework/Actor.h" : parent) + "\""].concat(includes || [], ["#include \"" + name + ".generated.h\"", "", "UCLASS()", "class A" + name + " : public AActor", "{", "    GENERATED_BODY()", ""], decls, ["};", ""]); }
  function C(name, body) { return ["// " + name + ".cpp", "#include \"" + name + ".h\"", ""].concat(body); }
  var projects = [
    { name: "Hello, Unreal", file: "HelloActor.h", about: "BeginPlay says hello once, then Tick counts the first few frames.",
      vars: [{ key: "FramesToCount", label: "frames to count", val: 3, min: 1, max: 8 }],
      code: function (v) { return H("HelloActor", "AActor", [], ["public:", "    AHelloActor();", "    virtual void Tick(float DeltaTime) override;", "", "    UPROPERTY(EditAnywhere)", "    int32 FramesToCount = " + v.FramesToCount + ";", "", "protected:", "    virtual void BeginPlay() override;", "", "private:", "    int32 Frames = 0;"]).concat(C("HelloActor", ["AHelloActor::AHelloActor()", "{", "    PrimaryActorTick.bCanEverTick = true;", "}", "", "void AHelloActor::BeginPlay()", "{", "    Super::BeginPlay();", "    UE_LOG(LogTemp, Warning, TEXT(\"Hello from C++!\"));", "}", "", "void AHelloActor::Tick(float DeltaTime)", "{", "    Super::Tick(DeltaTime);", "    Frames++;", "    if (Frames <= FramesToCount)", "    {", "        UE_LOG(LogTemp, Display, TEXT(\"Frame %d\"), Frames);", "    }", "}"])); },
      run: function (v) { var o = ["LogTemp: Warning: Hello from C++!"]; for (var i = 1; i <= v.FramesToCount; i++) o.push("LogTemp: Display: Frame " + i); return o; },
      harness: function (v) { return "Spawn<AHelloActor>();\nRun(" + (v.FramesToCount + 3) + ", 0.5);"; },
      explain: "The constructor switches Tick on. BeginPlay logs a yellow Warning once; Tick counts frames and logs the first few as Display lines." },
    { name: "Spinning Coin", file: "SpinningCoin.h", about: "Tick turns the coin around Yaw. Unreal reports Yaw between -180 and 180. Each frame here lasts half a second.",
      vars: [{ key: "DegreesPerSecond", label: "degrees per second", val: 90, min: 10, max: 360 }],
      code: function (v) { return H("SpinningCoin", "AActor", [], ["public:", "    ASpinningCoin();", "    virtual void Tick(float DeltaTime) override;", "", "    UPROPERTY(EditAnywhere)", "    float DegreesPerSecond = " + v.DegreesPerSecond + ".f;"]).concat(C("SpinningCoin", ["ASpinningCoin::ASpinningCoin()", "{", "    PrimaryActorTick.bCanEverTick = true;", "}", "", "void ASpinningCoin::Tick(float DeltaTime)", "{", "    Super::Tick(DeltaTime);", "    AddActorLocalRotation(FRotator(0.f, DegreesPerSecond * DeltaTime, 0.f));", "    int32 Yaw = FMath::RoundToInt(GetActorRotation().Yaw);", "    UE_LOG(LogTemp, Display, TEXT(\"Yaw: %d\"), Yaw);", "}"])); },
      run: function (v) { var o = [], a = 0; for (var i = 0; i < 4; i++) { a += v.DegreesPerSecond * 0.5; o.push("LogTemp: Display: Yaw: " + roundUE(normYaw(a))); } return o; },
      harness: function () { return "Spawn<ASpinningCoin>();\nRun(4, 0.5);"; },
      explain: "FRotator(Pitch, Yaw, Roll): only Yaw changes, by speed × DeltaTime each frame. Past 180 degrees Unreal reports the angle as negative — 270 reads as -90." },
    { name: "Health and Damage", file: "Health.h", about: "Hits lower Health; FMath::Clamp keeps it between 0 and 100, and the loop stops at zero.",
      vars: [{ key: "Damage", val: 30, min: 5, max: 60 }, { key: "Hits", val: 4, min: 1, max: 6 }],
      code: function (v) { return H("Health", "AActor", [], ["public:", "    UPROPERTY(EditAnywhere)", "    float Damage = " + v.Damage + ".f;", "", "    UPROPERTY(EditAnywhere)", "    int32 Hits = " + v.Hits + ";", "", "protected:", "    virtual void BeginPlay() override;", "", "private:", "    float Health = 100.f;"]).concat(C("Health", ["void AHealth::BeginPlay()", "{", "    Super::BeginPlay();", "    for (int32 i = 1; i <= Hits; ++i)", "    {", "        Health = FMath::Clamp(Health - Damage, 0.f, 100.f);", "        UE_LOG(LogTemp, Display, TEXT(\"Hit %d: Health %.0f\"), i, Health);", "        if (Health <= 0.f)", "        {", "            UE_LOG(LogTemp, Warning, TEXT(\"Defeated\"));", "            break;", "        }", "    }", "}"])); },
      run: function (v) { var o = [], h = 100; for (var i = 1; i <= v.Hits; i++) { h = Math.max(0, Math.min(100, h - v.Damage)); o.push("LogTemp: Display: Hit " + i + ": Health " + fixedC(h, 0)); if (h <= 0) { o.push("LogTemp: Warning: Defeated"); break; } } return o; },
      harness: function () { return "Spawn<AHealth>();\nRun(1, 0.5);"; },
      explain: "%.0f prints a float with no decimals. Clamp means Health never goes below 0, and break leaves the loop the moment it hits 0." },
    { name: "Countdown Timer", file: "Countdown.h", about: "A looping timer calls Step once a second until the countdown reaches zero, then clears itself.",
      vars: [{ key: "Seconds", val: 3, min: 1, max: 9 }],
      code: function (v) { return H("Countdown", "AActor", ["#include \"TimerManager.h\""], ["public:", "    UPROPERTY(EditAnywhere)", "    int32 Seconds = " + v.Seconds + ";", "", "protected:", "    virtual void BeginPlay() override;", "", "private:", "    FTimerHandle Timer;", "    void Step();"]).concat(C("Countdown", ["void ACountdown::BeginPlay()", "{", "    Super::BeginPlay();", "    UE_LOG(LogTemp, Display, TEXT(\"%d...\"), Seconds);", "    GetWorldTimerManager().SetTimer(Timer, this, &ACountdown::Step, 1.0f, true);", "}", "", "void ACountdown::Step()", "{", "    Seconds--;", "    if (Seconds > 0)", "    {", "        UE_LOG(LogTemp, Display, TEXT(\"%d...\"), Seconds);", "    }", "    else", "    {", "        UE_LOG(LogTemp, Warning, TEXT(\"Go!\"));", "        GetWorldTimerManager().ClearTimer(Timer);", "    }", "}"])); },
      run: function (v) { var o = []; for (var s = v.Seconds; s > 0; s--) o.push("LogTemp: Display: " + s + "..."); o.push("LogTemp: Warning: Go!"); return o; },
      harness: function (v) { return "Spawn<ACountdown>();\nRun(" + (v.Seconds * 2 + 4) + ", 0.5);"; },
      explain: "SetTimer(…, 1.0f, true) calls Step every second. When the count reaches zero, ClearTimer stops the loop so Step never runs again." },
    { name: "Launch Pad", file: "LaunchPad.h", about: "An impulse changes speed by impulse ÷ mass: the same push launches a heavy crate slower than a light one.",
      vars: [{ key: "Impulse", val: 1000, min: 100, max: 5000 }, { key: "MassKg", label: "mass (kg)", val: 4, min: 1, max: 20 }],
      code: function (v) { return H("LaunchPad", "AActor", ["#include \"Components/StaticMeshComponent.h\""], ["public:", "    ALaunchPad();", "", "    UPROPERTY(VisibleAnywhere)", "    UStaticMeshComponent* Crate;", "", "    UPROPERTY(EditAnywhere)", "    float Impulse = " + v.Impulse + ".f;", "", "    UPROPERTY(EditAnywhere)", "    float MassKg = " + v.MassKg + ".f;", "", "protected:", "    virtual void BeginPlay() override;"]).concat(C("LaunchPad", ["ALaunchPad::ALaunchPad()", "{", "    Crate = CreateDefaultSubobject<UStaticMeshComponent>(TEXT(\"Crate\"));", "    RootComponent = Crate;", "    Crate->SetSimulatePhysics(true);", "}", "", "void ALaunchPad::BeginPlay()", "{", "    Super::BeginPlay();", "    Crate->SetMassOverrideInKg(NAME_None, MassKg);", "    Crate->AddImpulse(FVector(0.f, 0.f, Impulse));", "    float Up = Crate->GetPhysicsLinearVelocity().Z;", "    UE_LOG(LogTemp, Display, TEXT(\"Launch speed: %.1f cm/s\"), Up);", "}"])); },
      run: function (v) { return ["LogTemp: Display: Launch speed: " + fixedC(Math.fround(Math.fround(v.Impulse) / Math.fround(v.MassKg)), 1) + " cm/s"]; },
      harness: function () { return "Spawn<ALaunchPad>();\nRun(1, 0.5);"; },
      explain: "In the constructor the crate becomes the root and simulates physics. AddImpulse (without bVelChange) divides by mass, so doubling the mass halves the launch speed." },
    { name: "Coin Collector", file: "CoinCollector.h", about: "The player's sphere overlaps coins and a rock. Only Actors tagged Coin count, and each coin is destroyed.",
      vars: [{ key: "CoinValue", label: "coin value", val: 10, min: 1, max: 50 }, { key: "coins", label: "coins in the level", val: 3, min: 1, max: 6 }],
      code: function (v) { return H("CoinCollector", "AActor", ["#include \"Components/SphereComponent.h\""], ["public:", "    ACoinCollector();", "", "    UPROPERTY(VisibleAnywhere)", "    USphereComponent* Sphere;", "", "    UPROPERTY(EditAnywhere)", "    int32 CoinValue = " + v.CoinValue + ";", "", "protected:", "    virtual void BeginPlay() override;", "", "    UFUNCTION()", "    void OnOverlap(UPrimitiveComponent* OverlappedComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);", "", "private:", "    int32 Score = 0;"]).concat(C("CoinCollector", ["ACoinCollector::ACoinCollector()", "{", "    Sphere = CreateDefaultSubobject<USphereComponent>(TEXT(\"Sphere\"));", "    RootComponent = Sphere;", "}", "", "void ACoinCollector::BeginPlay()", "{", "    Super::BeginPlay();", "    Sphere->OnComponentBeginOverlap.AddDynamic(this, &ACoinCollector::OnOverlap);", "}", "", "void ACoinCollector::OnOverlap(UPrimitiveComponent* OverlappedComp, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)", "{", "    if (OtherActor && OtherActor->ActorHasTag(TEXT(\"Coin\")))", "    {", "        Score += CoinValue;", "        UE_LOG(LogTemp, Display, TEXT(\"Coin! Score: %d\"), Score);", "        OtherActor->Destroy();", "    }", "}"])); },
      run: function (v) { var o = []; for (var i = 1; i <= v.coins; i++) o.push("LogTemp: Display: Coin! Score: " + i * v.CoinValue); return o; },
      harness: function (v) { return "auto* Player = Spawn<ACoinCollector>();\nfor (int i = 0; i < " + v.coins + "; i++) {\n  auto* Coin = Spawn<AActor>();\n  Coin->Tags.Add(TEXT(\"Coin\"));\n  Overlap(Player, Coin);\n  if (i == 0) Overlap(Player, Spawn<AActor>());\n}"; },
      explain: "BeginPlay binds the overlap event with AddDynamic (OnOverlap is a UFUNCTION). ActorHasTag(\"Coin\") ignores the rock, and Destroy removes each coin after it counts." },
    { name: "Enemy Spawner", file: "Spawner.h", about: "A designer picks a class in the TSubclassOf slot; BeginPlay spawns a row of them.",
      vars: [{ key: "Count", val: 3, min: 1, max: 6 }, { key: "Spacing", val: 200, min: 50, max: 500 }],
      code: function (v) { return H("Spawner", "AActor", ["#include \"Engine/World.h\""], ["public:", "    UPROPERTY(EditAnywhere)", "    TSubclassOf<AActor> EnemyClass;", "", "    UPROPERTY(EditAnywhere)", "    int32 Count = " + v.Count + ";", "", "    UPROPERTY(EditAnywhere)", "    float Spacing = " + v.Spacing + ".f;", "", "protected:", "    virtual void BeginPlay() override;"]).concat(C("Spawner", ["void ASpawner::BeginPlay()", "{", "    Super::BeginPlay();", "    if (!EnemyClass) return;", "    for (int32 i = 0; i < Count; ++i)", "    {", "        FVector Spot(i * Spacing, 0.f, 0.f);", "        AActor* Enemy = GetWorld()->SpawnActor<AActor>(EnemyClass, Spot, FRotator::ZeroRotator);", "        if (Enemy)", "        {", "            UE_LOG(LogTemp, Display, TEXT(\"Enemy %d at X=%.0f\"), i + 1, Enemy->GetActorLocation().X);", "        }", "    }", "}"])); },
      run: function (v) { var o = []; for (var i = 0; i < v.Count; i++) o.push("LogTemp: Display: Enemy " + (i + 1) + " at X=" + fixedC(i * v.Spacing, 0)); return o; },
      harness: function () { return "auto* S = Make<ASpawner>();\nS->EnemyClass = TSubclassOf<AActor>::Of<AActor>();\nBegin(S);\nRun(1, 0.5);"; },
      explain: "In the editor you'd pick BP_Goblin for EnemyClass. Each SpawnActor places one more enemy Spacing centimeters further along X; the if guards against a failed spawn." },
    { name: "Walk to the Flag", file: "Walker.h", about: "Tick steps toward the flag at a steady speed, then switches Tick off. Frames here last half a second.",
      vars: [{ key: "Speed", label: "speed (cm/s)", val: 200, min: 100, max: 600 }, { key: "FlagX", label: "flag at X (cm)", val: 500, min: 100, max: 1000 }],
      code: function (v) { return H("Walker", "AActor", [], ["public:", "    AWalker();", "    virtual void Tick(float DeltaTime) override;", "", "    UPROPERTY(EditAnywhere)", "    float Speed = " + v.Speed + ".f;", "", "    UPROPERTY(EditAnywhere)", "    float FlagX = " + v.FlagX + ".f;"]).concat(C("Walker", ["AWalker::AWalker()", "{", "    PrimaryActorTick.bCanEverTick = true;", "}", "", "void AWalker::Tick(float DeltaTime)", "{", "    Super::Tick(DeltaTime);", "    FVector Here = GetActorLocation();", "    Here.X = FMath::Min(Here.X + Speed * DeltaTime, (double)FlagX);", "    SetActorLocation(Here);", "    UE_LOG(LogTemp, Display, TEXT(\"X = %.0f\"), Here.X);", "    if (Here.X >= FlagX)", "    {", "        UE_LOG(LogTemp, Warning, TEXT(\"Arrived!\"));", "        SetActorTickEnabled(false);", "    }", "}"])); },
      run: function (v) { var o = [], x = 0, step = v.Speed * 0.5; while (true) { x = Math.min(x + step, v.FlagX); o.push("LogTemp: Display: X = " + fixedC(x, 0)); if (x >= v.FlagX) { o.push("LogTemp: Warning: Arrived!"); break; } } return o; },
      harness: function (v) { return "Spawn<AWalker>();\nRun(" + (Math.ceil(v.FlagX / (v.Speed * 0.5)) + 3) + ", 0.5);"; },
      explain: "FMath::Min stops the walker exactly at the flag. In Unreal 5, FVector holds doubles, hence the (double) cast. SetActorTickEnabled(false) ends the work once it arrives." },
    { name: "Scoreboard", file: "Scoreboard.h", about: "A TArray keeps the players in order and a TMap finds each one's score by name.",
      vars: [{ key: "LeoScore", label: "Leo's score", val: 65, min: 0, max: 100 }],
      code: function (v) { return H("Scoreboard", "AActor", [], ["public:", "    UPROPERTY(EditAnywhere)", "    int32 LeoScore = " + v.LeoScore + ";", "", "protected:", "    virtual void BeginPlay() override;"]).concat(C("Scoreboard", ["void AScoreboard::BeginPlay()", "{", "    Super::BeginPlay();", "    TArray<FString> Players = { TEXT(\"Ana\"), TEXT(\"Leo\"), TEXT(\"Mia\") };", "    TMap<FString, int32> Scores;", "    Scores.Add(TEXT(\"Ana\"), 50);", "    Scores.Add(TEXT(\"Leo\"), LeoScore);", "    Scores.Add(TEXT(\"Mia\"), 72);", "    FString Winner;", "    int32 Best = -1;", "    for (const FString& Name : Players)", "    {", "        int32 Score = Scores[Name];", "        UE_LOG(LogTemp, Display, TEXT(\"%s: %d\"), *Name, Score);", "        if (Score > Best)", "        {", "            Best = Score;", "            Winner = Name;", "        }", "    }", "    UE_LOG(LogTemp, Warning, TEXT(\"Winner: %s with %d\"), *Winner, Best);", "}"])); },
      run: function (v) { var s = [["Ana", 50], ["Leo", v.LeoScore], ["Mia", 72]], o = [], best = -1, win = ""; s.forEach(function (p) { o.push("LogTemp: Display: " + p[0] + ": " + p[1]); if (p[1] > best) { best = p[1]; win = p[0]; } }); o.push("LogTemp: Warning: Winner: " + win + " with " + best); return o; },
      harness: function () { return "Spawn<AScoreboard>();\nRun(1, 0.5);"; },
      explain: "The TArray decides the order; the TMap answers “what's this player's score?” A tie goes to whoever came first, because > only replaces on a strictly higher score." },
    { name: "Backpack", file: "Backpack.h", about: "A TArray<FString> holds items: Add, Num, Contains and Remove.",
      vars: [{ key: "Potions", val: 2, min: 0, max: 5 }],
      code: function (v) { return H("Backpack", "AActor", [], ["public:", "    UPROPERTY(EditAnywhere)", "    int32 Potions = " + v.Potions + ";", "", "protected:", "    virtual void BeginPlay() override;", "", "private:", "    TArray<FString> Items = { TEXT(\"Sword\"), TEXT(\"Shield\") };"]).concat(C("Backpack", ["void ABackpack::BeginPlay()", "{", "    Super::BeginPlay();", "    for (int32 i = 0; i < Potions; ++i)", "    {", "        Items.Add(TEXT(\"Potion\"));", "    }", "    UE_LOG(LogTemp, Display, TEXT(\"Items: %d\"), Items.Num());", "    UE_LOG(LogTemp, Display, TEXT(\"Has a potion: %s\"), Items.Contains(TEXT(\"Potion\")) ? TEXT(\"yes\") : TEXT(\"no\"));", "    Items.Remove(TEXT(\"Shield\"));", "    UE_LOG(LogTemp, Display, TEXT(\"After dropping the shield: %d\"), Items.Num());", "}"])); },
      run: function (v) { var n = 2 + v.Potions; return ["LogTemp: Display: Items: " + n, "LogTemp: Display: Has a potion: " + (v.Potions > 0 ? "yes" : "no"), "LogTemp: Display: After dropping the shield: " + (n - 1)]; },
      harness: function () { return "Spawn<ABackpack>();\nRun(1, 0.5);"; },
      explain: "Num() counts items, Contains asks whether one is inside, and Remove takes out every matching item. The ? : picks the word to print." },
    { name: "Turret", file: "Turret.h", about: "A looping timer fires until the ammo runs out, then the timer is cleared.",
      vars: [{ key: "Ammo", val: 3, min: 1, max: 8 }, { key: "FireRate", label: "seconds between shots", val: 1, min: 1, max: 3 }],
      code: function (v) { return H("Turret", "AActor", ["#include \"TimerManager.h\""], ["public:", "    UPROPERTY(EditAnywhere)", "    int32 Ammo = " + v.Ammo + ";", "", "    UPROPERTY(EditAnywhere)", "    float FireRate = " + v.FireRate + ".f;", "", "protected:", "    virtual void BeginPlay() override;", "", "private:", "    FTimerHandle FireTimer;", "    void Fire();"]).concat(C("Turret", ["void ATurret::BeginPlay()", "{", "    Super::BeginPlay();", "    GetWorldTimerManager().SetTimer(FireTimer, this, &ATurret::Fire, FireRate, true);", "}", "", "void ATurret::Fire()", "{", "    Ammo--;", "    UE_LOG(LogTemp, Display, TEXT(\"Bang! Ammo left: %d\"), Ammo);", "    if (Ammo <= 0)", "    {", "        UE_LOG(LogTemp, Warning, TEXT(\"Out of ammo\"));", "        GetWorldTimerManager().ClearTimer(FireTimer);", "    }", "}"])); },
      run: function (v) { var o = []; for (var a = v.Ammo - 1; a >= 0; a--) o.push("LogTemp: Display: Bang! Ammo left: " + a); o.push("LogTemp: Warning: Out of ammo"); return o; },
      harness: function (v) { return "Spawn<ATurret>();\nRun(" + (v.Ammo * v.FireRate * 2 + 4) + ", 0.5);"; },
      explain: "The timer calls Fire every FireRate seconds. Each shot uses one round; at zero, ClearTimer stops the loop." },
    { name: "Guard AI", file: "Guard.h", about: "An enum state machine: the guard idles, chases or attacks depending on how close the player is.",
      vars: [{ key: "ChaseRange", label: "chase range (cm)", val: 800, min: 100, max: 1500 }, { key: "AttackRange", label: "attack range (cm)", val: 200, min: 0, max: 500 }],
      code: function (v) { return ["// Guard.h", "#pragma once", "", "#include \"CoreMinimal.h\"", "#include \"GameFramework/Actor.h\"", "#include \"Guard.generated.h\"", "", "UENUM()", "enum class EGuardState : uint8 { Idle, Chase, Attack };", "", "UCLASS()", "class AGuard : public AActor", "{", "    GENERATED_BODY()", "", "public:", "    AGuard();", "    virtual void Tick(float DeltaTime) override;", "", "    UPROPERTY(EditAnywhere)", "    float ChaseRange = " + v.ChaseRange + ".f;", "", "    UPROPERTY(EditAnywhere)", "    float AttackRange = " + v.AttackRange + ".f;", "", "private:", "    TArray<float> Distances = { 1200.f, 900.f, 600.f, 300.f, 150.f, 500.f, 1000.f };", "    EGuardState State = EGuardState::Idle;", "    int32 Step = 0;", "    static const TCHAR* Name(EGuardState S);", "};", "", "// Guard.cpp", "#include \"Guard.h\"", "", "AGuard::AGuard()", "{", "    PrimaryActorTick.bCanEverTick = true;", "}", "", "const TCHAR* AGuard::Name(EGuardState S)", "{", "    switch (S)", "    {", "    case EGuardState::Chase: return TEXT(\"Chase\");", "    case EGuardState::Attack: return TEXT(\"Attack\");", "    default: return TEXT(\"Idle\");", "    }", "}", "", "void AGuard::Tick(float DeltaTime)", "{", "    Super::Tick(DeltaTime);", "    if (Step >= Distances.Num()) return;", "    float D = Distances[Step++];", "    EGuardState Next = D <= AttackRange ? EGuardState::Attack : D <= ChaseRange ? EGuardState::Chase : EGuardState::Idle;", "    if (Next != State)", "    {", "        State = Next;", "        UE_LOG(LogTemp, Display, TEXT(\"Player at %.0f cm: %s\"), D, Name(State));", "    }", "}"]; },
      run: function (v) { var o = [], st = "Idle"; [1200, 900, 600, 300, 150, 500, 1000].forEach(function (d) { var nx = d <= v.AttackRange ? "Attack" : d <= v.ChaseRange ? "Chase" : "Idle"; if (nx !== st) { st = nx; o.push("LogTemp: Display: Player at " + d + " cm: " + st); } }); return o; },
      harness: function () { return "Spawn<AGuard>();\nRun(8, 0.5);"; },
      explain: "Each Tick reads the next distance (standing in for GetDistanceTo(Player)) and picks a state. It logs only CHANGES of state; the switch turns the enum into a word." }
  ];

  var vt = [
    { line: 'UE_LOG(LogTemp, Warning, TEXT("{w}"));', why: "UE_LOG writes a line to the Output Log; Warning shows it in yellow." },
    { line: 'UE_LOG(LogTemp, Display, TEXT("%d"), {v});', why: "%d fills in a whole number." },
    { line: 'UE_LOG(LogTemp, Display, TEXT("%s"), *{sv});', why: "FStrings need a * in front for %s." },
    { line: 'UE_LOG(LogTemp, Display, TEXT("%.1f"), {v});', why: "%.1f prints a float with one decimal place." },
    { line: "int32 {v} = {n};", why: "int32 is Unreal's 32-bit whole number." },
    { line: "float {v} = {dec}f;", why: "float holds a number with a decimal point." },
    { line: "bool b{v} = {b};", why: "Unreal names booleans with a b in front." },
    { line: 'FString {sv} = TEXT("{w}");', why: "FString holds text; wrap literals in TEXT()." },
    { line: 'FName {sv} = TEXT("{w}");', why: "FName is a fast, fixed name for tags and levels." },
    { line: 'FString {sv} = FString::Printf(TEXT("%d"), {v});', why: "Printf builds text from placeholders." },
    { line: "UPROPERTY(EditAnywhere) float {v} = {n}.f;", why: "EditAnywhere shows the value in the Details panel." },
    { line: "UPROPERTY(VisibleAnywhere) int32 {v} = 0;", why: "VisibleAnywhere shows a value without letting you edit it." },
    { line: 'UPROPERTY(EditAnywhere, Category = "{w}") int32 {v};', why: "Category groups properties under a heading." },
    { line: "UPROPERTY(EditAnywhere, BlueprintReadWrite) float {v};", why: "BlueprintReadWrite lets Blueprints use the value too." },
    { line: "UFUNCTION(BlueprintCallable) void {f}();", why: "BlueprintCallable lets Blueprints call this function." },
    { line: "UFUNCTION(BlueprintImplementableEvent) void On{f}();", why: "Blueprints implement this event; C++ triggers it." },
    { line: "class {c} : public AActor", why: "Actor classes inherit from AActor and start with A." },
    { line: "PrimaryActorTick.bCanEverTick = true;", why: "Switch Tick on in the constructor." },
    { line: "PrimaryActorTick.bCanEverTick = false;", why: "Actors that don't need Tick should switch it off." },
    { line: "Super::BeginPlay();", why: "Always let the parent class start first." },
    { line: "Super::Tick(DeltaTime);", why: "Call the parent's Tick before your own work." },
    { line: "SetActorLocation(GetActorLocation() + FVector(0, 0, {n}));", why: "FVector(X, Y, Z): Z is up, in centimeters." },
    { line: "AddActorWorldOffset(FVector({n}.f * DeltaTime, 0.f, 0.f));", why: "Multiply by DeltaTime to move per second." },
    { line: "AddActorLocalRotation(FRotator(0.f, {n}.f * DeltaTime, 0.f));", why: "FRotator(Pitch, Yaw, Roll): Yaw turns left and right." },
    { line: "SetActorRotation(FRotator(0.f, {n}.f, 0.f));", why: "Set a rotation directly, in degrees." },
    { line: "FVector {v} = GetActorLocation();", why: "Read where the Actor is right now." },
    { line: "float {v} = FVector::Dist(GetActorLocation(), {o}->GetActorLocation());", why: "Dist measures centimeters between two points." },
    { line: "FVector {v} = ({o}->GetActorLocation() - GetActorLocation()).GetSafeNormal();", why: "Subtract, then normalize, to get a direction." },
    { line: '{o} = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("{w}"));', why: "Create components in the constructor." },
    { line: "RootComponent = {o};", why: "The root component anchors the Actor in the world." },
    { line: "{o}->SetupAttachment(RootComponent);", why: "Attach a component so it moves with the root." },
    { line: "UPROPERTY(EditAnywhere) TSubclassOf<AActor> {c}Class;", why: "Let a designer pick which class to spawn." },
    { line: "AActor* {o} = GetWorld()->SpawnActor<AActor>({c}Class, GetActorLocation(), GetActorRotation());", why: "SpawnActor creates a new Actor during play." },
    { line: "if ({o}) { {o}->SetLifeSpan({d}.f); }", why: "Check the spawn worked, then let it clean itself up." },
    { line: "Destroy();", why: "Destroy removes this Actor from the level." },
    { line: "if (IsValid({o})) { {o}->Destroy(); }", why: "IsValid checks a pointer before using it." },
    { line: "GetWorldTimerManager().SetTimer({c}Timer, this, &{c}::{f}, {d}.f, true);", why: "A looping timer calls a function on a schedule." },
    { line: "GetWorldTimerManager().ClearTimer({c}Timer);", why: "ClearTimer stops a timer." },
    { line: "FTimerHandle {c}Timer;", why: "A handle remembers a timer." },
    { line: "{o}->OnComponentBeginOverlap.AddDynamic(this, &{c}::On{f});", why: "AddDynamic connects an overlap event to a UFUNCTION." },
    { line: 'if (OtherActor && OtherActor->ActorHasTag(TEXT("{w}"))) { {f}(); }', why: "Check who overlapped before reacting." },
    { line: "if ({c}* {sv} = Cast<{c}>(OtherActor)) { {sv}->{f}(); }", why: "Cast checks an Actor's class safely." },
    { line: "{v} = FMath::Clamp({v} - {n}.f, 0.f, 100.f);", why: "Clamp keeps a value between a minimum and maximum." },
    { line: "int32 {v} = FMath::RandRange(1, {n});", why: "RandRange includes both ends." },
    { line: "{v} = FMath::FInterpTo({v}, {n}.f, DeltaTime, {d}.f);", why: "FInterpTo eases a value toward a target each frame." },
    { line: "TArray<int32> {arr};", why: "TArray is Unreal's growable list." },
    { line: "{arr}.Add({n});", why: "Add puts an item on the end." },
    { line: "int32 {v} = {arr}.Num();", why: "Num counts the items." },
    { line: "if ({arr}.Contains({n})) { {f}(); }", why: "Contains asks whether an item is in the list." },
    { line: "for (int32 Item : {arr}) { {v} += Item; }", why: "A range loop walks every item." },
    { line: "TMap<FString, int32> {arr};", why: "TMap stores values by key." },
    { line: 'if (int32* {v} = {arr}.Find(TEXT("{w}"))) { }', why: "Find returns a pointer, or nullptr if the key is missing." },
    { line: "Input->BindAction({c}Action, ETriggerEvent::Started, this, &{c}::{f});", why: "Bind an Enhanced Input action to a function." },
    { line: "FVector2D {v} = Value.Get<FVector2D>();", why: "Read a stick or WASD value from an input action." },
    { line: "AddMovementInput(GetActorForwardVector(), {v});", why: "Characters move by adding movement input." },
    { line: 'GEngine->AddOnScreenDebugMessage(-1, {d}.f, FColor::Green, TEXT("{w}"));', why: "Show a quick debug message on screen." },
    { line: 'UGameplayStatics::OpenLevel(this, FName(TEXT("{w}")));', why: "OpenLevel loads another map." },
    { line: "APawn* {o} = UGameplayStatics::GetPlayerPawn(this, 0);", why: "GetPlayerPawn finds the first player." },
    { line: "SetActorLocation(FVector({n}.f, {n2}.f, 0.f));", why: "Place the Actor at an exact spot, in centimeters." },
    { line: "AddMovementInput(GetActorRightVector(), {v});", why: "The right vector moves a character sideways." },
    { line: "GetWorldTimerManager().SetTimer({c}Timer, this, &{c}::{f}, {d}.f, false);", why: "false makes a one-shot timer: it fires once." },
    { line: "AddControllerYawInput({v} * {d}.f);", why: "Yaw input turns the view left and right; the multiplier sets the sensitivity." }
  ];
  var themes = [
    { name: "Logging", t: [0, 1, 2, 3, 9] },
    { name: "Unreal Types", t: [4, 5, 6, 7, 8] },
    { name: "Text Building", t: [9, 7, 8, 2, 0] },
    { name: "Properties", t: [10, 11, 12, 13, 4] },
    { name: "Functions for Blueprints", t: [14, 15, 13, 10, 12] },
    { name: "Actor Basics", t: [16, 18, 20, 58, 24] },
    { name: "Moving Actors", t: [21, 22, 23, 24, 25] },
    { name: "Distances & Directions", t: [26, 27, 25, 21, 22] },
    { name: "Components", t: [28, 29, 30, 28, 17] },
    { name: "Spawning", t: [31, 32, 33, 34, 35] },
    { name: "Timers", t: [36, 37, 38, 60, 19] },
    { name: "Overlaps", t: [39, 40, 41, 34, 35] },
    { name: "FMath", t: [42, 43, 44, 4, 5] },
    { name: "TArray", t: [45, 46, 47, 48, 49] },
    { name: "TMap", t: [50, 51, 46, 47, 9] },
    { name: "Input", t: [52, 53, 54, 61, 59] },
    { name: "Debug & Levels", t: [55, 56, 0, 1, 2] },
    { name: "Player Lookups", t: [57, 35, 26, 27, 41] },
    { name: "Safety First", t: [35, 33, 34, 40, 41] },
    { name: "Unreal Masters", t: [32, 36, 39, 44, 52] }
  ];
  var UE_VARS = ["Score", "Health", "Speed", "Ammo", "Coins", "Damage", "Lives", "Stamina", "Gold", "Range", "Shield", "Mana", "Level", "Kills", "Timer"];
  var UE_CLASSES = ["ACoin", "ADoor", "ATurret", "AHero", "APickup", "AEnemy", "ARocket", "APortal", "ACrate", "ATrap"];
  var UE_FUNCS = ["Fire", "Jump", "Heal", "Spawn", "Reload", "Collect", "Explode", "Open", "Close", "Respawn", "Flash", "Launch"];
  var UE_OBJS = ["Mesh", "Box", "Sphere", "Target", "Player", "Enemy", "Shot", "Pickup", "Door", "Crate"];
  var UE_STRS = ["Name", "Title", "Message", "Label", "Tag", "Hero", "Map"];
  var UE_ARRS = ["Scores", "Items", "Enemies", "Waypoints", "Prices", "Points"];

  return {
    blocks: blocks, chapters: chapters, shelves: shelves, glossary: glossary, field: field, cheats: cheats,
    projects: projects, vt: vt, themes: themes,
    /* Unreal names everything in PascalCase, and classes carry their A prefix. */
    fill: function (k, r) {
      var pick = function (a) { return a[Math.floor(r() * a.length)]; };
      if (k === "v" || k === "u" || k === "r") return pick(UE_VARS);
      if (k === "c" || k === "k") return pick(UE_CLASSES);
      if (k === "f") return pick(UE_FUNCS);
      if (k === "o") return pick(UE_OBJS);
      if (k === "sv") return pick(UE_STRS);
      if (k === "arr") return pick(UE_ARRS);
      return null;
    },
    sandboxNote: "Thirty everyday Unreal Engine C++ lines, in the order the Library teaches them. Each block takes 8 perfect repetitions, and your Unreal progress is saved separately from every other track.",
    sourcesHTML: 'Unreal facts and API names follow the <a href="https://dev.epicgames.com/documentation/en-us/unreal-engine">Unreal Engine documentation</a> and Epic’s C++ coding standard (Unreal Engine 5). Every explanation is written in Code Block’s own words. Unreal and Unreal Engine are trademarks of Epic Games; Code Block is not affiliated with Epic. The PC plays practice Actors in a small stand-in engine — constructor, BeginPlay, then a few frames of Tick — so what you see is what the Output Log would show; rendering, physics and Blueprints live in Unreal itself.'
  };
});
