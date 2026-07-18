"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  generateRound,
  getLevel,
  QUESTIONS_PER_ROUND,
  type LevelId,
  type Round,
} from "./levels";
import { playClick, playCorrect, playWin, playWrong } from "@/lib/sounds";

const CORRECT_ADVANCE_MS = 900;
const WRONG_SHAKE_MS = 400;

export default function GameBoard({
  levelId,
  onChangeLevel,
}: {
  levelId: LevelId;
  onChangeLevel: () => void;
}) {
  const level = useMemo(() => getLevel(levelId), [levelId]);
  const [round, setRound] = useState<Round>(() => generateRound(level));
  const [questionIndex, setQuestionIndex] = useState(0);
  // "advancing" = เพิ่งตอบถูก กำลังโชว์ปุ่มเขียวก่อนเลื่อนข้อ — ล็อกทุกปุ่มไว้
  const [phase, setPhase] = useState<"answering" | "advancing">("answering");
  // ตัวเลือกผิดที่กดไปแล้วในข้อนี้ — หรี่+ปิดถาวรทั้งข้อ ให้เด็กเห็นว่าตัดอะไรไปแล้ว
  const [eliminated, setEliminated] = useState<Set<string>>(new Set());
  const [shakeOption, setShakeOption] = useState<string | null>(null);

  const hasPlayedWin = useRef(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const won = questionIndex >= QUESTIONS_PER_ROUND;
  const question = won ? null : round.questions[questionIndex];

  useEffect(() => {
    if (won && !hasPlayedWin.current) {
      hasPlayedWin.current = true;
      playWin();
    }
    if (!won) hasPlayedWin.current = false;
  }, [won]);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
    },
    []
  );

  function handleAnswer(option: string) {
    if (!question) return;
    // ล็อกช่วงเลื่อนข้อ + ช่วง shake (~400ms) กันเด็กกดรัวจนเสียง/อนิเมชันตีกัน
    if (phase === "advancing" || shakeOption !== null || eliminated.has(option)) return;

    if (option === question.word.text) {
      playCorrect();
      setPhase("advancing");
      advanceTimer.current = setTimeout(() => {
        setQuestionIndex((i) => i + 1);
        setEliminated(new Set());
        setShakeOption(null);
        setPhase("answering");
      }, CORRECT_ADVANCE_MS);
    } else {
      // ตอบผิดไม่ลงโทษ — เขย่าปุ่ม + เสียงเบาๆ แล้วหรี่ปุ่มนั้นทิ้งไว้ ลองใหม่ได้เรื่อยๆ
      playWrong();
      setShakeOption(option);
      shakeTimer.current = setTimeout(() => {
        setShakeOption(null);
        setEliminated((prev) => new Set(prev).add(option));
      }, WRONG_SHAKE_MS);
    }
  }

  function handleReplay() {
    playClick();
    setRound(generateRound(level));
    setQuestionIndex(0);
    setEliminated(new Set());
    setShakeOption(null);
    setPhase("answering");
  }

  function handleChangeLevel() {
    playClick();
    onChangeLevel();
  }

  return (
    <div className="mt-6 flex w-full flex-col items-center gap-6">
      {/* progress */}
      <div className="flex w-full max-w-md flex-col items-center gap-2">
        <p className="text-lg font-semibold text-purple-600">
          ข้อที่ {Math.min(questionIndex + 1, QUESTIONS_PER_ROUND)} /{" "}
          {QUESTIONS_PER_ROUND}
        </p>
        <div className="h-4 w-full overflow-hidden rounded-full bg-white shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
            style={{ width: `${(questionIndex / QUESTIONS_PER_ROUND) * 100}%` }}
          />
        </div>
      </div>

      {question && (
        <>
          {/* ภาพโจทย์ */}
          <div className="flex flex-col items-center rounded-3xl bg-white px-10 py-8 shadow-lg sm:px-16">
            {/* key ต่อคำ ให้อนิเมชัน pop-in เล่นใหม่ทุกครั้งที่เปลี่ยนข้อ */}
            <span
              key={question.word.id}
              className="animate-pop-in select-none text-8xl sm:text-9xl"
              aria-hidden
            >
              {question.word.emoji}
            </span>
          </div>

          {/* ปุ่มตัวเลือกคำ */}
          <div className="flex w-full max-w-md flex-col gap-3">
            {question.options.map((option) => {
              const isCorrectReveal =
                phase === "advancing" && option === question.word.text;
              const isShaking = shakeOption === option;
              const isEliminated = eliminated.has(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAnswer(option)}
                  disabled={isEliminated || phase === "advancing"}
                  className={`touch-manipulation rounded-full py-4 text-2xl font-bold
                    shadow-md transition sm:text-3xl ${
                      isCorrectReveal
                        ? "animate-pop-in bg-green-50 text-green-700 ring-4 ring-green-400"
                        : isShaking
                          ? "animate-shake bg-white text-purple-800 ring-4 ring-red-300"
                          : isEliminated
                            ? "bg-white text-purple-800 opacity-40"
                            : "bg-white text-purple-800 hover:shadow-lg active:scale-95"
                    }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* modal ฉลองจบรอบ */}
      {won && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-purple-900/40 p-6">
          <div className="animate-pop-in flex flex-col items-center gap-3 rounded-3xl bg-white p-10 text-center shadow-2xl">
            <span className="text-7xl" aria-hidden>
              🎉
            </span>
            <p className="text-3xl font-bold text-purple-700">เก่งมาก!</p>
            <p className="text-xl text-slate-500">
              ตอบถูกครบ {QUESTIONS_PER_ROUND} ข้อแล้ว
            </p>
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
