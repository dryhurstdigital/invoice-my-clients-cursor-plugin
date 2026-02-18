import { describe, it, expect } from "vitest";
import { listDir, parseFrontmatter, readFile } from "./helpers.js";

const ruleFiles = listDir("rules").filter((f) => f.endsWith(".mdc"));

describe("Rules", () => {
  it("has at least one rule file", () => {
    expect(ruleFiles.length).toBeGreaterThanOrEqual(1);
  });

  describe.each(ruleFiles)("%s", (filename) => {
    const filePath = `rules/${filename}`;

    it("has valid YAML frontmatter", () => {
      expect(() => parseFrontmatter(filePath)).not.toThrow();
    });

    describe("frontmatter", () => {
      let fm;

      beforeEach(() => {
        fm = parseFrontmatter(filePath);
      });

      it("has a description field", () => {
        expect(fm.data).toHaveProperty("description");
        expect(typeof fm.data.description).toBe("string");
        expect(fm.data.description.length).toBeGreaterThan(10);
      });

      it("has an alwaysApply field (boolean)", () => {
        expect(fm.data).toHaveProperty("alwaysApply");
        expect(typeof fm.data.alwaysApply).toBe("boolean");
      });

      it("globs field is valid if present", () => {
        if ("globs" in fm.data) {
          const globs = fm.data.globs;
          const isValid =
            typeof globs === "string" || Array.isArray(globs);
          expect(isValid).toBe(true);
        }
      });
    });

    describe("content", () => {
      let fm;

      beforeEach(() => {
        fm = parseFrontmatter(filePath);
      });

      it("has body content after frontmatter", () => {
        expect(fm.content.trim().length).toBeGreaterThan(50);
      });

      it("has a markdown heading", () => {
        expect(fm.content).toMatch(/^#\s+.+/m);
      });

      it("has at least one section heading", () => {
        expect(fm.content).toMatch(/^##\s+.+/m);
      });

      it("does not contain TODO/FIXME placeholders", () => {
        expect(fm.content).not.toMatch(/\bTODO\b/i);
        expect(fm.content).not.toMatch(/\bFIXME\b/i);
      });

      it("references Invoice My Clients or MCP tools", () => {
        const content = fm.content.toLowerCase();
        const hasRelevantReference =
          content.includes("invoice") ||
          content.includes("mcp") ||
          content.includes("client") ||
          content.includes("business");
        expect(hasRelevantReference).toBe(true);
      });
    });

    it("file starts with --- (frontmatter delimiter)", () => {
      const raw = readFile(filePath);
      expect(raw.trimStart()).toMatch(/^---/);
    });
  });
});
