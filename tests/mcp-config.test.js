import { describe, it, expect, beforeAll } from "vitest";
import { readJson } from "./helpers.js";

describe("MCP Config (.mcp.json)", () => {
  let config;

  beforeAll(() => {
    config = readJson(".mcp.json");
  });

  it("is valid JSON", () => {
    expect(() => readJson(".mcp.json")).not.toThrow();
  });

  it("has mcpServers key", () => {
    expect(config).toHaveProperty("mcpServers");
    expect(typeof config.mcpServers).toBe("object");
  });

  it("has at least one server entry", () => {
    const servers = Object.keys(config.mcpServers);
    expect(servers.length).toBeGreaterThanOrEqual(1);
  });

  describe("invoice-my-clients server", () => {
    let server;

    beforeAll(() => {
      server = config.mcpServers["invoice-my-clients"];
    });

    it("exists", () => {
      expect(server).toBeDefined();
    });

    it("has a url field", () => {
      expect(server).toHaveProperty("url");
      expect(typeof server.url).toBe("string");
    });

    it("url contains environment variable reference for configurability", () => {
      expect(server.url).toContain("IMC_MCP_SERVER_URL");
    });

    it("url has a sensible default fallback", () => {
      expect(server.url).toContain("mcp.invoicemyclients.com");
    });

    it("has authorization headers", () => {
      expect(server).toHaveProperty("headers");
      expect(server.headers).toHaveProperty("Authorization");
    });

    it("authorization header references IMC_API_KEY env var", () => {
      expect(server.headers.Authorization).toContain("IMC_API_KEY");
    });

    it("authorization uses Bearer scheme", () => {
      expect(server.headers.Authorization).toMatch(/^Bearer /);
    });
  });

  describe("server entries validation", () => {
    it("each server has either url or command", () => {
      for (const [name, server] of Object.entries(config.mcpServers)) {
        const hasUrl = "url" in server;
        const hasCommand = "command" in server;
        expect(
          hasUrl || hasCommand,
          `Server "${name}" must have either url or command`,
        ).toBe(true);
      }
    });

    it("no server has empty url", () => {
      for (const [name, server] of Object.entries(config.mcpServers)) {
        if ("url" in server) {
          expect(server.url.length, `Server "${name}" has empty url`).toBeGreaterThan(0);
        }
      }
    });
  });
});
