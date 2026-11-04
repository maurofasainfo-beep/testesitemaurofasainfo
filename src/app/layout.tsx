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
  description: "Menu10 reúne pedidos do balcão e do delivery no mesmo sistema. Caixa, cardápio digital, cozinha, entregas e relatórios, sem comissão por pedido.",
  openGraph: { title: "Menu10 — Balcão e delivery no mesmo sistema", description: "Pedidos locais e online no mesmo caixa, com cardápio digital, cozinha, entregas e relatórios. Sem comissão por pedido.", locale: "pt_BR", type: "website" },
};
export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body className={inter.variable}>{children}</body></html>;
}
