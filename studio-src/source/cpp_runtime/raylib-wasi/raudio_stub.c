// raylib audio stubs for the Web Studio C++ mode: sound is not available yet; every call is a safe no-op.
#include "raylib.h"
#include <string.h>
void InitAudioDevice(void) { }
void CloseAudioDevice(void) { }
bool IsAudioDeviceReady(void) { return false; }
void SetMasterVolume(float volume) { }
float GetMasterVolume(void) { return 0; }
Wave LoadWave(const char *fileName) { Wave r; memset(&r,0,sizeof r); return r; }
Wave LoadWaveFromMemory(const char *fileType, const unsigned char *fileData, int dataSize) { Wave r; memset(&r,0,sizeof r); return r; }
bool IsWaveValid(Wave wave) { return false; }
Sound LoadSound(const char *fileName) { Sound r; memset(&r,0,sizeof r); return r; }
Sound LoadSoundFromWave(Wave wave) { Sound r; memset(&r,0,sizeof r); return r; }
Sound LoadSoundAlias(Sound source) { Sound r; memset(&r,0,sizeof r); return r; }
bool IsSoundValid(Sound sound) { return false; }
void UpdateSound(Sound sound, const void *data, int sampleCount) { }
void UnloadWave(Wave wave) { }
void UnloadSound(Sound sound) { }
void UnloadSoundAlias(Sound alias) { }
bool ExportWave(Wave wave, const char *fileName) { return false; }
bool ExportWaveAsCode(Wave wave, const char *fileName) { return false; }
void PlaySound(Sound sound) { }
void StopSound(Sound sound) { }
void PauseSound(Sound sound) { }
void ResumeSound(Sound sound) { }
bool IsSoundPlaying(Sound sound) { return false; }
void SetSoundVolume(Sound sound, float volume) { }
void SetSoundPitch(Sound sound, float pitch) { }
void SetSoundPan(Sound sound, float pan) { }
Wave WaveCopy(Wave wave) { Wave r; memset(&r,0,sizeof r); return r; }
void WaveCrop(Wave *wave, int initFrame, int finalFrame) { }
void WaveFormat(Wave *wave, int sampleRate, int sampleSize, int channels) { }
float * LoadWaveSamples(Wave wave) { return 0; }
void UnloadWaveSamples(float *samples) { }
Music LoadMusicStream(const char *fileName) { Music r; memset(&r,0,sizeof r); return r; }
Music LoadMusicStreamFromMemory(const char *fileType, const unsigned char *data, int dataSize) { Music r; memset(&r,0,sizeof r); return r; }
bool IsMusicValid(Music music) { return false; }
void UnloadMusicStream(Music music) { }
void PlayMusicStream(Music music) { }
bool IsMusicStreamPlaying(Music music) { return false; }
void UpdateMusicStream(Music music) { }
void StopMusicStream(Music music) { }
void PauseMusicStream(Music music) { }
void ResumeMusicStream(Music music) { }
void SeekMusicStream(Music music, float position) { }
void SetMusicVolume(Music music, float volume) { }
void SetMusicPitch(Music music, float pitch) { }
void SetMusicPan(Music music, float pan) { }
float GetMusicTimeLength(Music music) { return 0; }
float GetMusicTimePlayed(Music music) { return 0; }
AudioStream LoadAudioStream(unsigned int sampleRate, unsigned int sampleSize, unsigned int channels) { AudioStream r; memset(&r,0,sizeof r); return r; }
bool IsAudioStreamValid(AudioStream stream) { return false; }
void UnloadAudioStream(AudioStream stream) { }
void UpdateAudioStream(AudioStream stream, const void *data, int frameCount) { }
bool IsAudioStreamProcessed(AudioStream stream) { return false; }
void PlayAudioStream(AudioStream stream) { }
void PauseAudioStream(AudioStream stream) { }
void ResumeAudioStream(AudioStream stream) { }
bool IsAudioStreamPlaying(AudioStream stream) { return false; }
void StopAudioStream(AudioStream stream) { }
void SetAudioStreamVolume(AudioStream stream, float volume) { }
void SetAudioStreamPitch(AudioStream stream, float pitch) { }
void SetAudioStreamPan(AudioStream stream, float pan) { }
void SetAudioStreamBufferSizeDefault(int size) { }
void SetAudioStreamCallback(AudioStream stream, AudioCallback callback) { }
void AttachAudioStreamProcessor(AudioStream stream, AudioCallback processor) { }
void DetachAudioStreamProcessor(AudioStream stream, AudioCallback processor) { }
void AttachAudioMixedProcessor(AudioCallback processor) { }
void DetachAudioMixedProcessor(AudioCallback processor) { }
