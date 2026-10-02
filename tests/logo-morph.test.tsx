import { readFileSync } from "node:fs";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ParticleMenu } from "@/components/ParticleMenu";
import logo from "@/lib/hero-logo.json";
import { dustPosition } from "@/lib/particles";

describe("Original logo and full-home particle field", () => {
  it("uses every exact logo coordinate from the original animation", () => {
    const source = readFileSync("original/assets/js/particulas.js", "utf8");
    const encoded = source.match(/const bytes = atob\('([^']+)'\)/)![1];
    const bytes = Buffer.from(encoded, "base64");
    expect(logo.points.length).toBe(bytes.length / 4);
    logo.points.forEach(([x,y], index) => {
      expect([x + 140, y + 12]).toEqual([bytes.readUInt16BE(index * 4), bytes.readUInt16BE(index * 4 + 2)]);
    });
  });
  it("serves the dotted logo before hydration or the menu-particle download", () => {
    const html = renderToString(<ParticleMenu />);
    expect(html).toContain('class="hero-logo"');
    expect(html).toContain('src="/images/hero-logo.svg"');
    expect(html).toContain('data-phase="logo"');
    const svg = readFileSync("public/images/hero-logo.svg", "utf8");
    expect(svg.match(/<rect /g)?.length).toBe(logo.points.length);
  });
  it.each([[1440, 900], [390, 1600]])("spreads dust across the entire %s x %s home", (width, height) => {
    const points = Array.from({length: 2000}, (_, i) => dustPosition(i + logo.points.length, width, height));
    // All four quarters receive particles, including the left text column.
    for (const side of [0, 1]) for (const vertical of [0, 1]) {
      expect(points.filter(p => Number(p.x >= width / 2) === side && Number(p.y >= height / 2) === vertical).length).toBeGreaterThan(400);
    }
    expect(points.every(p => p.x >= 0 && p.x <= width && p.y >= 0 && p.y <= height)).toBe(true);
    expect(Math.min(...points.map(p => p.x))).toBeLessThan(12);
    expect(Math.max(...points.map(p => p.x))).toBeGreaterThan(width - 12);
  });
});
