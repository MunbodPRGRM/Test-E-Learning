import Link from "next/link";

export default function ColorSortPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-4xl flex-col items-center px-6 py-10">
      <div className="flex w-full items-center justify-between">
        <Link
          href="/"
          className="rounded-full bg-white px-6 py-3 text-xl font-semibold text-purple-700
            shadow-md transition hover:shadow-lg active:scale-95"
        >
          ⬅ กลับ
        </Link>
        <h1 className="text-3xl font-bold text-purple-700">🎨 จัดหมวดหมู่สี</h1>
        <div className="w-24" aria-hidden />
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <span className="text-8xl" aria-hidden>
          🚧
        </span>
        <p className="text-2xl text-slate-500">
          เกมกำลังอยู่ระหว่างการสร้าง เร็วๆ นี้!
        </p>
      </div>
    </main>
  );
}
