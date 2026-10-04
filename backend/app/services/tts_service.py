import io
import base64
from gtts import gTTS
from fastapi import HTTPException
from app.models.schemas import TTSRequest, TTSResponse, Language

class TTSService:
    def __init__(self):
        self._cache = {}

    def synthesize(self, req: TTSRequest) -> TTSResponse:
        cache_key = f"{req.language.value}:{req.text.strip()}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        # Map language codes for gTTS
        lang_code = "en"
        tld = "co.in"
        if req.language == Language.HI:
            lang_code = "hi"
            tld = "co.in"
        elif req.language == Language.BN:
            lang_code = "bn"
            tld = "com"

        try:
            tts = gTTS(text=req.text, lang=lang_code, tld=tld, slow=False)
            mp3_fp = io.BytesIO()
            tts.write_to_fp(mp3_fp)
            mp3_fp.seek(0)
            
            audio_bytes = mp3_fp.read()
            b64_audio = base64.b64encode(audio_bytes).decode("utf-8")
            
            res = TTSResponse(
                audio_base64=b64_audio,
                mime_type="audio/mp3",
                language=req.language.value
            )
            
            # Cache up to 50 items
            if len(self._cache) > 50:
                self._cache.clear()
            self._cache[cache_key] = res
            return res
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"TTS synthesis failed: {str(e)}"
            )

tts_service = TTSService()
