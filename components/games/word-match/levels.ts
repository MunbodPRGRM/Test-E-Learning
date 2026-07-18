// คลังคำศัพท์ ระดับความยาก และตัวสุ่มโจทย์สำหรับเกมเลือกคำให้ตรงกับภาพ
// คำสะกดผิดทุกคำ "เขียนมือ" ทั้งหมด อิงจุดพลาดจริงของเด็กไทย (ร/ล ควบกล้ำ,
// วรรณยุกต์เอก/โท/ตรี, ไม้ม้วน/ไม้มลาย, ตัวสะกด ด/ต ส/ด ณ/น ญ/ย, ห นำ, ลืม ร)
// — ห้าม generate คำผิดอัตโนมัติ เพราะอักขรวิธีไทยละเอียดเกินกว่าจะสุ่มได้ปลอดภัย

export type WordDef = {
  id: string;
  emoji: string;
  /** คำสะกดถูก */
  text: string;
  /**
   * คำสะกดผิด 3 แบบต่อคำ ใช้เป็นตัวลวงระดับกลาง/ยาก
   * บางตัวบังเอิญเป็นคำไทยจริง (เช่น ช่าง, ล่ม, ขาว, ข่าว) — ตั้งใจและปลอดภัย
   * เพราะโจทย์คือ "คำไหนตรงกับภาพ" คำอื่นที่สะกดถูกก็ยังผิดสำหรับภาพนั้นชัดเจน
   * และเป็นคู่วรรณยุกต์ที่เด็กต้องหัดแยกพอดี
   */
  misspellings: [string, string, string];
};

export const wordBank: WordDef[] = [
  { id: "pineapple", emoji: "🍍", text: "สับปะรด", misspellings: ["สัปปะรด", "สับปะรส", "สัประรด"] },
  { id: "butterfly", emoji: "🦋", text: "ผีเสื้อ", misspellings: ["ผีเสือ", "ผีเสื่อ", "พีเสื้อ"] },
  { id: "rabbit", emoji: "🐰", text: "กระต่าย", misspellings: ["กะต่าย", "กระตาย", "กระด่าย"] },
  { id: "elephant", emoji: "🐘", text: "ช้าง", misspellings: ["ชาง", "ช่าง", "ฉ้าง"] },
  { id: "book", emoji: "📖", text: "หนังสือ", misspellings: ["หนังสื่อ", "นังสือ", "หนั่งสือ"] },
  { id: "shoes", emoji: "👟", text: "รองเท้า", misspellings: ["ลองเท้า", "รองเทา", "รองเท่า"] },
  { id: "chicken", emoji: "🐔", text: "ไก่", misspellings: ["ใก่", "ไก", "ไก้"] },
  { id: "doll", emoji: "🧸", text: "ตุ๊กตา", misspellings: ["ตุกตา", "ตุ้กตา", "ตุ๊กะตา"] },
  { id: "sea", emoji: "🌊", text: "ทะเล", misspellings: ["ทะเร", "ทเล", "ทะแล"] },
  { id: "bicycle", emoji: "🚲", text: "จักรยาน", misspellings: ["จักยาน", "จักรยาณ", "จักรญาน"] },
  { id: "door", emoji: "🚪", text: "ประตู", misspellings: ["ปะตู", "ประดู", "ประตุ"] },
  { id: "school", emoji: "🏫", text: "โรงเรียน", misspellings: ["โรงเลียน", "โรงเรียณ", "โลงเรียน"] },
  { id: "banana", emoji: "🍌", text: "กล้วย", misspellings: ["กล่วย", "กร้วย", "กลัวย"] },
  { id: "umbrella", emoji: "☂️", text: "ร่ม", misspellings: ["ล่ม", "รม", "ร้ม"] },
  { id: "watermelon", emoji: "🍉", text: "แตงโม", misspellings: ["แตงโมง", "แดงโม", "แตงโม้"] },
  { id: "fish", emoji: "🐟", text: "ปลา", misspellings: ["ปรา", "ปา", "ปล่า"] },
  { id: "flower", emoji: "🌼", text: "ดอกไม้", misspellings: ["ดอกไม", "ดอกใม้", "ดกไม้"] },
  { id: "rice", emoji: "🍚", text: "ข้าว", misspellings: ["ขาว", "ข่าว", "ค้าว"] },
];

export type LevelId = "easy" | "medium" | "hard";

export type LevelConfig = {
  id: LevelId;
  label: string;
  stars: number;
  /** จำนวนตัวเลือกทั้งหมดต่อข้อ (รวมคำถูก) */
  choiceCount: number;
  /** จำนวนตัวลวงที่เป็นคำสะกดผิด — ที่เหลือเติมด้วยคำอื่นที่สะกดถูก */
  misspellingCount: number;
  /** ข้อความอธิบายบนการ์ดเลือกระดับ */
  hint: string;
};

// กลาง = สะกดผิด 1 + คำอื่น 1 เป็นสะพานเชื่อม: เด็กตัดคำผิดความหมายก่อน
// (ทักษะจากระดับง่าย) แล้วเหลือคู่ถูก-ผิดให้แยก (เตรียมเข้าระดับยาก)
export const levels: LevelConfig[] = [
  {
    id: "easy",
    label: "ง่าย",
    stars: 1,
    choiceCount: 2,
    misspellingCount: 0,
    hint: "2 ตัวเลือก • คำต่างกันชัดเจน",
  },
  {
    id: "medium",
    label: "กลาง",
    stars: 2,
    choiceCount: 3,
    misspellingCount: 1,
    hint: "3 ตัวเลือก • มีคำสะกดผิดปนมา",
  },
  {
    id: "hard",
    label: "ยาก",
    stars: 3,
    choiceCount: 4,
    misspellingCount: 3,
    hint: "4 ตัวเลือก • สะกดคล้ายกันมาก",
  },
];

export function getLevel(id: LevelId): LevelConfig {
  const level = levels.find((l) => l.id === id);
  if (!level) throw new Error(`ไม่พบระดับ: ${id}`);
  return level;
}

export const QUESTIONS_PER_ROUND = 8;

export type Question = {
  word: WordDef;
  /** ตัวเลือกทั้งหมดสลับตำแหน่งแล้ว — คำถูกคือตัวที่ === word.text */
  options: string[];
};

export type Round = {
  questions: Question[];
};

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** สุ่มโจทย์ใหม่หนึ่งรอบ: เลือกคำไม่ซ้ำกัน แล้วประกอบตัวเลือกตามสูตรของระดับ */
export function generateRound(level: LevelConfig): Round {
  const words = shuffle(wordBank).slice(0, QUESTIONS_PER_ROUND);

  const questions = words.map((word) => {
    const misspelled = shuffle([...word.misspellings]).slice(0, level.misspellingCount);

    // ตัวลวงที่เป็นคำอื่น: กันคำที่ขึ้นต้นอักษรเดียวกับคำถูก
    // เพื่อไม่ให้ระดับง่าย (ที่เด็กยังอ่านไม่คล่อง) เจอคู่คำหน้าตาคล้ายกันโดยบังเอิญ
    const otherCount = level.choiceCount - 1 - level.misspellingCount;
    const others = shuffle(
      wordBank.filter((w) => w.id !== word.id && w.text[0] !== word.text[0])
    )
      .slice(0, otherCount)
      .map((w) => w.text);

    return { word, options: shuffle([word.text, ...misspelled, ...others]) };
  });

  return { questions };
}
