import { voiceApi } from '../api/voiceApi';
import { ttsApi } from '../api/ttsApi';

/**
 * Helper utility to provide distinct example text quotes and bulletproof audio previews for all voices
 */


const VOICE_SAMPLE_MAP = {
  // ElevenLabs Voices
  '21m00Tcm4TlvDq8ikWAM': {
    text: 'Hello! I am Rachel, offering calming and professional neural narration.',
    lang: 'en',
  },
  'AZnzlk1XvdvUeBnXmlld': {
    text: "Hey there! I am Domi, perfect for energetic and conversational audio.",
    lang: 'en',
  },
  'EXAVITQu4vr4xnSDxMaL': {
    text: 'Hello, I am Bella. I bring soft and warm tones to your audio.',
    lang: 'en',
  },
  'ErXwobaYiN019PkySvjV': {
    text: 'Greetings! I am Antoni, a deep storyteller for rich narration.',
    lang: 'en',
  },
  'MF3mGyEYCl7XYWbV9V6O': {
    text: 'Hi! I am Elli, crafted for emotional and expressive speech.',
    lang: 'en',
  },

  // OpenAI Voices
  'alloy': {
    text: 'Hello! I am Alloy, OpenAI versatile neutral AI voice.',
    lang: 'en',
  },
  'echo': {
    text: 'Hello! I am Echo, OpenAI warm male voice for podcasts and audiobooks.',
    lang: 'en',
  },
  'fable': {
    text: 'Greetings! I am Fable, an expressive British accent AI voice.',
    lang: 'en',
  },
  'onyx': {
    text: 'Hello, I am Onyx, OpenAI deep male voice with authoritative tone.',
    lang: 'en',
  },
  'nova': {
    text: 'Hi! I am Nova, an energetic and clear female voice.',
    lang: 'en',
  },
  'shimmer': {
    text: 'Hello! I am Shimmer, clear and bright female audio synthesis.',
    lang: 'en',
  },

  // Google English Voices
  'en-US-Neural2-F': {
    text: 'Hello, I am Google Neural American Female voice.',
    lang: 'en',
  },
  'en-US-Neural2-D': {
    text: 'Hello, I am Google Neural American Male voice.',
    lang: 'en',
  },
  'en-IN-Wavenet-A': {
    text: 'Namaste! I am the Wavenet Indian English female voice.',
    lang: 'en',
  },
  'en-IN-Wavenet-B': {
    text: 'Namaste! I am the Wavenet Indian English male voice.',
    lang: 'en',
  },
  'en-GB-Neural2-A': {
    text: 'Hello! I am the Neural British Female voice.',
    lang: 'en',
  },

  // Google Indian Languages Voices
  'hi-IN-Wavenet-A': {
    text: 'नमस्ते! मैं गूगल हिंदी वॉइस हूँ।',
    lang: 'hi',
  },
  'hi-IN-Wavenet-B': {
    text: 'नमस्ते! मैं गूगल हिंदी मेल वॉइस हूँ।',
    lang: 'hi',
  },
  'hi-IN-Neural2-C': {
    text: 'नमस्ते! मैं गूगल हिंदी न्यूरल वॉइस हूँ।',
    lang: 'hi',
  },
  'gu-IN-Standard-A': {
    text: 'નમસ્તે! હું ગુજરાતી ફિમેલ વોઇસ છું.',
    lang: 'gu',
  },
  'gu-IN-Standard-B': {
    text: 'નમસ્તે! હું ગુજરાતી મેલ વોઇસ છું.',
    lang: 'gu',
  },
  'mr-IN-Standard-A': {
    text: 'नमस्कार! मी मराठी फिमेल व्हॉइस आहे.',
    lang: 'mr',
  },
  'mr-IN-Standard-B': {
    text: 'नमस्कार! मी मराठी मेल व्हॉइस आहे.',
    lang: 'mr',
  },

  // Google International Voices
  'es-ES-Neural2-A': {
    text: '¡Hola! Soy la voz neuronal femenina en español.',
    lang: 'es',
  },
  'es-ES-Neural2-B': {
    text: '¡Hola! Soy la voz neuronal masculina en español.',
    lang: 'es',
  },
  'fr-FR-Neural2-A': {
    text: 'Bonjour! Je suis la voix neuronale en français.',
    lang: 'fr',
  },
  'fr-FR-Neural2-B': {
    text: 'Bonjour! Je suis la voix masculine en français.',
    lang: 'fr',
  },
  'de-DE-Neural2-A': {
    text: 'Hallo! Ich bin die neuronale deutsche Stimme.',
    lang: 'de',
  },
  'de-DE-Neural2-B': {
    text: 'Hallo! Ich bin die deutsche männliche Stimme.',
    lang: 'de',
  },
};

/**
 * Get distinct example text quote for a voice
 */
export function getVoiceSampleText(voice) {
  if (!voice) return 'Hello, welcome to NeuralVoice Studio!';
  if (VOICE_SAMPLE_MAP[voice.id]) {
    return VOICE_SAMPLE_MAP[voice.id].text;
  }
  return `Hello, I am ${voice.name || 'Neural Voice'}. Convert your scripts into natural speech.`;
}

let activeAudioElement = null;
let activeSpeechUtterance = null;

export function stopVoicePreview() {
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch (e) {
      console.warn('Audio pause warning:', e);
    }
    activeAudioElement = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('SpeechSynthesis cancel warning:', e);
    }
  }
  activeSpeechUtterance = null;
}

/**
 * Bulletproof voice preview playback function:
 * 1. Queries backend table cache / preview endpoint (/voices/preview) backed by `tts_voice_previews` table
 * 2. Tries valid external MP3 audio link if available
 * 3. Fallbacks to browser SpeechSynthesis API
 */
export async function playVoicePreview(voice, { onStart, onEnd, onError } = {}) {
  stopVoicePreview();

  const sampleText = getVoiceSampleText(voice);
  if (onStart) onStart();

  // Strategy 1: Check DB table `tts_voice_previews` via backend preview endpoint
  try {
    const res = await voiceApi.getVoicePreview({
      voiceId: voice.id,
      voiceName: voice.name,
      provider: voice.provider || 'google',
      sampleText,
    });

    if (res && res.success && res.data && res.data.audioUrl) {
      const audio = new Audio(res.data.audioUrl);
      activeAudioElement = audio;

      audio.onended = () => {
        activeAudioElement = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        activeAudioElement = null;
        playWebSpeechNative(voice, sampleText, onEnd, onError);
      };

      await audio.play();
      return;
    }
  } catch (err) {
    console.warn('Voice preview table endpoint lookup notice, checking external/speech fallback:', err);
  }

  // Strategy 2: Valid external preview MP3 URL
  if (voice.previewUrl && voice.previewUrl.startsWith('http') && !voice.previewUrl.includes('manifest') && !voice.previewUrl.includes('translate_tts')) {
    try {
      const audio = new Audio(voice.previewUrl);
      activeAudioElement = audio;

      audio.onended = () => {
        activeAudioElement = null;
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        activeAudioElement = null;
        playWebSpeechNative(voice, sampleText, onEnd, onError);
      };

      await audio.play();
      return;
    } catch (err) {
      console.warn('External preview playback notice, trying speech fallback:', err);
    }
  }

  // Strategy 3: Browser Native Web Speech Synthesis (100% reliable fallback)
  playWebSpeechNative(voice, sampleText, onEnd, onError);
}


function playWebSpeechNative(voice, sampleText, onEnd, onError) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sampleText);
    activeSpeechUtterance = utterance;

    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices && availableVoices.length > 0) {
      const langPrefix = voice.languageCode ? voice.languageCode.split('-')[0] : 'en';
      const matched = availableVoices.find(v => v.lang.toLowerCase().startsWith(langPrefix.toLowerCase())) || availableVoices[0];
      if (matched) utterance.voice = matched;
    }

    if (voice.gender === 'female') utterance.pitch = 1.25;
    else if (voice.gender === 'male') utterance.pitch = 0.85;
    else utterance.pitch = 1.0;

    utterance.onend = () => {
      activeSpeechUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Web Speech preview completed:', e);
      activeSpeechUtterance = null;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Web Speech error:', err);
    if (onEnd) onEnd();
  }
}
