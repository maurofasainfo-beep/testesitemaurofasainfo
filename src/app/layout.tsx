import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import original from "@/lib/original-page.json";
import "./original.css";
import "./restoration.css";
import "./rhythm.css";
import "./editorial.css";

const inter = localFont({ src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", variable: "--font-inter", display: "swap", weight: "100 900" });

export const metadata: Metadata = {
  title: original.title,
  description: "Menu10: cardápio digital, Caixa, KDS, Retaguarda e relatórios em um só sistema. Integrações com iFood, 99Food, aiqfome e WhatsApp. Sem comissão por pedido.",
  openGraph: { title: "Menu10 — Seu delivery ganha forma", description: "Cardápio digital sem comissão por pedido. Cozinha, entregas, iFood, WhatsApp e nota fiscal num sistema só. Suporte em Cerquilho - SP.", locale: "pt_BR", type: "website" },
};
export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body className={inter.variable}>{children}</body></html>;
}
