import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const PLUGIN_ROOT = path.resolve(import.meta.dirname, "..");

export function resolve(...segments) {
  return path.join(PLUGIN_ROOT, ...segments);
}

export function fileExists(relativePath) {
  return fs.existsSync(resolve(relativePath));
}

export function readFile(relativePath) {
  return fs.readFileSync(resolve(relativePath), "utf-8");
}

export function readJson(relativePath) {
  return JSON.parse(readFile(relativePath));
}

export function parseFrontmatter(relativePath) {
  const content = readFile(relativePath);
  return matter(content);
}

export function listDir(relativePath) {
  const dir = resolve(relativePath);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir);
}

export function listDirRecursive(relativePath) {
  const dir = resolve(relativePath);
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(relativePath, entry.name);
    if (entry.isDirectory()) {
      results.push(...listDirRecursive(entryPath));
    } else {
      results.push(entryPath);
    }
  }
  return results;
}

export const VALID_HOOK_EVENTS = new Set([
  "sessionStart",
  "sessionEnd",
  "preToolUse",
  "postToolUse",
  "postToolUseFailure",
  "subagentStart",
  "subagentStop",
  "beforeShellExecution",
  "afterShellExecution",
  "beforeMCPExecution",
  "afterMCPExecution",
  "beforeReadFile",
  "afterFileEdit",
  "beforeSubmitPrompt",
  "preCompact",
  "stop",
  "afterAgentResponse",
  "afterAgentThought",
  "beforeTabFileRead",
  "afterTabFileEdit",
]);
