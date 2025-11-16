import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Providers from "@/components/Providers";   // <-- keep import here, at top
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Breakthrough - AGI Coordination Platform",
  description: "A 3D web platform for 7 billion people to coordinate global AGI development through autonomous governance. Built on the 7 Immutable Laws.",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Breakthrough",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ServiceWorkerRegistration />
          {children}
        </Providers>
      </body>
    </html>
  );
}
