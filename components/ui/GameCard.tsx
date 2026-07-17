"use client";

import Link from "next/link";
import type { GameInfo } from "@/lib/games";
import { playClick } from "@/lib/sounds";

export default function GameCard({ game }: { game: GameInfo }) {
  return (
    <Link
      href={game.href}
      onClick={() => playClick()}
      className="touch-manipulation flex flex-col items-center gap-3 rounded-3xl bg-white p-8
        shadow-lg ring-4 ring-transparent transition hover:-translate-y-1 hover:shadow-xl
        hover:ring-purple-300 active:scale-95"
    >
      <span className="text-7xl" aria-hidden>
        {game.emoji}
      </span>
      <span className="text-2xl font-semibold text-purple-800">
        {game.title}
      </span>
      <span className="text-center text-lg text-slate-500">
        {game.description}
      </span>
    </Link>
  );
}
