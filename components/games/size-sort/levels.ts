// ข้อมูลชนิดของ, ระดับความยาก และตัวสุ่มโจทย์สำหรับเกมเรียงขนาด
// แนวคิด: สุ่มของ "ชนิดเดียว" มาต่อรอบ (เช่น ช้าง) แล้วแสดงหลายขนาดของชนิดนั้น
// ไม่ใช้ของต่างชนิดปนกัน เพื่อไม่ให้เด็กสับสนว่ากำลังเทียบขนาดอะไรกับอะไร

export type ItemTheme = "animal" | "food" | "object";

export type ItemTypeDef = {
  id: string;
  theme: ItemTheme;
  emoji: string;
  name: string; // ชื่อภาษาไทย
};

// คละ 3 ธีมรวมกันเป็น pool เดียว สุ่มเลือกทีละชนิดต่อรอบ
export const itemTypes: ItemTypeDef[] = [
  // สัตว์
  { id: "elephant", theme: "animal", emoji: "🐘", name: "ช้าง" },
  { id: "dog", theme: "animal", emoji: "🐕", name: "หมา" },
  { id: "cat", theme: "animal", emoji: "🐈", name: "แมว" },
  { id: "fish", theme: "animal", emoji: "🐟", name: "ปลา" },
  { id: "bird", theme: "animal", emoji: "🐦", name: "นก" },
  { id: "butterfly", theme: "animal", emoji: "🦋", name: "ผีเสื้อ" },
  { id: "frog", theme: "animal", emoji: "🐸", name: "กบ" },
  { id: "turtle", theme: "animal", emoji: "🐢", name: "เต่า" },
  // ผลไม้ / อาหาร
  { id: "apple", theme: "food", emoji: "🍎", name: "แอปเปิล" },
  { id: "banana", theme: "food", emoji: "🍌", name: "กล้วย" },
  { id: "watermelon", theme: "food", emoji: "🍉", name: "แตงโม" },
  { id: "pineapple", theme: "food", emoji: "🍍", name: "สับปะรด" },
  { id: "grapes", theme: "food", emoji: "🍇", name: "องุ่น" },
  { id: "strawberry", theme: "food", emoji: "🍓", name: "สตรอว์เบอร์รี" },
  { id: "carrot", theme: "food", emoji: "🥕", name: "แครอท" },
  { id: "cookie", theme: "food", emoji: "🍪", name: "คุกกี้" },
  // ของใช้ / ยานพาหนะ
  { id: "ball", theme: "object", emoji: "⚽", name: "ลูกบอล" },
  { id: "umbrella", theme: "object", emoji: "☂️", name: "ร่ม" },
  { id: "clock", theme: "object", emoji: "🕐", name: "นาฬิกา" },
  { id: "cup", theme: "object", emoji: "🥤", name: "แก้วน้ำ" },
  { id: "book", theme: "object", emoji: "📖", name: "หนังสือ" },
  { id: "car", theme: "object", emoji: "🚗", name: "รถยนต์" },
  { id: "train", theme: "object", emoji: "🚂", name: "รถไฟ" },
  { id: "airplane", theme: "object", emoji: "✈️", name: "เครื่องบิน" },
];

export type LevelId = "easy" | "medium" | "hard";
export type Direction = "asc" | "desc"; // asc = เล็ก→ใหญ่, desc = ใหญ่→เล็ก

export type LevelConfig = {
  id: LevelId;
  label: string;
  stars: number;
  pieceCount: number;
  // อัตราส่วนขนาดที่เพิ่มขึ้นต่อขั้น (0.45 = ขั้นถัดไปใหญ่กว่า 45%) ยิ่งมากยิ่งสังเกตง่าย
  sizeGapRatio: number;
  // true = สุ่มทิศทางเล็ก→ใหญ่ หรือ ใหญ่→เล็กในแต่ละรอบ (มีลูกศร/ป้ายบอกทิศชัดเจน)
  randomDirection: boolean;
};

export const levels: LevelConfig[] = [
  {
    id: "easy",
    label: "ง่าย",
    stars: 1,
    pieceCount: 3,
    sizeGapRatio: 0.45,
    randomDirection: false,
  },
  {
    id: "medium",
    label: "กลาง",
    stars: 2,
    pieceCount: 4,
    sizeGapRatio: 0.3,
    randomDirection: false,
  },
  {
    id: "hard",
    label: "ยาก",
    stars: 3,
    pieceCount: 5,
    sizeGapRatio: 0.22,
    randomDirection: true,
  },
];

export function getLevel(id: LevelId): LevelConfig {
  const level = levels.find((l) => l.id === id);
  if (!level) throw new Error(`ไม่พบระดับ: ${id}`);
  return level;
}

/** ชิ้นของหนึ่งชิ้นในรอบนั้นๆ — sizeIndex 0 = เล็กสุด, มากสุด = ใหญ่สุด (ไม่ขึ้นกับทิศทางที่แสดง) */
export type SizePiece = {
  id: string;
  itemTypeId: string;
  emoji: string;
  sizeIndex: number;
  scale: number; // ขนาดสัมพัทธ์ 1 = เล็กสุด
};

export type Round = {
  itemType: ItemTypeDef;
  direction: Direction;
  /** ชิ้นของเรียงแบบสุ่มตำแหน่ง ไว้แสดงในถาดให้ลาก */
  pieces: SizePiece[];
  /** ลำดับ piece id ที่ถูกต้องจากช่องซ้ายสุดไปขวาสุด (ตามทิศทางของรอบนี้) */
  slotOrder: string[];
};

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** สุ่มโจทย์ใหม่หนึ่งรอบ: เลือกชนิดของ 1 ชนิด + สร้างขนาดไล่ระดับตาม pieceCount */
export function generateRound(level: LevelConfig): Round {
  const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];

  const pieces: SizePiece[] = Array.from({ length: level.pieceCount }, (_, i) => ({
    id: `${itemType.id}-${i}`,
    itemTypeId: itemType.id,
    emoji: itemType.emoji,
    sizeIndex: i,
    scale: Math.pow(1 + level.sizeGapRatio, i),
  }));

  const direction: Direction = level.randomDirection
    ? Math.random() < 0.5
      ? "asc"
      : "desc"
    : "asc";

  const orderedForSlots = direction === "asc" ? pieces : [...pieces].reverse();

  return {
    itemType,
    direction,
    pieces: shuffle(pieces),
    slotOrder: orderedForSlots.map((p) => p.id),
  };
}
