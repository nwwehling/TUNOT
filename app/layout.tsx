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
        <main className="mx-auto max-w-screen-2xl px-8 py-12">{children}</main>
        <footer className="mt-20 border-t border-rule">
          <div className="mx-auto max-w-screen-2xl px-8 py-8 font-sans text-xs text-muted flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/impressum" className="hover:text-ink hover:underline underline-offset-4 transition-colors">Impressum</Link>
            <Link href="/kontakt" className="hover:text-ink hover:underline underline-offset-4 transition-colors">Kontakt</Link>
            <span className="ml-auto">TUNOT · Studentisches Projekt · Angaben ohne Gewähr</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
