// A small stand-in for Unreal Engine 5's C++ API, used ONLY by the content
// tests. The Unreal track's code compiles against these names (same macros,
// classes and include paths as UE 5), and a tiny loop plays an Actor:
// constructor, BeginPlay, then Tick for N frames, with timers, spawning,
// overlaps and Destroy honoured. UE_LOG prints the same "LogTemp: Warning: …"
// lines Unreal's Output Log shows, so the test can compare them with the
// app's PC screen. This is not Unreal: no rendering, physics or editor.
#pragma once
#include <algorithm>
#include <cmath>
#include <cstdarg>
#include <cstdint>
#include <cstdio>
#include <functional>
#include <map>
#include <memory>
#include <string>
#include <type_traits>
#include <utility>
#include <vector>

// ---------- Macros the Unreal Header Tool reads (no-ops here) ----------
#define UCLASS(...)
#define USTRUCT(...)
#define UENUM(...)
#define UPROPERTY(...)
#define UFUNCTION(...)
#define UMETA(...)
#define UINTERFACE(...)
#define GENERATED_BODY()
#define GENERATED_UCLASS_BODY()
#define TEXT(x) x
#define FORCEINLINE inline
#define check(x) ((void)0)
#define ensure(x) (x)
#define DECLARE_LOG_CATEGORY_EXTERN(...)
#define DEFINE_LOG_CATEGORY(...)
#define DEFINE_LOG_CATEGORY_STATIC(...)
#define DECLARE_DYNAMIC_MULTICAST_DELEGATE(Name) struct Name : UEStub::Multicast<> {}
#define DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(Name, T1, N1) struct Name : UEStub::Multicast<T1> {}
#define AddDynamic(Obj, Fn) Add(Obj, Fn)
#define RemoveDynamic(Obj, Fn) Remove(Obj)

using int32 = int32_t;
using int64 = int64_t;
using uint8 = uint8_t;
using uint32 = uint32_t;
using TCHAR = char;

namespace UEStub {
enum class ELogV { Log, Display, Warning, Error, Fatal, Verbose, VeryVerbose };
inline void Log(const char* cat, ELogV v, const char* fmt, ...) {
  char buf[2048];
  va_list ap; va_start(ap, fmt); vsnprintf(buf, sizeof buf, fmt, ap); va_end(ap);
  const char* tag = v == ELogV::Warning ? "Warning: " : v == ELogV::Error ? "Error: " : v == ELogV::Display ? "Display: " : "";
  std::printf("%s: %s%s\n", cat, tag, buf);
}
template <class... A> struct Multicast {
  std::vector<std::pair<void*, std::function<void(A...)>>> calls;
  template <class T, class R, class... P> void Add(T* obj, R (T::*fn)(P...)) { calls.push_back({obj, [obj, fn](A... a) { (obj->*fn)(a...); }}); }
  void Remove(void* obj) { calls.erase(std::remove_if(calls.begin(), calls.end(), [obj](auto& c) { return c.first == obj; }), calls.end()); }
  void Broadcast(A... a) { auto copy = calls; for (auto& c : copy) c.second(a...); }
  bool IsBound() const { return !calls.empty(); }
};
}  // namespace UEStub
#define UE_LOG(Category, Verbosity, Format, ...) ::UEStub::Log(#Category, ::UEStub::ELogV::Verbosity, Format, ##__VA_ARGS__)

// ---------- Strings ----------
class FString {
 public:
  std::string S;
  FString() {}
  FString(const char* s) : S(s) {}
  FString(std::string s) : S(std::move(s)) {}
  const TCHAR* operator*() const { return S.c_str(); }
  int32 Len() const { return (int32)S.size(); }
  bool IsEmpty() const { return S.empty(); }
  FString ToUpper() const { std::string r = S; for (auto& c : r) c = (char)toupper(c); return r; }
  FString ToLower() const { std::string r = S; for (auto& c : r) c = (char)tolower(c); return r; }
  bool Contains(const FString& o) const { return S.find(o.S) != std::string::npos; }
  bool StartsWith(const FString& o) const { return S.rfind(o.S, 0) == 0; }
  FString Left(int32 n) const { return S.substr(0, n); }
  FString Mid(int32 i, int32 n = 1 << 30) const { return i < (int32)S.size() ? S.substr(i, n) : std::string(); }
  FString operator+(const FString& o) const { return S + o.S; }
  FString& operator+=(const FString& o) { S += o.S; return *this; }
  bool operator==(const FString& o) const { return S == o.S; }
  bool operator!=(const FString& o) const { return S != o.S; }
  bool operator<(const FString& o) const { return S < o.S; }
  static FString FromInt(int32 n) { return std::to_string(n); }
  static FString SanitizeFloat(double d) { char b[64]; std::snprintf(b, sizeof b, "%g", d); return FString(b); }
  static FString Printf(const char* fmt, ...) { char buf[2048]; va_list ap; va_start(ap, fmt); vsnprintf(buf, sizeof buf, fmt, ap); va_end(ap); return FString(buf); }
  static FString Join(const std::vector<FString>& parts, const TCHAR* sep) { std::string r; for (size_t i = 0; i < parts.size(); i++) { if (i) r += sep; r += parts[i].S; } return r; }
};
inline FString operator+(const char* a, const FString& b) { return FString(a) + b; }
class FName { public: std::string S; FName() {} FName(const char* s) : S(s) {} FName(const FString& f) : S(f.S) {} FString ToString() const { return S; } bool operator==(const FName& o) const { return S == o.S; } bool IsNone() const { return S.empty(); } };
inline const FName NAME_None;
class FText { public: FString Str; static FText FromString(const FString& s) { FText t; t.Str = s; return t; } static FText AsNumber(int32 n) { return FromString(FString::FromInt(n)); } FString ToString() const { return Str; } };

// ---------- Containers ----------
template <class T> class TArray {
 public:
  std::vector<T> V;
  TArray() {}
  TArray(std::initializer_list<T> l) : V(l) {}
  int32 Add(const T& x) { V.push_back(x); return (int32)V.size() - 1; }
  int32 AddUnique(const T& x) { int32 i = Find(x); return i >= 0 ? i : Add(x); }
  int32 Num() const { return (int32)V.size(); }
  bool IsEmpty() const { return V.empty(); }
  bool IsValidIndex(int32 i) const { return i >= 0 && i < Num(); }
  T& operator[](int32 i) { return V[i]; }
  const T& operator[](int32 i) const { return V[i]; }
  bool Contains(const T& x) const { return std::find(V.begin(), V.end(), x) != V.end(); }
  int32 Find(const T& x) const { auto it = std::find(V.begin(), V.end(), x); return it == V.end() ? -1 : (int32)(it - V.begin()); }
  int32 Remove(const T& x) { auto n = V.size(); V.erase(std::remove(V.begin(), V.end(), x), V.end()); return (int32)(n - V.size()); }
  void RemoveAt(int32 i) { V.erase(V.begin() + i); }
  void Empty() { V.clear(); }
  T& Last() { return V.back(); }
  void Sort() { std::sort(V.begin(), V.end()); }
  typename std::vector<T>::iterator begin() { return V.begin(); }
  typename std::vector<T>::iterator end() { return V.end(); }
  typename std::vector<T>::const_iterator begin() const { return V.begin(); }
  typename std::vector<T>::const_iterator end() const { return V.end(); }
};
template <class K, class V> class TMap {
 public:
  std::map<K, V> M;
  void Add(const K& k, const V& v) { M[k] = v; }
  V* Find(const K& k) { auto it = M.find(k); return it == M.end() ? nullptr : &it->second; }
  bool Contains(const K& k) const { return M.count(k) > 0; }
  V& operator[](const K& k) { return M[k]; }
  V FindRef(const K& k) const { auto it = M.find(k); return it == M.end() ? V() : it->second; }
  int32 Num() const { return (int32)M.size(); }
  int32 Remove(const K& k) { return (int32)M.erase(k); }
  struct Pair { const K& Key; V& Value; };
  struct It { typename std::map<K, V>::iterator i; Pair operator*() { return Pair{i->first, i->second}; } It& operator++() { ++i; return *this; } bool operator!=(const It& o) const { return i != o.i; } };
  It begin() { return It{M.begin()}; }
  It end() { return It{M.end()}; }
};
template <class T> using TObjectPtr = T*;
template <class T> using TWeakObjectPtr = T*;

// ---------- Maths ----------
struct FVector2D { double X = 0, Y = 0; FVector2D() {} FVector2D(double x, double y) : X(x), Y(y) {} };
struct FVector {
  double X = 0, Y = 0, Z = 0;
  FVector() {}
  FVector(double x, double y, double z) : X(x), Y(y), Z(z) {}
  explicit FVector(double a) : X(a), Y(a), Z(a) {}
  static const FVector ZeroVector, OneVector, UpVector, ForwardVector, RightVector;
  FVector operator+(const FVector& o) const { return {X + o.X, Y + o.Y, Z + o.Z}; }
  FVector operator-(const FVector& o) const { return {X - o.X, Y - o.Y, Z - o.Z}; }
  FVector operator-() const { return {-X, -Y, -Z}; }
  FVector operator*(double d) const { return {X * d, Y * d, Z * d}; }
  FVector operator/(double d) const { return {X / d, Y / d, Z / d}; }
  FVector& operator+=(const FVector& o) { X += o.X; Y += o.Y; Z += o.Z; return *this; }
  FVector& operator-=(const FVector& o) { X -= o.X; Y -= o.Y; Z -= o.Z; return *this; }
  bool operator==(const FVector& o) const { return X == o.X && Y == o.Y && Z == o.Z; }
  double Size() const { return std::sqrt(X * X + Y * Y + Z * Z); }
  double Length() const { return Size(); }
  FVector GetSafeNormal() const { double s = Size(); return s > 1e-8 ? *this / s : ZeroVector; }
  static double Dist(const FVector& a, const FVector& b) { return (a - b).Size(); }
  static double Distance(const FVector& a, const FVector& b) { return Dist(a, b); }
  static double DotProduct(const FVector& a, const FVector& b) { return a.X * b.X + a.Y * b.Y + a.Z * b.Z; }
  FString ToString() const { return FString::Printf("X=%.3f Y=%.3f Z=%.3f", X, Y, Z); }
};
inline FVector operator*(double d, const FVector& v) { return v * d; }
inline const FVector FVector::ZeroVector(0, 0, 0);
inline const FVector FVector::OneVector(1, 1, 1);
inline const FVector FVector::UpVector(0, 0, 1);
inline const FVector FVector::ForwardVector(1, 0, 0);
inline const FVector FVector::RightVector(0, 1, 0);
struct FRotator {
  double Pitch = 0, Yaw = 0, Roll = 0;
  FRotator() {}
  FRotator(double p, double y, double r) : Pitch(p), Yaw(y), Roll(r) {}
  static const FRotator ZeroRotator;
  FRotator operator+(const FRotator& o) const { return {Pitch + o.Pitch, Yaw + o.Yaw, Roll + o.Roll}; }
  FVector Vector() const { double y = Yaw * 3.14159265358979323846 / 180.0; return {std::cos(y), std::sin(y), 0}; }
  // Unreal keeps each axis in (-180, 180].
  FRotator GetNormalized() const { auto n = [](double a) { a = std::fmod(a, 360.0); if (a > 180.0) a -= 360.0; else if (a <= -180.0) a += 360.0; return a; }; return {n(Pitch), n(Yaw), n(Roll)}; }
};
inline const FRotator FRotator::ZeroRotator(0, 0, 0);
struct FColor { uint8 R, G, B, A; static const FColor Red, Green, Blue, Yellow, White, Cyan; };
inline const FColor FColor::Red{255, 0, 0, 255};
inline const FColor FColor::Green{0, 255, 0, 255};
inline const FColor FColor::Blue{0, 0, 255, 255};
inline const FColor FColor::Yellow{255, 255, 0, 255};
inline const FColor FColor::White{255, 255, 255, 255};
inline const FColor FColor::Cyan{0, 255, 255, 255};
struct FLinearColor { float R, G, B, A; };
struct FMath {
  template <class T> static T Clamp(T v, T lo, T hi) { return v < lo ? lo : v > hi ? hi : v; }
  template <class T> static T Max(T a, T b) { return a > b ? a : b; }
  template <class T> static T Min(T a, T b) { return a < b ? a : b; }
  template <class T> static T Abs(T a) { return a < 0 ? -a : a; }
  template <class T> static T Square(T a) { return a * a; }
  static double Sqrt(double a) { return std::sqrt(a); }
  static double Sin(double a) { return std::sin(a); }
  static double Cos(double a) { return std::cos(a); }
  static int32 RandRange(int32 lo, int32 hi) { static uint32 s = 7; s = s * 1103515245u + 12345u; return lo + (int32)((s >> 16) % (uint32)(hi - lo + 1)); }
  static double FRandRange(double lo, double hi) { return lo + (hi - lo) * (RandRange(0, 10000) / 10000.0); }
  template <class T> static T Lerp(T a, T b, double t) { return (T)(a + (b - a) * t); }
  static double FInterpTo(double cur, double target, double dt, double speed) { if (speed <= 0) return target; double d = target - cur; if (d * d < 1e-8) return target; return cur + d * Clamp(dt * speed, 0.0, 1.0); }
  static FVector VInterpTo(const FVector& c, const FVector& t, double dt, double s) { return {FInterpTo(c.X, t.X, dt, s), FInterpTo(c.Y, t.Y, dt, s), FInterpTo(c.Z, t.Z, dt, s)}; }
  static int32 FloorToInt(double a) { return (int32)std::floor(a); }
  static int32 CeilToInt(double a) { return (int32)std::ceil(a); }
  static int32 RoundToInt(double a) { return (int32)std::floor(a + 0.5); }
  static double FInterpConstantTo(double cur, double target, double dt, double speed) { double step = speed * dt, d = target - cur; return Abs(d) <= step ? target : cur + (d > 0 ? step : -step); }
  static bool IsNearlyEqual(double a, double b, double tol = 1e-8) { return Abs(a - b) <= tol; }
};

// ---------- Objects, Actors, Components ----------
class UWorld;
class AActor;
class UClass {};
class UObject {
 public:
  using Super = UObject;
  virtual ~UObject() {}
  FString ObjName = "Object";
  FString GetName() const { return ObjName; }
  UWorld* GetWorld() const;
  virtual void BeginDestroy() {}
};
template <class To, class From> To* Cast(From* f) { return dynamic_cast<To*>(f); }
template <class T> bool IsValid(T* p) { return p != nullptr; }

struct FActorTickFunction { bool bCanEverTick = false; bool bStartWithTickEnabled = true; double TickInterval = 0; };
enum ELevelTick { LEVELTICK_All };
struct FActorComponentTickFunction {};
struct FHitResult { AActor* GetActor() const { return Actor; } AActor* Actor = nullptr; FVector ImpactPoint; double Distance = 0; };
namespace EEndPlayReason { enum Type { Destroyed, LevelTransition, EndPlayInEditor, RemovedFromWorld, Quit }; }

class UActorComponent : public UObject {
 public:
  using Super = UActorComponent;
  AActor* Owner = nullptr;
  FActorComponentTickFunction PrimaryComponentTick;
  AActor* GetOwner() const { return Owner; }
  virtual void BeginPlay() {}
  virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) {}
};
class USceneComponent : public UActorComponent {
 public:
  using Super = USceneComponent;
  FVector RelativeLocation;
  void SetupAttachment(USceneComponent* parent) {}
  void SetRelativeLocation(const FVector& v) { RelativeLocation = v; }
  void SetVisibility(bool b) {}
};
class UPrimitiveComponent;
struct FComponentBeginOverlapSignature : UEStub::Multicast<UPrimitiveComponent*, AActor*, UPrimitiveComponent*, int32, bool, const FHitResult&> {};
struct FComponentHitSignature : UEStub::Multicast<UPrimitiveComponent*, AActor*, UPrimitiveComponent*, FVector, const FHitResult&> {};
class UPrimitiveComponent : public USceneComponent {
 public:
  using Super = UPrimitiveComponent;
  FComponentBeginOverlapSignature OnComponentBeginOverlap;
  FComponentHitSignature OnComponentHit;
  bool bSimulatePhysics = false;
  FVector Velocity;
  double Mass = 1;
  void SetSimulatePhysics(bool b) { bSimulatePhysics = b; }
  void SetGenerateOverlapEvents(bool b) {}
  void AddImpulse(const FVector& impulse, FName bone = FName(), bool bVelChange = false) { Velocity += bVelChange ? impulse : impulse / Mass; }
  void AddForce(const FVector& force) {}
  FVector GetPhysicsLinearVelocity() const { return Velocity; }
  void SetCollisionProfileName(const FName& n) {}
  double GetMass() const { return Mass; }
  void SetMassOverrideInKg(FName bone, double kg, bool b = true) { Mass = kg; }
};
class UStaticMesh : public UObject {};
class UStaticMeshComponent : public UPrimitiveComponent { public: using Super = UStaticMeshComponent; void SetStaticMesh(UStaticMesh* m) {} };
class UShapeComponent : public UPrimitiveComponent {};
class UBoxComponent : public UShapeComponent { public: void SetBoxExtent(const FVector& v) {} };
class USphereComponent : public UShapeComponent { public: void SetSphereRadius(double r) {} };
class UCapsuleComponent : public UShapeComponent {};
class UCameraComponent : public USceneComponent {};
class USpringArmComponent : public USceneComponent { public: double TargetArmLength = 300; bool bUsePawnControlRotation = false; };
class USoundBase : public UObject {};
class UAudioComponent : public USceneComponent { public: void Play() {} };
class UTextRenderComponent : public UPrimitiveComponent { public: void SetText(const FText& t) {} };

template <class T> class TSubclassOf {
 public:
  std::function<T*()> Make;
  TSubclassOf() {}
  template <class U> static TSubclassOf Of() { TSubclassOf s; s.Make = [] { return new U(); }; return s; }
  explicit operator bool() const { return (bool)Make; }
};

struct FTimerHandle { int32 Id = 0; bool IsValid() const { return Id != 0; } };
class FTimerManager {
 public:
  struct Timer { int32 Id; double At; double Every; std::function<void()> Fn; void* Owner; };
  std::vector<Timer> Timers;
  int32 Next = 1;
  double Now = 0;
  template <class T> void SetTimer(FTimerHandle& h, T* obj, void (T::*fn)(), double rate, bool loop = false, double first = -1) {
    ClearTimer(h); h.Id = Next++;
    Timers.push_back({h.Id, Now + (first >= 0 ? first : rate), loop ? rate : 0, [obj, fn] { (obj->*fn)(); }, obj});
  }
  void ClearTimer(FTimerHandle& h) { int32 id = h.Id; Timers.erase(std::remove_if(Timers.begin(), Timers.end(), [id](auto& t) { return t.Id == id; }), Timers.end()); h.Id = 0; }
  void ClearAllTimersForObject(void* o) { Timers.erase(std::remove_if(Timers.begin(), Timers.end(), [o](auto& t) { return t.Owner == o; }), Timers.end()); }
  bool IsTimerActive(const FTimerHandle& h) const { for (auto& t : Timers) if (t.Id == h.Id) return true; return false; }
  void Advance(double t) {
    Now = t;
    for (bool fired = true; fired;) {
      fired = false;
      for (size_t i = 0; i < Timers.size(); i++) {
        if (Timers[i].At <= Now + 1e-6) {
          Timer copy = Timers[i];
          if (copy.Every > 0) Timers[i].At += copy.Every; else Timers.erase(Timers.begin() + i);
          copy.Fn(); fired = true; break;
        }
      }
    }
  }
};

class AActor : public UObject {
 public:
  using Super = AActor;
  FActorTickFunction PrimaryActorTick;
  USceneComponent* RootComponent = nullptr;
  FVector Location;
  FRotator Rotation;
  FVector Scale{1, 1, 1};
  bool bDestroyed = false;
  bool bHidden = false;
  std::vector<UActorComponent*> Components;
  TArray<FName> Tags;
  virtual void BeginPlay() { for (auto* c : Components) c->BeginPlay(); }
  virtual void Tick(float DeltaTime) {}
  virtual void EndPlay(const EEndPlayReason::Type Reason) {}
  virtual void NotifyActorBeginOverlap(AActor* Other) {}
  template <class T> T* CreateDefaultSubobject(const char* name) { T* c = new T(); c->ObjName = name; c->Owner = this; Components.push_back(c); return c; }
  template <class T> T* FindComponentByClass() const { for (auto* c : Components) if (auto* t = dynamic_cast<T*>(c)) return t; return nullptr; }
  FVector GetActorLocation() const { return Location; }
  bool SetActorLocation(const FVector& v) { Location = v; return true; }
  void AddActorWorldOffset(const FVector& v) { Location += v; }
  void AddActorLocalOffset(const FVector& v) { Location += v; }
  FRotator GetActorRotation() const { return Rotation.GetNormalized(); }
  bool SetActorRotation(const FRotator& r) { Rotation = r; return true; }
  void AddActorLocalRotation(const FRotator& r) { Rotation = Rotation + r; }
  void AddActorWorldRotation(const FRotator& r) { Rotation = Rotation + r; }
  void SetActorScale3D(const FVector& s) { Scale = s; }
  FVector GetActorScale3D() const { return Scale; }
  FVector GetActorForwardVector() const { return Rotation.Vector(); }
  void SetActorHiddenInGame(bool b) { bHidden = b; }
  void SetActorTickEnabled(bool b) { PrimaryActorTick.bCanEverTick = b; }
  double LifeSpan = 0;
  void SetLifeSpan(double seconds) { LifeSpan = seconds; }
  bool ActorHasTag(const FName& t) const { for (auto& x : Tags.V) if (x == t) return true; return false; }
  virtual bool Destroy();
  FTimerManager& GetWorldTimerManager() const;
  double GetDistanceTo(const AActor* o) const { return FVector::Dist(Location, o->Location); }
};
class APawn : public AActor { public: using Super = APawn; class AController* Controller = nullptr; virtual void SetupPlayerInputComponent(class UInputComponent* input) {} };
class UCharacterMovementComponent : public UActorComponent { public: double MaxWalkSpeed = 600; double JumpZVelocity = 420; bool IsFalling() const { return false; } };
class ACharacter : public APawn {
 public:
  using Super = ACharacter;
  UCharacterMovementComponent Movement;
  int32 JumpCount = 0;
  UCharacterMovementComponent* GetCharacterMovement() { return &Movement; }
  virtual void Jump() { JumpCount++; }
  virtual void StopJumping() {}
  void AddMovementInput(const FVector& dir, double scale = 1.0) { Location += dir * scale; }
};
class AGameModeBase : public AActor { public: using Super = AGameModeBase; };
class AController : public AActor {};
class APlayerController : public AController { public: bool bShowMouseCursor = false; };

// ---------- Input (Enhanced Input) ----------
class UInputAction : public UObject {};
class UInputMappingContext : public UObject {};
struct FInputActionValue { FVector2D V; template <class T> T Get() const; };
template <> inline FVector2D FInputActionValue::Get<FVector2D>() const { return V; }
template <> inline bool FInputActionValue::Get<bool>() const { return V.X != 0; }
template <> inline float FInputActionValue::Get<float>() const { return (float)V.X; }
enum class ETriggerEvent { Started, Triggered, Ongoing, Completed, Canceled };
class UInputComponent : public UActorComponent {};
class UEnhancedInputComponent : public UInputComponent {
 public:
  // As in Unreal, the class comes from the object only, so a parent's
  // function (&ACharacter::Jump) binds to a child object (this).
  template <class T> void BindAction(const UInputAction* a, ETriggerEvent e, T* obj, std::type_identity_t<void (T::*)(const FInputActionValue&)> fn) {}
  template <class T> void BindAction(const UInputAction* a, ETriggerEvent e, T* obj, std::type_identity_t<void (T::*)()> fn) {}
};

// ---------- World, engine, statics ----------
class UWorld : public UObject {
 public:
  FTimerManager Timers;
  double Seconds = 0;
  std::vector<AActor*> Actors;
  template <class T> T* SpawnActor(const TSubclassOf<T>& cls, const FVector& loc, const FRotator& rot) {
    if (!cls) return nullptr;
    T* a = cls.Make(); Place(a, loc, rot); return a;
  }
  template <class T> T* SpawnActor(const FVector& loc, const FRotator& rot) { T* a = new T(); Place(a, loc, rot); return a; }
  double GetTimeSeconds() const { return Seconds; }
  FTimerManager& GetTimerManager() { return Timers; }
  void Place(AActor* a, const FVector& loc, const FRotator& rot);
};
namespace UEStub { inline UWorld* TheWorld = new UWorld(); inline int32 Spawned = 0; }
inline UWorld* UObject::GetWorld() const { return UEStub::TheWorld; }
inline FTimerManager& AActor::GetWorldTimerManager() const { return UEStub::TheWorld->Timers; }
inline bool AActor::Destroy() { if (!bDestroyed) { bDestroyed = true; EndPlay(EEndPlayReason::Destroyed); UEStub::TheWorld->Timers.ClearAllTimersForObject(this); } return true; }
inline void UWorld::Place(AActor* a, const FVector& loc, const FRotator& rot) {
  a->Location = loc; a->Rotation = rot; Actors.push_back(a); a->BeginPlay();
}
class UEngine { public: void AddOnScreenDebugMessage(int32 key, float time, FColor color, const FString& msg) { std::printf("%s\n", *msg); } };
inline UEngine* GEngine = new UEngine();
class UGameplayStatics {
 public:
  static void OpenLevel(const UObject* ctx, FName level) { std::printf("LogLoad: opening %s\n", level.S.c_str()); }
  static APawn* GetPlayerPawn(const UObject* ctx, int32 index) { for (auto* a : UEStub::TheWorld->Actors) if (auto* p = dynamic_cast<APawn*>(a)) return p; return nullptr; }
  static void PlaySoundAtLocation(const UObject* ctx, USoundBase* s, FVector at) {}
  static void SetGamePaused(const UObject* ctx, bool b) {}
};
class UDataAsset : public UObject {};
class UPrimaryDataAsset : public UDataAsset {};
class UUserWidget : public UObject { public: void AddToViewport() {} void RemoveFromParent() {} };
class UTextBlock : public UObject { public: FText Text; void SetText(const FText& t) { Text = t; } };
class UProgressBar : public UObject { public: float Percent = 0; void SetPercent(float p) { Percent = p; } };

// ---------- The test's play loop ----------
namespace UEStub {
template <class T> T* Spawn(FVector at = FVector()) { T* a = new T(); static_cast<UObject*>(a)->ObjName = "Actor_" + std::to_string(Spawned++); TheWorld->Place(a, at, FRotator()); return a; }
// Make builds an actor without starting it, so a test can fill in what a
// designer would set in the Details panel; Begin then places it and runs
// BeginPlay, as the level does when play starts.
template <class T> T* Make() { T* a = new T(); static_cast<UObject*>(a)->ObjName = "Actor_" + std::to_string(Spawned++); return a; }
inline void Begin(AActor* a, FVector at = FVector()) { TheWorld->Place(a, at, FRotator()); }
inline void Run(int frames, double dt) {
  for (int f = 1; f <= frames; f++) {
    TheWorld->Seconds += dt;
    auto live = TheWorld->Actors;
    for (auto* a : live) {
      if (a->bDestroyed) continue;
      if (a->PrimaryActorTick.bCanEverTick) a->Tick((float)dt);
      for (auto* c : a->Components) c->TickComponent((float)dt, LEVELTICK_All, nullptr);
    }
    TheWorld->Timers.Advance(TheWorld->Seconds);
  }
}
// Fires the overlap Unreal would send when Other walks into Actor's
// first primitive component (and the actor-level notify).
inline void Overlap(AActor* actor, AActor* other) {
  for (auto* c : actor->Components)
    if (auto* p = dynamic_cast<UPrimitiveComponent*>(c)) { p->OnComponentBeginOverlap.Broadcast(p, other, nullptr, 0, false, FHitResult()); break; }
  actor->NotifyActorBeginOverlap(other);
}
}  // namespace UEStub
