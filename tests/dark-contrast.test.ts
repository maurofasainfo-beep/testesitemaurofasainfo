import { expect, it } from "vitest";
const rgb = (hex: string) => hex.match(/\w\w/g)!.map(value => parseInt(value, 16));
const blend = (foreground: number[], background: number[], alpha: number) => foreground.map((value, i) => value * alpha + background[i] * (1 - alpha));
const luminance = (color: number[]) => color.map(value => { const v = value / 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0);
const contrast = (a: number[], b: number[]) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x,y) => y-x); return (hi+.05)/(lo+.05); };
it("keeps brand-derived accents and translucent text at AA on the actual dark surfaces", () => {
  const dark = rgb("0e0a14"), white = rgb("ffffff"), purple = rgb("8000bb");
  for (const alpha of [.7, .75, .78]) expect(contrast(blend(white, dark, alpha), dark)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(white, purple)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(blend(white, purple, .8), purple)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(rgb("eadcff"), purple)).toBeGreaterThanOrEqual(4.5);
  for (const accent of ["d6a6f2", "eadcff", "c9becf"]) {
    const surface = blend(rgb(accent), rgb("1c1722"), .09);
    expect(contrast(rgb(accent), surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(blend(white, surface, .78), surface)).toBeGreaterThanOrEqual(4.5);
  }
});
