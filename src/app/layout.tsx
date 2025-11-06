import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Providers from "@/components/Providers";   // <-- keep import here, at top

export const metadata: Metadata = {
  title: "Breakthrough - AGI Coordination Platform",
  description: "A 3D web platform for 7 billion people to coordinate global AGI development through autonomous governance. Built on the 7 Immutable Laws.",
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
