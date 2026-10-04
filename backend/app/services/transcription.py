import os
import io
import tempfile
import speech_recognition as sr
from pydub import AudioSegment
from fastapi import UploadFile, HTTPException
from app.config import settings
from app.models.schemas import TranscribeResponse

ALLOWED_EXTENSIONS = {".wav", ".mp3", ".m4a", ".webm", ".ogg", ".flac"}

class TranscriptionService:
    def __init__(self):
        self.recognizer = sr.Recognizer()

    def _convert_to_wav(self, input_path: str, output_path: str):
        # Using pydub to convert any audio container to standard 16kHz mono WAV
        sound = AudioSegment.from_file(input_path)
        sound = sound.set_channels(1).set_frame_rate(16000)
        sound.export(output_path, format="wav")

    async def transcribe_audio(self, file: UploadFile) -> TranscribeResponse:
        # 1. Validate file extension
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported audio format '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        # 2. Read contents and check size
        content = await file.read()
        file_size = len(content)
        max_bytes = settings.MAX_AUDIO_SIZE_MB * 1024 * 1024
        if file_size > max_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"File exceeds maximum allowed size of {settings.MAX_AUDIO_SIZE_MB}MB"
            )

        transcript = ""
        detected_lang = "en"
        is_fallback = False
        notes = None

        # Write to temporary file for safe, non-persistent processing
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as raw_temp:
            raw_temp_path = raw_temp.name
            raw_temp.write(content)

        wav_temp_path = raw_temp_path + ".wav"

        try:
            # Convert to standard WAV format
            try:
                self._convert_to_wav(raw_temp_path, wav_temp_path)
                target_audio_path = wav_temp_path
            except Exception as conv_err:
                # If conversion via ffmpeg/pydub is not supported, attempt direct wav load if already .wav
                if ext == ".wav":
                    target_audio_path = raw_temp_path
                else:
                    raise conv_err

            # Perform speech recognition
            with sr.AudioFile(target_audio_path) as source:
                audio_data = self.recognizer.record(source)
                
                # Attempt recognition across Hindi/English/Bengali
                try:
                    # Default attempt with Indian English / Hindi mix
                    transcript = self.recognizer.recognize_google(audio_data, language="en-IN")
                    detected_lang = "en"
                except sr.UnknownValueError:
                    try:
                        transcript = self.recognizer.recognize_google(audio_data, language="hi-IN")
                        detected_lang = "hi"
                    except sr.UnknownValueError:
                        try:
                            transcript = self.recognizer.recognize_google(audio_data, language="bn-IN")
                            detected_lang = "bn"
                        except sr.UnknownValueError:
                            transcript = ""
                            notes = "Audio speech could not be recognized clearly. Please verify the audio volume and clarity or enter text manually."
                            is_fallback = True
                except Exception as rec_err:
                    notes = f"Online speech recognition service unavailable ({str(rec_err)}). Please use manual text input."
                    is_fallback = True

        except Exception as e:
            # Never fabricate transcripts if processing fails
            notes = f"Audio processing error: {str(e)}. Please type or paste your message directly."
            is_fallback = True
            transcript = ""

        finally:
            # Clean up temporary audio files immediately for privacy compliance
            if not settings.ENABLE_AUDIO_STORAGE:
                if os.path.exists(raw_temp_path):
                    try:
                        os.remove(raw_temp_path)
                    except Exception:
                        pass
                if os.path.exists(wav_temp_path):
                    try:
                        os.remove(wav_temp_path)
                    except Exception:
                        pass

        return TranscribeResponse(
            transcript=transcript,
            detected_language=detected_lang,
            confidence=0.92 if transcript and not is_fallback else 0.0,
            file_name=file.filename,
            file_size_bytes=file_size,
            is_fallback_mode=is_fallback,
            notes=notes
        )

transcription_service = TranscriptionService()
