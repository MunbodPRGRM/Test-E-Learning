"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { generateRound, getLevel, type LevelId, type Round, type SizePiece } from "./levels";
import { playClick, playCorrect, playPickup, playWin, playWrong } from "@/lib/sounds";

type DragState = {
  itemId: string;
  pointerId: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
} | null;

// scale เริ่มที่ 1 เสมอ (ชิ้นเล็กสุด) จึงตั้ง base = ขนาดที่ต้องการของชิ้นเล็กสุดได้ตรงๆ
// โดยไม่ต้องมี floor มาบีบ — floor เดิมทำให้ 2 ชิ้นแรกในระดับยากมีขนาดต่างกันแค่ 1px
const SLOT_BASE_PX = 64;
const TRAY_BASE_PX = 68;

function slotSizePx(scale: number): number {
  return Math.round(SLOT_BASE_PX * scale);
}

function trayContainerPx(scale: number): number {
  return Math.round(TRAY_BASE_PX * scale);
}

export default function GameBoard({
  levelId,
  onChangeLevel,
}: {
  levelId: LevelId;
  onChangeLevel: () => void;
}) {
  const level = useMemo(() => getLevel(levelId), [levelId]);
  const [round, setRound] = useState<Round>(() => generateRound(level));
  // slotIndex -> piece id ที่วางถูกแล้ว
  const [placed, setPlaced] = useState<Record<number, string>>({});
  const [drag, setDrag] = useState<DragState>(null);
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);
  const [wrongShakeId, setWrongShakeId] = useState<string | null>(null);

  const slotRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const hasPlayedWin = useRef(false);

  const piecesById = useMemo(
    () => Object.fromEntries(round.pieces.map((p) => [p.id, p])) as Record<string, SizePiece>,
    [round]
  );
  const placedIds = useMemo(() => new Set(Object.values(placed)), [placed]);
  const trayItems = round.pieces.filter((p) => !placedIds.has(p.id));

  const placedCount = Object.keys(placed).length;
  const won = placedCount === level.pieceCount;

  useEffect(() => {
    if (won && !hasPlayedWin.current) {
      hasPlayedWin.current = true;
      playWin();
    }
    if (!won) hasPlayedWin.current = false;
  }, [won]);

  function findSlotAt(clientX: number, clientY: number): number | null {
    for (let i = 0; i < level.pieceCount; i++) {
      const el = slotRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return i;
      }
    }
    return null;
  }

  function handlePointerDown(e: React.PointerEvent, piece: SizePiece) {
    if (drag) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    playPickup();
    setDrag({
      itemId: piece.id,
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

  function handlePointerUp(e: React.PointerEvent, piece: SizePiece) {
    const landedIndex = findSlotAt(e.clientX, e.clientY);

    if (
      landedIndex !== null &&
      placed[landedIndex] === undefined &&
      round.slotOrder[landedIndex] === piece.id
    ) {
      playCorrect();
      setPlaced((prev) => ({ ...prev, [landedIndex]: piece.id }));
    } else if (landedIndex !== null) {
      // ลงช่องผิดลำดับ หรือช่องมีคนอยู่แล้ว — เด้งกลับ ไม่ลงโทษ ลองใหม่ได้เรื่อยๆ
      playWrong();
      setWrongShakeId(piece.id);
      setTimeout(() => setWrongShakeId(null), 400);
    }
    // landedIndex === null: แค่ปล่อยกลางกระบะ ไม่ถือว่าผิด เด้งกลับเงียบๆ

    setDrag(null);
    setHoverSlot(null);
  }

  function handleReplay() {
    playClick();
    setRound(generateRound(level));
    setPlaced({});
    setDrag(null);
    setHoverSlot(null);
  }

  function handleChangeLevel() {
    playClick();
    onChangeLevel();
  }

  const fromLabel = round.direction === "asc" ? "เล็ก" : "ใหญ่";
  const toLabel = round.direction === "asc" ? "ใหญ่" : "เล็ก";

  return (
    <div className="mt-6 flex w-full flex-col items-center gap-6">
      {/* progress */}
      <div className="flex w-full max-w-md flex-col items-center gap-2">
        <p className="text-lg font-semibold text-purple-600">
          เรียง{round.itemType.name}แล้ว {placedCount} / {level.pieceCount} ชิ้น
        </p>
        <div className="h-4 w-full overflow-hidden rounded-full bg-white shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
            style={{ width: `${(placedCount / level.pieceCount) * 100}%` }}
          />
        </div>
      </div>

      {/* ทิศทางการเรียง */}
      <div className="flex items-center gap-3 rounded-full bg-white px-5 py-2 text-xl font-bold text-purple-700 shadow-md sm:text-2xl">
        <span>{fromLabel}</span>
        <span aria-hidden>➜</span>
        <span>{toLabel}</span>
      </div>

      {/* ช่องเรียงขนาด — ต้องเรียงแถวเดียวเสมอ (ไม่ตัดบรรทัด) ไม่งั้นตัวใบ้เรื่องขนาดช่องจะเสียความหมาย
          ถ้าจอแคบเกินให้เลื่อนแนวนอนแทน */}
      <div className="flex w-full items-end justify-start gap-3 overflow-x-auto rounded-3xl bg-white/60 p-4 sm:justify-center sm:gap-5 sm:p-8">
        {round.slotOrder.map((expectedId, i) => {
          const size = slotSizePx(piecesById[expectedId].scale);
          const placedId = placed[i];
          const placedPiece = placedId ? piecesById[placedId] : null;
          const isHover = hoverSlot === i && !placedPiece;
          return (
            <div
              key={i}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              className={`flex shrink-0 items-center justify-center rounded-2xl border-4
                border-dashed border-purple-200 bg-white/70 shadow-sm transition-all ${
                  isHover ? "scale-105 border-solid border-purple-400 ring-4 ring-purple-300" : ""
                }`}
              style={{ width: size, height: size }}
            >
              {placedPiece && (
                <span
                  className="animate-pop-in select-none"
                  style={{ fontSize: Math.round(size * 0.6) }}
                  aria-hidden
                >
                  {placedPiece.emoji}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ถาดของให้ลาก */}
      <div className="flex min-h-[120px] w-full flex-wrap items-center justify-center gap-3 rounded-3xl bg-white/60 p-4 sm:min-h-[140px] sm:gap-4 sm:p-6">
        {trayItems.map((piece) => {
          const isDragging = drag?.itemId === piece.id;
          const containerPx = trayContainerPx(piece.scale);
          return (
            <div
              key={piece.id}
              role="button"
              aria-label={`${round.itemType.name} ขนาดที่ ${piece.sizeIndex + 1}`}
              tabIndex={0}
              onPointerDown={(e) => handlePointerDown(e, piece)}
              onPointerMove={handlePointerMove}
              onPointerUp={(e) => handlePointerUp(e, piece)}
              onPointerCancel={() => {
                setDrag(null);
                setHoverSlot(null);
              }}
              className={`flex cursor-grab touch-none select-none items-center justify-center
                rounded-2xl bg-white shadow-md transition-transform duration-300 ease-out
                active:cursor-grabbing ${wrongShakeId === piece.id ? "animate-shake" : ""}`}
              style={
                isDragging
                  ? {
                      width: containerPx,
                      height: containerPx,
                      transform: `translate(${drag.dx}px, ${drag.dy}px)`,
                      transition: "none",
                      position: "relative",
                      zIndex: 50,
                    }
                  : { width: containerPx, height: containerPx }
              }
            >
              <span style={{ fontSize: Math.round(containerPx * 0.55) }} aria-hidden>
                {piece.emoji}
              </span>
            </div>
          );
        })}
        {trayItems.length === 0 && (
          <p className="text-xl text-slate-400">ลากของทั้งหมดแล้ว เก่งมาก!</p>
        )}
      </div>

      {/* modal ฉลองจบด่าน */}
      {won && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-purple-900/40 p-6">
          <div className="animate-pop-in flex flex-col items-center gap-3 rounded-3xl bg-white p-10 text-center shadow-2xl">
            <span className="text-7xl" aria-hidden>
              🎉
            </span>
            <p className="text-3xl font-bold text-purple-700">เก่งมาก!</p>
            <p className="text-xl text-slate-500">เรียงขนาดถูกต้องครบแล้ว</p>
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
