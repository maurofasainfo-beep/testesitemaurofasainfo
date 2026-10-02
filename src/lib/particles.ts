export type Sample = { x: number; y: number; color: string; rgb: number[]; alpha: number; orbitX: number; orbitY: number; sin: number; cos: number };

export function readSamples(buffer: ArrayBuffer, limit: number): Sample[] {
  if (buffer.byteLength % 8 || limit < 1 || !Number.isFinite(limit)) throw new Error("Invalid particle data or budget");
  const bytes = new DataView(buffer);
  const count = buffer.byteLength / 8;
  const step = Math.max(1, count / limit);
  const result: Sample[] = [];
  for (let n = 0; n < count; n += step) {
    const i = Math.floor(n) * 8;
    const hash = Math.sin(Math.floor(n) * 127.1 + 311.7) * 43758.5453;
    const angle = (hash - Math.floor(hash)) * Math.PI * 2;
    const sin = Math.sin(angle), cos = Math.cos(angle);
    const radius = .22 + Math.floor(n) % 13 / 20;
    result.push({ x: bytes.getUint16(i, true), y: bytes.getUint16(i + 2, true), color: `rgb(${bytes.getUint8(i + 4)},${bytes.getUint8(i + 5)},${bytes.getUint8(i + 6)})`, rgb: [bytes.getUint8(i + 4), bytes.getUint8(i + 5), bytes.getUint8(i + 6)], alpha: bytes.getUint8(i + 7) / 255, orbitX: cos * radius, orbitY: sin * radius * .9, sin, cos });
  }
  return result;
}

export const easeOutCubic = (t: number) => 1 - (1 - Math.max(0, Math.min(1, t))) ** 3;

export function frameBlend(dt: number, timeConstant: number) {
  return 1 - Math.exp(-Math.max(0, dt) / timeConstant);
}

export function scrollProgress(scrollY: number, start: number, distance: number) {
  return Math.max(0, Math.min(1, (scrollY - start) / Math.max(1, distance)));
}

export function dustPosition(index: number, width: number, height: number) {
  const fraction = (seed: number) => { const value = Math.sin(seed) * 43758.5453; return value - Math.floor(value); };
  return { x: 8 + fraction(index * 127.1 + 90327) * Math.max(0, width - 16), y: 8 + fraction(index * 311.7 + 5081) * Math.max(0, height - 16) };
}
