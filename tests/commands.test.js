import { describe, it, expect } from "vitest";
import { listDir, parseFrontmatter, readFile } from "./helpers.js";

const commandFiles = listDir("commands").filter((f) =>
  /\.(md|mdc|markdown|txt)$/.test(f),
);

describe("Commands", () => {
  it("has at least one command", () => {
    expect(commandFiles.length).toBeGreaterThanOrEqual(1);
  });

  describe.each(commandFiles)("%s", (filename) => {
    const filePath = `commands/${filename}`;

    it("has valid YAML frontmatter", () => {
      expect(() => parseFrontmatter(filePath)).not.toThrow();
    });

    describe("frontmatter", () => {
      let fm;

      beforeEach(() => {
        fm = parseFrontmatter(filePath);
      });

      it("has a name field", () => {
        expect(fm.data).toHaveProperty("name");
        expect(typeof fm.data.name).toBe("string");
      });

      it("name is lowercase kebab-case", () => {
        expect(fm.data.name).toMatch(/^[a-z][a-z0-9-]*[a-z0-9]$/);
      });

      it("name matches filename (without extension)", () => {
        const expectedName = filename.replace(/\.(md|mdc|markdown|txt)$/, "");
        expect(fm.data.name).toBe(expectedName);
      });

      it("has a description field", () => {
        expect(fm.data).toHaveProperty("description");
        expect(typeof fm.data.description).toBe("string");
        expect(fm.data.description.length).toBeGreaterThan(10);
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

      it("has a top-level heading", () => {
        expect(fm.content).toMatch(/^#\s+.+/m);
      });

      it("has steps or instructions", () => {
        const content = fm.content.toLowerCase();
        const hasSteps =
          content.includes("step") ||
          content.includes("1.") ||
          content.includes("instructions");
        expect(hasSteps).toBe(true);
      });

      it("references MCP tools from invoice-my-clients server", () => {
        const content = fm.content;
        const hasMcpRef =
          content.includes("invoice-my-clients") ||
          content.includes("MCP") ||
          content.includes("mcp");
        expect(hasMcpRef).toBe(true);
      });

      it("does not contain TODO/FIXME placeholders", () => {
        expect(fm.content).not.toMatch(/\bTODO\b/i);
        expect(fm.content).not.toMatch(/\bFIXME\b/i);
      });
    });

    it("file starts with --- (frontmatter delimiter)", () => {
      const raw = readFile(filePath);
      expect(raw.trimStart()).toMatch(/^---/);
    });
  });

  describe("command names are unique", () => {
    it("no duplicate command names", () => {
      const names = commandFiles.map((f) => {
        const fm = parseFrontmatter(`commands/${f}`);
        return fm.data.name;
      });
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });
});
