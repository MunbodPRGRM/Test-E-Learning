# สนุกเรียนรู้ 🌈

เว็บสื่อการเรียนรู้สำหรับเด็ก — รวมเกมการศึกษาไว้ในเว็บเดียว เปิดแล้วเล่นได้ทันที
ไม่ต้องสมัครสมาชิก ไม่มี database

เกมปัจจุบัน:

- 🎨 **จัดหมวดหมู่สี** — ลากสิ่งของไปใส่กล่องสีเดียวกัน (กำลังพัฒนา)

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS v3
- ฟอนต์ [Mali](https://fonts.google.com/specimen/Mali) (ไทย ทรงกลม เหมาะกับเด็ก)
- เสียงเอฟเฟกต์สังเคราะห์ด้วย Web Audio API — ไม่มีไฟล์เสียง
- ลากวางเขียนเองด้วย Pointer Events — รองรับทั้งเมาส์และจอสัมผัส

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

เปิด http://localhost:3000

## Scripts

| คำสั่ง          | ทำอะไร                    |
| --------------- | ------------------------- |
| `npm run dev`   | รัน dev server            |
| `npm run build` | สร้าง production build    |
| `npm run start` | รัน production server     |
| `npm run lint`  | ตรวจ lint                 |

## โครงสร้างโปรเจกต์

```
app/
  page.tsx                # หน้าแรก = game hub
  games/color-sort/       # หน้าเกมจัดหมวดหมู่สี
components/
  games/color-sort/       # component เฉพาะเกม
  ui/                     # component ใช้ร่วม
lib/
  games.ts                # registry รายชื่อเกมทั้งหมด
  sounds.ts               # Web Audio helper
```

การเพิ่มเกมใหม่: เพิ่ม entry ใน `lib/games.ts` แล้วสร้างหน้าใต้ `app/games/<id>/`
— หน้า hub ดึงรายชื่อจาก registry อัตโนมัติ
