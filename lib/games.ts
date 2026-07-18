// Registry กลางของเกมทั้งหมด — เพิ่มเกมใหม่ = เพิ่ม entry ที่นี่
// แล้วสร้างหน้าใต้ app/games/<id>/ กับ component ใต้ components/games/<id>/

export type GameInfo = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  href: string;
  available: boolean;
};

export const games: GameInfo[] = [
  {
    id: "color-sort",
    title: "จัดหมวดหมู่สี",
    description: "ลากสิ่งของไปใส่กล่องสีเดียวกันให้ถูกต้อง",
    emoji: "🎨",
    href: "/games/color-sort",
    available: true,
  },
  {
    id: "season-dress",
    title: "แต่งตัวตามฤดู",
    description: "ลากเสื้อผ้าให้ถูกฤดู แต่งให้น้องพร้อมออกไปเล่น",
    emoji: "👕",
    href: "/games/season-dress",
    available: true,
  },
  {
    id: "size-sort",
    title: "เรียงขนาด",
    description: "ลากของแต่ละชิ้นไปเรียงจากเล็กไปใหญ่ให้ถูกช่อง",
    emoji: "📏",
    href: "/games/size-sort",
    available: true,
  },
];
