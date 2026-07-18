"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  generateRoundItems,
  getLevel,
  seasonDefs,
  seasonOrder,
  slotDefs,
  type ClothingItem,
  type LevelId,
  type Season,
  type Slot,
} from "./levels";
import Character from "./Character";
import { playClick, playCorrect, playPickup, playWin, playWrong } from "@/lib/sounds";

type DragState = {
  itemId: string;
  pointerId: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
} | null;

// ตำแหน่งวงกลมเป้าหมายรอบตัวละคร (absolute, สัมพันธ์กับกล่องตัวละคร)
const slotPosition: Record<Slot, string> = {
  head: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/3",
  body: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  feet: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3",
  accessory: "top-1/4 right-0 translate-x-1/2",
};

export default function GameBoard({
  levelId,
  onChangeLevel,
}: {
  levelId: LevelId;
  onChangeLevel: () => void;
}) {
  const level = useMemo(() => getLevel(levelId), [levelId]);

  const [seasonIndex, setSeasonIndex] = useState(0);
  const season: Season = seasonOrder[seasonIndex];

  const [items, setItems] = useState<ClothingItem[]>(() =>
    generateRoundItems(level, seasonOrder[0])
  );
  const [worn, setWorn] = useState<Partial<Record<Slot, ClothingItem>>>({});
  const [drag, setDrag] = useState<DragState>(null);
  const [hoverSlot, setHoverSlot] = useState<Slot | null>(null);
  const [wrongShakeId, setWrongShakeId] = useState<string | null>(null);

  const slotRefs = useRef<Partial<Record<Slot, HTMLDivElement | null>>>({});
  const hasPlayedWin = useRef(false);

  const totalForSeason = level.activeSlots.length;
  const wornCount = Object.keys(worn).length;
  const seasonComplete = wornCount === totalForSeason;
  const isLastSeason = seasonIndex === seasonOrder.length - 1;
  const allComplete = seasonComplete && isLastSeason;

  const startSeason = useCallback(
    (index: number) => {
      setSeasonIndex(index);
      setItems(generateRoundItems(level, seasonOrder[index]));
      setWorn({});
      setDrag(null);
      setHoverSlot(null);
    },
    [level]
  );

  // ฤดูนี้แต่งครบแล้วแต่ยังไม่ใช่ฤดูสุดท้าย → ไปฤดูถัดไปอัตโนมัติ
  useEffect(() => {
    if (!seasonComplete || isLastSeason) return;
    const timer = setTimeout(() => startSeason(seasonIndex + 1), 900);
    return () => clearTimeout(timer);
  }, [seasonComplete, isLastSeason, seasonIndex, startSeason]);

  useEffect(() => {
    if (allComplete && !hasPlayedWin.current) {
      hasPlayedWin.current = true;
      playWin();
    }
    if (!allComplete) hasPlayedWin.current = false;
  }, [allComplete]);

  function findSlotAt(clientX: number, clientY: number): Slot | null {
    for (const slot of level.activeSlots) {
      const el = slotRefs.current[slot];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return slot;
      }
    }
    return null;
  }

  function handlePointerDown(e: React.PointerEvent, item: ClothingItem) {
    if (drag) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    playPickup();
    setDrag({
      itemId: item.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      dy: 0,
    });
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!drag || drag.pointerId !== e.pointerId) return;
    setDrag({ ...drag, dx: e.clientX - drag.startX, dy: e.clientY - drag.startY });
    setHoverSlot(findSlotAt(e.clientX, e.clientY));
  }

  function handlePointerUp(e: React.PointerEvent, item: ClothingItem) {
    const landedSlot = findSlotAt(e.clientX, e.clientY);

    if (landedSlot === item.slot && item.season === season) {
      playCorrect();
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setWorn((prev) => ({ ...prev, [item.slot]: item }));
    } else if (landedSlot !== null) {
      // ลงตำแหน่งผิด (ฤดูผิด หรือใส่ผิดจุดบนตัว) — เด้งกลับ ไม่ลงโทษ ลองใหม่ได้เรื่อยๆ
      playWrong();
      setWrongShakeId(item.id);
      setTimeout(() => setWrongShakeId(null), 400);
    }
    // landedSlot === null: แค่ปล่อยกลางกระบะ ไม่ถือว่าผิด เด้งกลับเงียบๆ

    setDrag(null);
    setHoverSlot(null);
  }

  function handleReplay() {
    playClick();
    startSeason(0);
  }

  function handleChangeLevel() {
    playClick();
    onChangeLevel();
  }

  const seasonDef = seasonDefs[season];

  return (
    <div className="mt-6 flex w-full flex-col items-center gap-6">
      {/* ขั้นตอนฤดู */}
      <div className="flex items-center gap-3">
        {seasonOrder.map((s, i) => (
          <span
            key={s}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-xl
              transition-all sm:h-12 sm:w-12 sm:text-2xl ${
                i === seasonIndex
                  ? "scale-110 bg-white shadow-md ring-4 ring-purple-300"
                  : i < seasonIndex
                    ? "bg-white/70 opacity-70"
                    : "bg-white/40 opacity-40"
              }`}
            aria-hidden
          >
            {seasonDefs[s].emoji}
          </span>
        ))}
      </div>

      <p className="text-xl font-bold text-purple-700 sm:text-2xl">{seasonDef.name}</p>

      {/* progress */}
      <div className="flex w-full max-w-md flex-col items-center gap-2">
        <p className="text-lg font-semibold text-purple-600">
          แต่งแล้ว {wornCount} / {totalForSeason} ชิ้น
        </p>
        <div className="h-4 w-full overflow-hidden rounded-full bg-white shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
            style={{ width: `${(wornCount / totalForSeason) * 100}%` }}
          />
        </div>
      </div>

      {/* ตัวละคร + จุดแต่งตัว */}
      <div
        className={`flex w-full justify-center rounded-3xl bg-gradient-to-br p-8 transition-colors
          duration-500 sm:p-12 ${seasonDef.bgClass}`}
      >
        <div className="relative h-[260px] w-[220px]">
          <div className="absolute inset-x-0 top-5 flex justify-center">
            <Character size={180} />
          </div>
          {level.activeSlots.map((slot) => {
            const wornItem = worn[slot];
            const isHover = hoverSlot === slot;
            return (
              <div
                key={slot}
                ref={(el) => {
                  slotRefs.current[slot] = el;
                }}
                className={`absolute ${slotPosition[slot]} flex flex-col items-center gap-1`}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full border-4
                    border-dashed border-white bg-white/70 text-3xl shadow-md transition-all
                    sm:h-20 sm:w-20 sm:text-4xl ${
                      isHover ? "scale-110 border-solid border-purple-400 ring-4 ring-purple-300" : ""
                    } ${wornItem ? "animate-pop-in border-solid" : ""}`}
                >
                  {wornItem ? <span aria-hidden>{wornItem.emoji}</span> : null}
                </div>
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-purple-700 sm:text-sm">
                  {slotDefs[slot].label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* กระบะเสื้อผ้า */}
      <div className="flex min-h-[120px] w-full flex-wrap items-center justify-center gap-3 rounded-3xl bg-white/60 p-4 sm:min-h-[140px] sm:gap-4 sm:p-6">
        {items.map((item) => {
          const isDragging = drag?.itemId === item.id;
          return (
            <div
              key={item.id}
              role="button"
              aria-label={item.name}
              tabIndex={0}
              onPointerDown={(e) => handlePointerDown(e, item)}
              onPointerMove={handlePointerMove}
              onPointerUp={(e) => handlePointerUp(e, item)}
              onPointerCancel={() => {
                setDrag(null);
                setHoverSlot(null);
              }}
              className={`flex h-20 w-20 cursor-grab touch-none select-none flex-col
                items-center justify-center gap-1 rounded-2xl bg-white shadow-md
                transition-transform duration-300 ease-out active:cursor-grabbing
                sm:h-24 sm:w-24 ${wrongShakeId === item.id ? "animate-shake" : ""}`}
              style={
                isDragging
                  ? {
                      transform: `translate(${drag.dx}px, ${drag.dy}px)`,
                      transition: "none",
                      position: "relative",
                      zIndex: 50,
                    }
                  : undefined
              }
            >
              <span className="text-3xl sm:text-4xl" aria-hidden>
                {item.emoji}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 sm:text-xs">
                {item.name}
              </span>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-xl text-slate-400">ใส่ครบแล้ว เก่งมาก!</p>
        )}
      </div>

      {/* modal ฉลองจบด่าน */}
      {allComplete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-purple-900/40 p-6">
          <div className="animate-pop-in flex flex-col items-center gap-3 rounded-3xl bg-white p-10 text-center shadow-2xl">
            <span className="text-7xl" aria-hidden>
              🎉
            </span>
            <p className="text-3xl font-bold text-purple-700">เก่งมาก!</p>
            <p className="text-xl text-slate-500">แต่งตัวครบทุกฤดูแล้ว</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleReplay}
                className="touch-manipulation rounded-full bg-purple-500 px-6 py-3 text-lg
                  font-semibold text-white shadow-md transition hover:bg-purple-600
                  active:scale-95"
              >
                🔁 เล่นอีกครั้ง
              </button>
              <button
                type="button"
                onClick={handleChangeLevel}
                className="touch-manipulation rounded-full bg-white px-6 py-3 text-lg
                  font-semibold text-purple-700 shadow-md ring-2 ring-purple-200 transition
                  hover:shadow-lg active:scale-95"
              >
                ⭐ เปลี่ยนระดับ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
