// ตัวละครพื้นฐานให้ลากเสื้อผ้ามาแต่ง — เสื้อผ้าที่ใส่แล้ว (prop worn) จะถูกวาดเป็น
// เลเยอร์ SVG ทับตัวในพิกัดเดียวกัน ทำให้เห็นตัวละครใส่ชิ้นนั้นจริงๆ

import { ClothingArt } from "./ClothingLayers";
import type { ClothingItem, Slot } from "./levels";

// ลำดับการวาดทับ: เสื้อทับขอบรองเท้า, หมวกทับผม, ของเสริม (แว่น/ผ้าพันคอ/ร่ม) บนสุด
const layerOrder: Slot[] = ["feet", "body", "head", "accessory"];

export default function Character({
  worn = {},
  size = 140,
}: {
  worn?: Partial<Record<Slot, ClothingItem>>;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 120 160"
      aria-hidden
    >
      {/* แขนสองข้าง */}
      <rect x="18" y="72" width="16" height="55" rx="8" fill="#ffd7ae" />
      <rect x="86" y="72" width="16" height="55" rx="8" fill="#ffd7ae" />
      {/* ขาสองข้าง */}
      <rect x="38" y="122" width="16" height="34" rx="8" fill="#ffd7ae" />
      <rect x="66" y="122" width="16" height="34" rx="8" fill="#ffd7ae" />
      {/* ตัว */}
      <rect x="30" y="66" width="60" height="62" rx="22" fill="#fff1e0" />
      {/* หัว */}
      <circle cx="60" cy="42" r="34" fill="#ffd7ae" />
      {/* ผม */}
      <path d="M26 40 C24 12 96 12 94 40 C90 22 30 22 26 40 Z" fill="#5b4636" />
      {/* หน้า */}
      <circle cx="48" cy="44" r="4" fill="#3b3355" />
      <circle cx="72" cy="44" r="4" fill="#3b3355" />
      <path
        d="M46 56 Q60 66 74 56"
        stroke="#3b3355"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="38" cy="52" r="5" fill="#ffb4a2" opacity="0.6" />
      <circle cx="82" cy="52" r="5" fill="#ffb4a2" opacity="0.6" />

      {/* เสื้อผ้าที่ใส่แล้ว */}
      {layerOrder.map((slot) => {
        const item = worn[slot];
        return item ? (
          <g key={slot} className="animate-pop-in" style={{ transformOrigin: "60px 80px" }}>
            <ClothingArt itemId={item.id} />
          </g>
        ) : null;
      })}
    </svg>
  );
}
