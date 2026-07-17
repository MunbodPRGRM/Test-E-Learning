"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  colorDefs,
  generateItems,
  getLevel,
  type ColorId,
  type GameItem,
  type LevelId,
} from "./levels";
import ShapeIcon from "./ShapeIcon";
import { playClick, playCorrect, playPickup, playWin, playWrong } from "@/lib/sounds";

type DragState = {
  itemId: string;
  pointerId: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
} | null;

function emptyPlaced(colorIds: ColorId[]): Record<ColorId, GameItem[]> {
  const entries = colorIds.map((c): [ColorId, GameItem[]] => [c, []]);
  return Object.fromEntries(entries) as Record<ColorId, GameItem[]>;
}

export default function GameBoard({
  levelId,
  onChangeLevel,
}: {
  levelId: LevelId;
  onChangeLevel: () => void;
}) {
  const level = useMemo(() => getLevel(levelId), [levelId]);
  const [items, setItems] = useState<GameItem[]>(() => generateItems(level));
  const [placed, setPlaced] = useState<Record<ColorId, GameItem[]>>(() =>
    emptyPlaced(level.colorIds)
  );
  const [drag, setDrag] = useState<DragState>(null);
  const [hoverBin, setHoverBin] = useState<ColorId | null>(null);
  const [wrongShakeId, setWrongShakeId] = useState<string | null>(null);

  const binRefs = useRef<Partial<Record<ColorId, HTMLDivElement | null>>>({});
  const hasPlayedWin = useRef(false);

  const totalCount = level.itemsPerColor * level.colorIds.length;
  const placedCount = totalCount - items.length;
  const won = items.length === 0;

  useEffect(() => {
    if (won && !hasPlayedWin.current) {
      hasPlayedWin.current = true;
      playWin();
    }
    if (!won) hasPlayedWin.current = false;
  }, [won]);

  function findBinAt(clientX: number, clientY: number): ColorId | null {
    for (const colorId of level.colorIds) {
      const el = binRefs.current[colorId];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return colorId;
      }
    }
    return null;
  }

  function handlePointerDown(e: React.PointerEvent, item: GameItem) {
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
    setHoverBin(findBinAt(e.clientX, e.clientY));
  }

  function handlePointerUp(e: React.PointerEvent, item: GameItem) {
    const landedColor = findBinAt(e.clientX, e.clientY);

    if (landedColor === item.colorId) {
      playCorrect();
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setPlaced((prev) => ({ ...prev, [item.colorId]: [...prev[item.colorId], item] }));
    } else if (landedColor !== null) {
      // ลงกล่องสีผิด — เด้งกลับ ไม่ลงโทษ ลองใหม่ได้เรื่อยๆ
      playWrong();
      setWrongShakeId(item.id);
      setTimeout(() => setWrongShakeId(null), 400);
    }
    // landedColor === null: แค่ปล่อยกลางกระบะ ไม่ถือว่าผิด เด้งกลับเงียบๆ

    setDrag(null);
    setHoverBin(null);
  }

  function handleReplay() {
    playClick();
    setItems(generateItems(level));
    setPlaced(emptyPlaced(level.colorIds));
    setDrag(null);
    setHoverBin(null);
  }

  function handleChangeLevel() {
    playClick();
    onChangeLevel();
  }

  return (
    <div className="mt-6 flex w-full flex-col items-center gap-8">
      {/* progress */}
      <div className="flex w-full max-w-md flex-col items-center gap-2">
        <p className="text-lg font-semibold text-purple-600">
          จัดแล้ว {placedCount} / {totalCount} ชิ้น
        </p>
        <div className="h-4 w-full overflow-hidden rounded-full bg-white shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
            style={{ width: `${(placedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* กระบะชิ้นของ */}
      <div className="flex min-h-[140px] w-full flex-wrap items-center justify-center gap-3 rounded-3xl bg-white/60 p-4 sm:min-h-[160px] sm:gap-4 sm:p-6">
        {items.map((item) => {
          const isDragging = drag?.itemId === item.id;
          return (
            <div
              key={item.id}
              role="button"
              aria-label={colorDefs[item.colorId].name}
              tabIndex={0}
              onPointerDown={(e) => handlePointerDown(e, item)}
              onPointerMove={handlePointerMove}
              onPointerUp={(e) => handlePointerUp(e, item)}
              onPointerCancel={() => {
                setDrag(null);
                setHoverBin(null);
              }}
              className={`flex h-20 w-20 cursor-grab touch-none select-none items-center
                justify-center transition-transform duration-300 ease-out active:cursor-grabbing
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
              <ShapeIcon shape={item.shape} color={colorDefs[item.colorId].hex} size={60} />
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-xl text-slate-400">ลากของทั้งหมดแล้ว เก่งมาก!</p>
        )}
      </div>

      {/* กล่องสี */}
      <div className="flex w-full flex-wrap justify-center gap-3 sm:gap-4">
        {level.colorIds.map((colorId) => {
          const def = colorDefs[colorId];
          const isHover = hoverBin === colorId;
          return (
            <div
              key={colorId}
              ref={(el) => {
                binRefs.current[colorId] = el;
              }}
              className={`flex min-h-[120px] min-w-[110px] flex-1 flex-col items-center
                gap-2 rounded-3xl p-3 transition-all sm:min-h-[140px] sm:min-w-[140px] sm:p-4
                ${def.bgSoft} ${isHover ? `${def.ring} ring-8 scale-105` : ""}`}
            >
              <span className="text-base font-bold sm:text-xl" style={{ color: def.hex }}>
                {def.name}
              </span>
              <div className="flex flex-wrap justify-center gap-1">
                {placed[colorId].map((p) => (
                  <ShapeIcon key={p.id} shape={p.shape} color={def.hex} size={24} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* modal ฉลองจบด่าน */}
      {won && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-purple-900/40 p-6">
          <div className="animate-pop-in flex flex-col items-center gap-3 rounded-3xl bg-white p-10 text-center shadow-2xl">
            <span className="text-7xl" aria-hidden>
              🎉
            </span>
            <p className="text-3xl font-bold text-purple-700">เก่งมาก!</p>
            <p className="text-xl text-slate-500">จัดครบทุกสีแล้ว</p>
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
