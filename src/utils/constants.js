export const API_BASE_URL = 'http://localhost:5000/api/v1';

export const DEFAULT_VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
  speed: 1.0,
  pitch: 0.0,
  format: 'mp3',
};

export const SAMPLE_PROMPTS = [
  {
    title: '🎙️ Movie Trailer',
    category: 'Dramatic',
    text: 'In a world where intelligence evolves beyond human comprehension, one developer discovers the code that changes everything.',
  },
  {
    title: '🎧 Audiobook Narration',
    category: 'Storytelling',
    text: 'The night was unusually quiet as Eleanor stepped onto the cobblestone path. Rain glistened under the dim amber glow of the streetlights.',
  },
  {
    title: '🚀 Tech Product Launch',
    category: 'Commercial',
    text: 'Introducing Antigravity Audio: the next-generation neural text-to-speech platform designed for creators, developers, and storytellers worldwide.',
  },
  {
    title: '📻 Podcast Intro',
    category: 'Conversational',
    text: 'Welcome back to The Tech Horizon! Today we are diving deep into artificial intelligence, neural voice synthesis, and the future of audio creation.',
  },
];
