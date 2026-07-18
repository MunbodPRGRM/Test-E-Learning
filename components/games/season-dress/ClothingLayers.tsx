// งานศิลป์เสื้อผ้าทุกชิ้น วาดในพิกัดเดียวกับตัวละคร (viewBox 0 0 120 160 ใน Character.tsx)
// ชิ้นที่ใส่แล้วจึง render ทับตำแหน่งจริงบนตัวได้พอดี ส่วนกระบะใช้ art ชุดเดียวกัน
// แต่ crop ด้วย trayViewBox ให้เห็นเฉพาะชิ้นนั้นๆ

import type { ReactElement } from "react";

/** viewBox สำหรับ crop art แต่ละชิ้นตอนแสดงในกระบะ (กรอบพอดีชิ้น) */
export const trayViewBox: Record<string, string> = {
  "summer-head": "14 0 92 30",
  "rainy-head": "20 0 80 28",
  "winter-head": "22 0 76 46",
  "summer-body": "12 60 96 62",
  "rainy-body": "12 58 96 70",
  "winter-body": "12 56 96 72",
  "summer-feet": "31 144 58 16",
  "rainy-feet": "31 128 60 32",
  "winter-feet": "31 128 60 32",
  "summer-accessory": "26 32 68 20",
  // crop เน้นตัวร่ม (โชว์ก้านแค่ท่อนบน) ให้เห็นเป็นร่มชัดๆ ในกระบะ
  "rainy-accessory": "70 32 52 64",
  "winter-accessory": "36 56 48 50",
};

/** art ของเสื้อผ้าแต่ละชิ้น — ใช้ทั้งบนตัวละคร (เต็ม viewBox) และในกระบะ (crop) */
export function ClothingArt({ itemId }: { itemId: string }): ReactElement | null {
  switch (itemId) {
    // ── ฤดูร้อน ──
    case "summer-head": // หมวกปีกกว้าง
      return (
        <g>
          <ellipse cx="60" cy="18" rx="42" ry="9" fill="#f2c14e" />
          <path d="M40 18 C40 1 80 1 80 18 Z" fill="#f7d070" />
          <rect x="40" y="11" width="40" height="7" rx="3.5" fill="#e2564b" />
        </g>
      );
    case "summer-body": // เสื้อยืด
      return (
        <g>
          <rect x="14" y="70" width="22" height="26" rx="9" fill="#47b26b" />
          <rect x="84" y="70" width="22" height="26" rx="9" fill="#47b26b" />
          <rect x="28" y="66" width="64" height="52" rx="14" fill="#58c26e" />
          <path d="M48 67 Q60 76 72 67" fill="none" stroke="#3d9c59" strokeWidth="3" />
        </g>
      );
    case "summer-feet": // รองเท้าแตะ
      return (
        <g>
          <rect x="34" y="149" width="24" height="9" rx="4.5" fill="#ff8c42" />
          <path d="M46 150 L41 156 M46 150 L51 156" stroke="#d96c26" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="62" y="149" width="24" height="9" rx="4.5" fill="#ff8c42" />
          <path d="M74 150 L69 156 M74 150 L79 156" stroke="#d96c26" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case "summer-accessory": // แว่นกันแดด
      return (
        <g>
          <path d="M40 42 L30 38 M80 42 L90 38" stroke="#333652" strokeWidth="3" strokeLinecap="round" />
          <circle cx="48" cy="44" r="8" fill="#333652" />
          <circle cx="72" cy="44" r="8" fill="#333652" />
          <path d="M56 44 L64 44" stroke="#333652" strokeWidth="3" strokeLinecap="round" />
          <circle cx="45" cy="41" r="2.5" fill="#6b6f94" />
          <circle cx="69" cy="41" r="2.5" fill="#6b6f94" />
        </g>
      );

    // ── ฤดูฝน ──
    case "rainy-head": // หมวกกันฝน
      return (
        <g>
          <ellipse cx="60" cy="18" rx="38" ry="8" fill="#f0aa1c" />
          <path d="M40 18 C40 1 80 1 80 18 Z" fill="#ffc94d" />
          <path d="M42 12 L78 12" stroke="#e09b12" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "rainy-body": // เสื้อกันฝน
      return (
        <g>
          <rect x="14" y="70" width="22" height="48" rx="9" fill="#f0aa1c" />
          <rect x="84" y="70" width="22" height="48" rx="9" fill="#f0aa1c" />
          <rect x="26" y="64" width="68" height="60" rx="14" fill="#ffc94d" />
          <path d="M60 70 L60 124" stroke="#e09b12" strokeWidth="3" />
          <circle cx="52" cy="86" r="3" fill="#e09b12" />
          <circle cx="52" cy="104" r="3" fill="#e09b12" />
          <path d="M44 64 L60 74 L76 64" fill="none" stroke="#e09b12" strokeWidth="3" strokeLinejoin="round" />
        </g>
      );
    case "rainy-feet": // รองเท้าบูท
      return (
        <g>
          <rect x="34" y="132" width="22" height="24" rx="5" fill="#ffc94d" />
          <rect x="33" y="150" width="26" height="8" rx="4" fill="#f0aa1c" />
          <rect x="62" y="132" width="22" height="24" rx="5" fill="#ffc94d" />
          <rect x="61" y="150" width="26" height="8" rx="4" fill="#f0aa1c" />
        </g>
      );
    case "rainy-accessory": // ร่ม
      return (
        <g>
          <path d="M96 34 L96 42" stroke="#7a5c43" strokeWidth="3.5" strokeLinecap="round" />
          <path
            d="M74 64 Q96 34 118 64 Q112.5 57 107 64 Q101.5 57 96 64 Q90.5 57 85 64 Q79.5 57 74 64 Z"
            fill="#e2564b"
          />
          <path d="M96 44 Q84 48 77 62 M96 44 Q108 48 115 62" fill="none" stroke="#c94b41" strokeWidth="2" />
          <path d="M96 64 L96 122 Q96 130 88 128" stroke="#7a5c43" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </g>
      );

    // ── ฤดูหนาว ──
    case "winter-head": // หมวกไหมพรม
      return (
        <g>
          <circle cx="60" cy="8" r="6" fill="#fff" />
          <path d="M30 38 Q30 6 60 6 Q90 6 90 38 Z" fill="#5b8def" />
          <rect x="28" y="32" width="64" height="10" rx="5" fill="#3f6fd1" />
        </g>
      );
    case "winter-body": // เสื้อกันหนาว
      return (
        <g>
          <rect x="14" y="70" width="22" height="50" rx="9" fill="#c94b41" />
          <rect x="84" y="70" width="22" height="50" rx="9" fill="#c94b41" />
          <rect x="14" y="112" width="22" height="9" rx="4.5" fill="#f7e6d0" />
          <rect x="84" y="112" width="22" height="9" rx="4.5" fill="#f7e6d0" />
          <rect x="26" y="64" width="68" height="60" rx="16" fill="#e2564b" />
          <rect x="44" y="60" width="32" height="10" rx="5" fill="#f7e6d0" />
          <path d="M60 70 L60 124" stroke="#c94b41" strokeWidth="3" />
        </g>
      );
    case "winter-feet": // บูทกันหนาว
      return (
        <g>
          <rect x="34" y="132" width="22" height="24" rx="5" fill="#8b5e3c" />
          <rect x="33" y="150" width="26" height="8" rx="4" fill="#5d4532" />
          <rect x="34" y="131" width="22" height="7" rx="3.5" fill="#f7f3ea" />
          <rect x="62" y="132" width="22" height="24" rx="5" fill="#8b5e3c" />
          <rect x="61" y="150" width="26" height="8" rx="4" fill="#5d4532" />
          <rect x="62" y="131" width="22" height="7" rx="3.5" fill="#f7f3ea" />
        </g>
      );
    case "winter-accessory": // ผ้าพันคอ
      return (
        <g>
          <rect x="64" y="68" width="13" height="32" rx="6" fill="#f2789f" />
          <path d="M67 97 L67 103 M71 97 L71 103 M75 97 L75 103" stroke="#d95c86" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="40" y="60" width="40" height="13" rx="6.5" fill="#f2789f" />
          <path d="M48 62 L48 71 M58 62 L58 71 M68 62 L68 71" stroke="#d95c86" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );

    default:
      return null;
  }
}
