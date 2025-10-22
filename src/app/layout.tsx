import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Providers from "@/components/Providers";   // <-- keep import here, at top

export const metadata: Metadata = {
  title: "Kinddit",
  description: "A safer, transparent social space",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
