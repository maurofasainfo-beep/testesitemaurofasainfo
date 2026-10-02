import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { frameBlend, readSamples } from "@/lib/particles";
import hero from "@/lib/hero-image.json";

describe("Real image particle data", () => {
  it("loads real RGB samples within the mobile particle budget", () => {
    const file = readFileSync("public/images/hero-particles.bin");
    const data = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
    const points = readSamples(data, 2900);
    expect(points.length).toBeLessThanOrEqual(2901);
    expect(points.length).toBeGreaterThan(2000);
    expect(new Set(points.map(p => p.color)).size).toBeGreaterThan(500);
    expect(points.every(p => p.x >= 0 && p.x < hero.sampleWidth && p.y >= 0 && p.y < hero.sampleHeight)).toBe(true);
  });
  it("rejects a truncated download instead of displaying corrupt coordinates", () => {
    expect(() => readSamples(new ArrayBuffer(9), 100)).toThrow();
  });
  it("gives the same pointer relaxation at 60 Hz and 120 Hz", () => {
    const advance = (hz: number) => { let value = 0; for (let i = 0; i < hz; i++) value += (1 - value) * frameBlend(1000 / hz, 160); return value; };
    expect(advance(60)).toBeCloseTo(advance(120), 10);
  });
});
