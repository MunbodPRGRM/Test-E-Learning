// ข้อมูลสี, ระดับความยาก, และตัวสร้างชิ้นของสำหรับเกมจัดหมวดหมู่สี

export type ColorId =
  | "red"
  | "blue"
  | "yellow"
  | "green"
  | "purple"
  | "orange"
  | "pink";

export type ColorDef = {
  id: ColorId;
  name: string; // ชื่อสีภาษาไทย
  hex: string; // สีจริงสำหรับระบาย SVG ของชิ้นของ
  bg: string; // tailwind class สีพื้นเข้ม (สวอตช์ตัวอย่างสี)
  bgSoft: string; // tailwind class สีพื้นอ่อน (พื้นหลังกล่อง)
  ring: string; // tailwind class สี ring ตอน drag ชิ้นของอยู่เหนือกล่องนี้
};

export const colorDefs: Record<ColorId, ColorDef> = {
  red: { id: "red", name: "แดง", hex: "#ef4444", bg: "bg-red-500", bgSoft: "bg-red-100", ring: "ring-red-500" },
  blue: { id: "blue", name: "น้ำเงิน", hex: "#3b82f6", bg: "bg-blue-500", bgSoft: "bg-blue-100", ring: "ring-blue-500" },
  yellow: { id: "yellow", name: "เหลือง", hex: "#facc15", bg: "bg-yellow-400", bgSoft: "bg-yellow-100", ring: "ring-yellow-400" },
  green: { id: "green", name: "เขียว", hex: "#22c55e", bg: "bg-green-500", bgSoft: "bg-green-100", ring: "ring-green-500" },
  purple: { id: "purple", name: "ม่วง", hex: "#a855f7", bg: "bg-purple-500", bgSoft: "bg-purple-100", ring: "ring-purple-500" },
  orange: { id: "orange", name: "ส้ม", hex: "#f97316", bg: "bg-orange-500", bgSoft: "bg-orange-100", ring: "ring-orange-500" },
  pink: { id: "pink", name: "ชมพู", hex: "#f472b6", bg: "bg-pink-400", bgSoft: "bg-pink-100", ring: "ring-pink-400" },
};

export type Shape = "circle" | "square" | "triangle" | "star" | "heart";

const shapes: Shape[] = ["circle", "square", "triangle", "star", "heart"];

export type LevelId = "easy" | "medium" | "hard";

export type LevelConfig = {
  id: LevelId;
  label: string;
  stars: number;
  colorIds: ColorId[];
  itemsPerColor: number;
};

export const levels: LevelConfig[] = [
  {
    id: "easy",
    label: "ง่าย",
    stars: 1,
    colorIds: ["red", "blue"],
    itemsPerColor: 2,
  },
  {
    id: "medium",
    label: "กลาง",
    stars: 2,
    colorIds: ["red", "blue", "yellow", "green"],
    itemsPerColor: 2,
  },
  {
    id: "hard",
    label: "ยาก",
    stars: 3,
    // เฉดสีใกล้กันโทนร้อน — ต้องสังเกตสีให้ดี ไม่ใช่แค่จำหมวดกว้างๆ
    colorIds: ["pink", "red", "orange", "purple"],
    itemsPerColor: 3,
  },
];

export function getLevel(id: LevelId): LevelConfig {
  const level = levels.find((l) => l.id === id);
  if (!level) throw new Error(`ไม่พบระดับ: ${id}`);
  return level;
}

export type GameItem = {
  id: string;
  colorId: ColorId;
  shape: Shape;
};

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** สร้างชุดชิ้นของสำหรับระดับหนึ่งๆ พร้อมสุ่มลำดับ ให้เล่นซ้ำแล้วไม่ซ้ำเดิมทุกรอบ */
export function generateItems(level: LevelConfig): GameItem[] {
  const items: GameItem[] = [];
  level.colorIds.forEach((colorId) => {
    for (let i = 0; i < level.itemsPerColor; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      items.push({ id: `${colorId}-${i}-${Math.random().toString(36).slice(2, 8)}`, colorId, shape });
    }
  });
  return shuffle(items);
}
