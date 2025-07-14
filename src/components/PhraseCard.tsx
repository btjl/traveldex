import { IoVolumeMediumOutline } from "react-icons/io5";

interface PhraseCardProps {
  phrase: string;
  translation: string;
}

export function PhraseCard({ phrase, translation }: PhraseCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div>
        <p className="font-semibold text-slate-800">{phrase}</p>
        <p className="text-sm text-slate-500">{translation}</p>
      </div>
      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
        <IoVolumeMediumOutline className="w-6 h-6" />
      </button>
    </div>
  );
}