// src/components/PhraseCard.tsx
"use client";

import { useCallback } from "react";
import { IoVolumeMediumOutline } from "react-icons/io5";

interface PhraseCardProps {
  phrase: string;
  translation: string;
  translatedLocale: string;
  categorySlug: string;
  phraseKey: string;
}

export function PhraseCard({
  phrase,
  translation,
  translatedLocale,
  categorySlug,
  phraseKey,
}: PhraseCardProps) {
  const handlePlay = useCallback(() => {
    const audioPath = `/audio/${translatedLocale}/${categorySlug}/${phraseKey}.wav`;
    const audio = new Audio(audioPath);
    audio.play().catch((err) => {
      console.error("Error playing audio:", err);
    });
  }, [translatedLocale, categorySlug, phraseKey]);

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div>
        <p className="font-semibold text-slate-800">{phrase}</p>
        <p className="text-sm text-slate-500">{translation}</p>
      </div>
      <button
        onClick={handlePlay}
        className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
      >
        <IoVolumeMediumOutline className="w-6 h-6" />
      </button>
    </div>
  );
}
