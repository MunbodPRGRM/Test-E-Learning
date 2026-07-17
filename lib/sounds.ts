// เสียงเอฟเฟกต์สังเคราะห์ด้วย Web Audio API — ไม่ต้องใช้ไฟล์เสียง
// เบราว์เซอร์อนุญาตให้เล่นเสียงหลัง user gesture แรกเท่านั้น
// ดังนั้นทุกฟังก์ชันต้องถูกเรียกจาก event handler (pointer/click) เสมอ

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    ctx = new AudioContext();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function tone(
  freq: number,
  startOffset: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15
) {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const start = audio.currentTime + startOffset;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration);
}

/** เสียงหยิบของ — บลิปสั้นเบาๆ */
export function playPickup() {
  tone(520, 0, 0.08, "sine", 0.08);
}

/** เสียงตอบถูก — ติ๊งสองโน้ตไล่ขึ้น */
export function playCorrect() {
  tone(660, 0, 0.12);
  tone(880, 0.1, 0.18);
}

/** เสียงตอบผิด — โน้ตต่ำเบาๆ ไม่น่ากลัว */
export function playWrong() {
  tone(220, 0, 0.2, "triangle", 0.1);
}

/** เสียงฉลองจบด่าน — arpeggio สั้นๆ */
export function playWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => tone(freq, i * 0.12, 0.25, "sine", 0.12));
}
