import React from 'react';

/**
 * Returns a fixed, consistent AI-style avatar URL based on voice gender & ID
 */
export const getVoiceAvatarUrl = (voice) => {
  if (!voice) return `https://api.dicebear.com/7.x/bottts/svg?seed=neural`;
  
  const gender = (voice.gender || 'neutral').toLowerCase();
  const voiceKey = (voice.id || voice.name || 'voice').toLowerCase().replace(/[^a-z0-9]/g, '');

  let style = 'bottts';
  if (gender.includes('fem') || gender === 'female') {
    style = 'lorelei';
  } else if (gender.includes('male') || gender === 'male') {
    style = 'micah';
  } else {
    style = 'bottts';
  }

  return `https://api.dicebear.com/7.x/${style}/svg?seed=${voiceKey}&backgroundColor=c9fdf2,b3ebf2`;
};

/**
 * Component for displaying fixed AI avatars for voices
 */
export const VoiceAvatar = ({ voice, className = "w-10 h-10 rounded-xl" }) => {
  const avatarUrl = getVoiceAvatarUrl(voice);
  const initial = voice?.name ? voice.name.charAt(0).toUpperCase() : 'V';

  return (
    <div className={`relative overflow-hidden bg-[#C9FDF2]/80 border border-[#85D1DB]/60 flex items-center justify-center font-bold shrink-0 shadow-2xs ${className}`}>
      <img
        src={avatarUrl}
        alt={voice?.name || 'Voice Avatar'}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        onError={(e) => {
          // Fallback to letter initial if image fails
          e.target.style.display = 'none';
        }}
      />
      <span className="text-[#084951] text-xs font-extrabold absolute pointer-events-none -z-10">
        {initial}
      </span>
    </div>
  );
};
