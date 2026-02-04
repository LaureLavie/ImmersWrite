

import type { Metadata } from "next";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: "Immers'Write — where words become worlds",
  description: "Un espace où la technologie IA devient un pont entre l'imagination et la matérialisation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}