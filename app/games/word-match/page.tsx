"use client";

import { useState } from "react";
import Link from "next/link";
import LevelSelect from "@/components/games/word-match/LevelSelect";
import GameBoard from "@/components/games/word-match/GameBoard";
import type { LevelId } from "@/components/games/word-match/levels";
import { playClick } from "@/lib/sounds";

export default function WordMatchPage() {
  const [levelId, setLevelId] = useState<LevelId | null>(null);

  return (
    <main className="mx-auto flex min-h-dvh max-w-4xl flex-col items-center px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex w-full items-center justify-between gap-2">
        {levelId ? (
          <button
            type="button"
            onClick={() => {
              playClick();
              setLevelId(null);
            }}
            className="touch-manipulation shrink-0 rounded-full bg-white px-4 py-2 text-base
              font-semibold text-purple-700 shadow-md transition hover:shadow-lg
              active:scale-95 sm:px-6 sm:py-3 sm:text-xl"
          >
            ⬅ เปลี่ยนระดับ
          </button>
        ) : (
          <Link
            href="/"
            onClick={() => playClick()}
            className="touch-manipulation shrink-0 rounded-full bg-white px-4 py-2 text-base
              font-semibold text-purple-700 shadow-md transition hover:shadow-lg
              active:scale-95 sm:px-6 sm:py-3 sm:text-xl"
          >
            ⬅ กลับ
          </Link>
        )}
        <h1 className="text-xl font-bold text-purple-700 sm:text-3xl">
          🔤 เลือกคำให้ตรงกับภาพ
        </h1>
        <div className="w-16 shrink-0 sm:w-24" aria-hidden />
      </div>

      {levelId ? (
        <GameBoard levelId={levelId} onChangeLevel={() => setLevelId(null)} />
      ) : (
        <LevelSelect onSelect={setLevelId} />
      )}
    </main>
  );
}
