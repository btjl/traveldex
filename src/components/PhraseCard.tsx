"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // ✅ Shadcn Card
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
    <Card>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800">{phrase}</p>
          <p className="text-sm text-slate-500">{translation}</p>
        </div>
        <Button
          variant="ghost"
          className="text-slate-500 hover:bg-slate-100"
          onClick={handlePlay}
        >
          <IoVolumeMediumOutline className="w-8 h-8" />
        </Button>
      </CardContent>
    </Card>
  );
}
