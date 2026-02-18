#!/usr/bin/env node

/**
 * Logs Invoice My Clients MCP tool usage for audit purposes.
 * Receives hook context via environment variables or stdin.
 */

const timestamp = new Date().toISOString()
const toolName = process.env.HOOK_TOOL_NAME || 'unknown'
const result = process.env.HOOK_RESULT || 'unknown'

console.log(`[IMC Audit] ${timestamp} | Tool: ${toolName} | Result: ${result}`)
process.exit(0)
