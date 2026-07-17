import type { Metadata } from "next";
import { Mali } from "next/font/google";
import "./globals.css";

const mali = Mali({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mali",
});

export const metadata: Metadata = {
  title: "สนุกเรียนรู้ — เกมการศึกษาสำหรับเด็ก",
  description: "รวมเกมการศึกษาสนุกๆ สำหรับเด็ก เล่นได้เลยไม่ต้องสมัคร",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${mali.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
