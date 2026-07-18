// ข้อมูลฤดู, เสื้อผ้า, ระดับความยาก และตัวสุ่มชุดของสำหรับเกมแต่งตัวตามฤดู

export type Season = "summer" | "rainy" | "winter";

export type SeasonDef = {
  id: Season;
  name: string; // ชื่อฤดูภาษาไทย
  emoji: string;
  bgClass: string; // tailwind gradient พื้นหลังกระดานตอนอยู่ฤดูนี้
};

export const seasonOrder: Season[] = ["summer", "rainy", "winter"];

export const seasonDefs: Record<Season, SeasonDef> = {
  summer: {
    id: "summer",
    name: "ฤดูร้อน",
    emoji: "🌞",
    bgClass: "from-yellow-100 via-orange-50 to-amber-100",
  },
  rainy: {
    id: "rainy",
    name: "ฤดูฝน",
    emoji: "🌧️",
    bgClass: "from-slate-200 via-blue-50 to-sky-100",
  },
  winter: {
    id: "winter",
    name: "ฤดูหนาว",
    emoji: "❄️",
    bgClass: "from-sky-100 via-indigo-50 to-blue-100",
  },
};

export type Slot = "head" | "body" | "feet" | "accessory";

export type SlotDef = { id: Slot; label: string };

export const slotDefs: Record<Slot, SlotDef> = {
  head: { id: "head", label: "หัว" },
  body: { id: "body", label: "ตัว" },
  feet: { id: "feet", label: "เท้า" },
  accessory: { id: "accessory", label: "ของเสริม" },
};

export type ClothingItem = {
  id: string;
  season: Season;
  slot: Slot;
  name: string; // ชื่อเสื้อผ้าภาษาไทย
};

// id ต้องตรงกับ art ใน ClothingLayers.tsx (รูปวาด SVG ของแต่ละชิ้น)
/** เสื้อผ้าทั้งหมดในเกม 4 ชิ้นต่อฤดู (head/body/feet/accessory) */
export const clothingItems: ClothingItem[] = [
  { id: "summer-head", season: "summer", slot: "head", name: "หมวกปีกกว้าง" },
  { id: "summer-body", season: "summer", slot: "body", name: "เสื้อยืด" },
  { id: "summer-feet", season: "summer", slot: "feet", name: "รองเท้าแตะ" },
  { id: "summer-accessory", season: "summer", slot: "accessory", name: "แว่นกันแดด" },

  { id: "rainy-head", season: "rainy", slot: "head", name: "หมวกกันฝน" },
  { id: "rainy-body", season: "rainy", slot: "body", name: "เสื้อกันฝน" },
  { id: "rainy-feet", season: "rainy", slot: "feet", name: "รองเท้าบูท" },
  { id: "rainy-accessory", season: "rainy", slot: "accessory", name: "ร่ม" },

  { id: "winter-head", season: "winter", slot: "head", name: "หมวกไหมพรม" },
  { id: "winter-body", season: "winter", slot: "body", name: "เสื้อกันหนาว" },
  { id: "winter-feet", season: "winter", slot: "feet", name: "บูทกันหนาว" },
  { id: "winter-accessory", season: "winter", slot: "accessory", name: "ผ้าพันคอ" },
];

export type LevelId = "easy" | "medium" | "hard";
type DecoyStrategy = "random" | "close";

export type LevelConfig = {
  id: LevelId;
  label: string;
  stars: number;
  activeSlots: Slot[];
  decoyCount: number;
  // "close" = พยายามเลือกตัวหลอกที่เป็นตำแหน่งเดียวกับของจริง (เช่น รองเท้าบูทฤดูหนาว
  // มาหลอกตอนฤดูฝน) ให้เด็กต้องสังเกตให้ดีขึ้น ไม่ใช่แค่จำหมวดกว้างๆ
  decoyStrategy: DecoyStrategy;
};

export const levels: LevelConfig[] = [
  {
    id: "easy",
    label: "ง่าย",
    stars: 1,
    activeSlots: ["body", "feet"],
    decoyCount: 1,
    decoyStrategy: "random",
  },
  {
    id: "medium",
    label: "กลาง",
    stars: 2,
    activeSlots: ["head", "body", "feet"],
    decoyCount: 2,
    decoyStrategy: "random",
  },
  {
    id: "hard",
    label: "ยาก",
    stars: 3,
    activeSlots: ["head", "body", "feet", "accessory"],
    decoyCount: 3,
    decoyStrategy: "close",
  },
];

export function getLevel(id: LevelId): LevelConfig {
  const level = levels.find((l) => l.id === id);
  if (!level) throw new Error(`ไม่พบระดับ: ${id}`);
  return level;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function itemsFor(season: Season, slots: Slot[]): ClothingItem[] {
  return clothingItems.filter((item) => item.season === season && slots.includes(item.slot));
}

/** สร้างชุดชิ้นของในกระบะสำหรับฤดูหนึ่งๆ = ของจริงครบตาม activeSlots + ตัวหลอกจากฤดูอื่น */
export function generateRoundItems(level: LevelConfig, season: Season): ClothingItem[] {
  const correct = itemsFor(season, level.activeSlots);
  const otherSeasonItems = clothingItems.filter((item) => item.season !== season);

  let decoyPool = otherSeasonItems;
  if (level.decoyStrategy === "close") {
    const sameSlotItems = otherSeasonItems.filter((item) => level.activeSlots.includes(item.slot));
    if (sameSlotItems.length >= level.decoyCount) decoyPool = sameSlotItems;
  }

  const decoys = shuffle(decoyPool).slice(0, level.decoyCount);
  return shuffle([...correct, ...decoys]);
}
