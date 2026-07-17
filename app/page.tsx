import GameCard from "@/components/ui/GameCard";
import { games } from "@/lib/games";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center px-6 py-12">
      <h1 className="text-center text-4xl font-bold text-purple-700 sm:text-5xl">
        🌈 สนุกเรียนรู้
      </h1>
      <p className="mt-3 text-center text-xl text-slate-500">
        เลือกเกมที่อยากเล่นได้เลย!
      </p>

      <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games
          .filter((g) => g.available)
          .map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
      </div>
    </main>
  );
}
