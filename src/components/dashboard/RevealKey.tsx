"use client";

import { useState } from "react";
import { KeyRound, Check, Copy } from "lucide-react";

export default function RevealKey({ gameName, fakeKey }: { gameName: string, fakeKey: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fakeKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 bg-[#121212] p-3 rounded border border-[#2a2a2a] flex items-center justify-between">
      <div className="flex items-center gap-3 overflow-hidden">
        <KeyRound className="text-[#FF6600] flex-shrink-0" w-5 h-5 />
        {revealed ? (
          <span className="font-mono text-green-400 font-bold tracking-widest text-sm md:text-base truncate">
            {fakeKey}
          </span>
        ) : (
          <span className="font-mono text-gray-500 tracking-widest flex items-center gap-2 text-sm md:text-base">
            ••••-••••-••••-••••
          </span>
        )}
      </div>

      <div className="flex-shrink-0 ml-2">
        {!revealed ? (
          <button 
            onClick={() => setRevealed(true)}
            className="text-xs bg-[#2a2a2a] hover:bg-[#FF6600] text-white px-3 py-1.5 rounded font-bold transition-colors"
          >
            Revelar
          </button>
        ) : (
          <button 
            onClick={handleCopy}
            className="text-xs bg-green-500/20 hover:bg-green-500/40 text-green-500 border border-green-500 px-3 py-1.5 rounded font-bold transition-colors flex items-center gap-1"
          >
            {copied ? <><Check className="w-3 h-3"/> Copiado</> : <><Copy className="w-3 h-3"/> Copiar</>}
          </button>
        )}
      </div>
    </div>
  );
}