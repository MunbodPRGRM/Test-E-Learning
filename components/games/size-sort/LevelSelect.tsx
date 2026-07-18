"use client";

import { levels, type LevelConfig, type LevelId } from "./levels";
import { playClick } from "@/lib/sounds";

const PREVIEW_BASE_PX = 14;

function LevelPreview({ level }: { level: LevelConfig }) {
  return (
    <div className="flex items-end gap-1.5" aria-hidden>
      {Array.from({ length: level.pieceCount }, (_, i) => {
        const scale = Math.pow(1 + level.sizeGapRatio, i);
        const size = PREVIEW_BASE_PX * scale;
        return (
          <span
            key={i}
            className="rounded-full bg-purple-300"
            style={{ width: size, height: size }}
          />
        );
      })}
    </div>
  );
}

export default function LevelSelect({
  onSelect,
}: {
  onSelect: (id: LevelId) => void;
}) {
  return (
    <div className="mt-10 flex flex-col items-center gap-5">
      <p className="text-2xl font-semibold text-purple-700">
        เลือกระดับความยาก
      </p>
      <div className="flex flex-col gap-5 sm:flex-row">
        {levels.map((level) => (
          <button
            key={level.id}
            type="button"
            onClick={() => {
              playClick();
              onSelect(level.id);
            }}
            className="touch-manipulation flex w-64 flex-col items-center gap-3 rounded-3xl
              bg-white px-6 py-8 shadow-lg ring-4 ring-transparent transition
              hover:-translate-y-1 hover:shadow-xl hover:ring-purple-300 active:scale-95"
          >
            <span className="text-3xl" aria-hidden>
              {"⭐".repeat(level.stars)}
            </span>
            <span className="text-2xl font-bold text-purple-800">
              {level.label}
            </span>
            <LevelPreview level={level} />
            <span className="text-base text-slate-500">
              {level.pieceCount} ชิ้น
              {level.randomDirection ? " • สลับทิศทาง" : ""}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
