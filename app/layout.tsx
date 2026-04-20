import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "TUNOT — Notenverteilungen für Informatik",
  description: "Notenverteilungen, Dozenten und Bewertungen für Informatikkurse der TU Darmstadt.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-paper">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
        <footer className="mt-16 border-t-2 border-tu-green">
          <div className="mx-auto max-w-7xl px-6 py-6 font-sans text-xs text-muted flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/impressum" className="hover:underline underline-offset-4">Impressum</Link>
            <Link href="/kontakt" className="hover:underline underline-offset-4">Kontakt</Link>
            <span className="ml-auto">TUNOT · Studentisches Projekt · Angaben ohne Gewähr</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
