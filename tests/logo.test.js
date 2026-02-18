import { describe, it, expect, beforeAll } from "vitest";
import { readFile } from "./helpers.js";

describe("Logo (assets/logo.svg)", () => {
  let svg;

  beforeAll(() => {
    svg = readFile("assets/logo.svg");
  });

  it("is not empty", () => {
    expect(svg.trim().length).toBeGreaterThan(0);
  });

  it("is valid SVG (starts with <svg)", () => {
    expect(svg.trim()).toMatch(/^<svg[\s>]/);
  });

  it("has xmlns attribute", () => {
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it("has a viewBox attribute", () => {
    expect(svg).toMatch(/viewBox="[^"]+"/);
  });

  it("has closing </svg> tag", () => {
    expect(svg.trim()).toMatch(/<\/svg>\s*$/);
  });

  it("is reasonably sized (under 10KB)", () => {
    expect(svg.length).toBeLessThan(10240);
  });

  it("does not contain embedded raster images", () => {
    expect(svg).not.toContain("<image");
    expect(svg).not.toContain("data:image/png");
    expect(svg).not.toContain("data:image/jpeg");
  });

  it("does not contain scripts", () => {
    expect(svg).not.toContain("<script");
    expect(svg).not.toContain("onclick");
    expect(svg).not.toContain("onload");
  });

  it("contains visual elements", () => {
    const hasVisual =
      svg.includes("<rect") ||
      svg.includes("<circle") ||
      svg.includes("<path") ||
      svg.includes("<polygon") ||
      svg.includes("<line") ||
      svg.includes("<ellipse");
    expect(hasVisual).toBe(true);
  });
});
