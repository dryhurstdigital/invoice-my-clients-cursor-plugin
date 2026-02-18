import { describe, it, expect, beforeAll } from "vitest";
import { execSync } from "node:child_process";
import { readFile, listDir, PLUGIN_ROOT } from "./helpers.js";

const scriptFiles = listDir("scripts");

describe("Hook Scripts", () => {
  it("has at least one script", () => {
    expect(scriptFiles.length).toBeGreaterThanOrEqual(1);
  });

  describe.each(scriptFiles)("%s", (filename) => {
    const filePath = `scripts/${filename}`;

    it("is not empty", () => {
      const content = readFile(filePath);
      expect(content.trim().length).toBeGreaterThan(0);
    });

    it("has a shebang line", () => {
      const content = readFile(filePath);
      expect(content).toMatch(/^#!\/usr\/bin\/env node/);
    });

    it("has valid JavaScript syntax", () => {
      expect(() => {
        execSync(`node --check "${PLUGIN_ROOT}/scripts/${filename}"`, {
          stdio: "pipe",
        });
      }).not.toThrow();
    });

    it("calls process.exit()", () => {
      const content = readFile(filePath);
      expect(content).toContain("process.exit(");
    });
  });

  describe("check-connection.js", () => {
    let content;

    beforeAll(() => {
      content = readFile("scripts/check-connection.js");
    });

    it("checks IMC_API_KEY environment variable", () => {
      expect(content).toContain("IMC_API_KEY");
    });

    it("validates API key prefix", () => {
      expect(content).toContain("imc_live_");
    });

    it("exits with code 1 when key is missing", () => {
      expect(content).toContain("process.exit(1)");
    });

    it("exits with code 0 on success", () => {
      expect(content).toContain("process.exit(0)");
    });

    it("provides setup instructions on failure", () => {
      expect(content).toContain("invoicemyclients.com");
    });

    it("exits 1 when no API key is set", () => {
      try {
        execSync(
          `node "${PLUGIN_ROOT}/scripts/check-connection.js"`,
          { stdio: "pipe", env: { ...process.env, IMC_API_KEY: "" } },
        );
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err.status).toBe(1);
        expect(err.stderr.toString() + err.stdout.toString()).toContain(
          "IMC_API_KEY",
        );
      }
    });

    it("exits 1 with bad prefix", () => {
      try {
        execSync(
          `node "${PLUGIN_ROOT}/scripts/check-connection.js"`,
          {
            stdio: "pipe",
            env: { ...process.env, IMC_API_KEY: "bad_prefix_key" },
          },
        );
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err.status).toBe(1);
      }
    });

    it("exits 0 with valid API key", () => {
      const result = execSync(
        `node "${PLUGIN_ROOT}/scripts/check-connection.js"`,
        {
          stdio: "pipe",
          env: { ...process.env, IMC_API_KEY: "imc_live_test123" },
        },
      );
      // No error means exit code 0
      expect(result.toString()).toContain("Ready to use");
    });
  });

  describe("log-mcp-usage.js", () => {
    let content;

    beforeAll(() => {
      content = readFile("scripts/log-mcp-usage.js");
    });

    it("reads HOOK_TOOL_NAME environment variable", () => {
      expect(content).toContain("HOOK_TOOL_NAME");
    });

    it("reads HOOK_RESULT environment variable", () => {
      expect(content).toContain("HOOK_RESULT");
    });

    it("outputs a timestamp", () => {
      expect(content).toContain("toISOString");
    });

    it("defaults to 'unknown' for missing env vars", () => {
      expect(content).toContain('"unknown"');
    });

    it("exits 0 successfully", () => {
      const result = execSync(
        `node "${PLUGIN_ROOT}/scripts/log-mcp-usage.js"`,
        { stdio: "pipe" },
      );
      expect(result.toString()).toContain("[IMC Audit]");
    });

    it("includes tool name in output when set", () => {
      const result = execSync(
        `node "${PLUGIN_ROOT}/scripts/log-mcp-usage.js"`,
        {
          stdio: "pipe",
          env: {
            ...process.env,
            HOOK_TOOL_NAME: "create_invoice",
            HOOK_RESULT: "success",
          },
        },
      );
      const output = result.toString();
      expect(output).toContain("create_invoice");
      expect(output).toContain("success");
    });
  });
});
