import { describe, it, expect, beforeAll } from 'vitest'
import { readJson, fileExists, VALID_HOOK_EVENTS } from './helpers.js'

describe('Hooks (hooks/hooks.json)', () => {
  let hooksConfig

  beforeAll(() => {
    hooksConfig = readJson('hooks/hooks.json')
  })

  it('is valid JSON', () => {
    expect(() => readJson('hooks/hooks.json')).not.toThrow()
  })

  it('has a hooks key', () => {
    expect(hooksConfig).toHaveProperty('hooks')
    expect(typeof hooksConfig.hooks).toBe('object')
  })

  it('has at least one hook event', () => {
    const events = Object.keys(hooksConfig.hooks)
    expect(events.length).toBeGreaterThanOrEqual(1)
  })

  describe('hook event names', () => {
    it('all event names are valid Cursor hook events', () => {
      const events = Object.keys(hooksConfig.hooks)
      for (const event of events) {
        expect(
          VALID_HOOK_EVENTS.has(event),
          `"${event}" is not a valid Cursor hook event. Valid events: ${[...VALID_HOOK_EVENTS].join(', ')}`,
        ).toBe(true)
      }
    })
  })

  describe('hook entries', () => {
    it('each event has an array of hook entries', () => {
      for (const [event, hooks] of Object.entries(hooksConfig.hooks)) {
        expect(Array.isArray(hooks), `hooks.${event} should be an array`).toBe(
          true,
        )
        expect(hooks.length).toBeGreaterThanOrEqual(1)
      }
    })

    it('each hook entry has a command field', () => {
      for (const [event, hooks] of Object.entries(hooksConfig.hooks)) {
        for (const hook of hooks) {
          expect(hook).toHaveProperty('command')
          expect(typeof hook.command).toBe('string')
          expect(hook.command.length).toBeGreaterThan(0)
        }
      }
    })

    it('hook commands reference existing scripts', () => {
      for (const hooks of Object.values(hooksConfig.hooks)) {
        for (const hook of hooks) {
          const match = hook.command.match(
            /\.\/scripts\/([a-zA-Z0-9_-]+\.[a-z]+)/,
          )
          if (match) {
            const scriptPath = `scripts/${match[1]}`
            expect(
              fileExists(scriptPath),
              `Hook references script "${scriptPath}" which does not exist`,
            ).toBe(true)
          }
        }
      }
    })
  })

  describe('sessionStart hooks', () => {
    it('has a connection check hook', () => {
      const sessionStartHooks = hooksConfig.hooks.sessionStart
      expect(sessionStartHooks).toBeDefined()
      const hasConnectionCheck = sessionStartHooks.some((h) =>
        h.command.includes('check-connection'),
      )
      expect(hasConnectionCheck).toBe(true)
    })
  })

  describe('afterMCPExecution hooks', () => {
    it('has a logging hook', () => {
      const hooks = hooksConfig.hooks.afterMCPExecution
      expect(hooks).toBeDefined()
      const hasLogger = hooks.some((h) => h.command.includes('log-mcp-usage'))
      expect(hasLogger).toBe(true)
    })

    it('logging hook targets invoice-my-clients server', () => {
      const hooks = hooksConfig.hooks.afterMCPExecution
      const loggerHook = hooks.find((h) => h.command.includes('log-mcp-usage'))
      expect(loggerHook).toHaveProperty('matcher')
      expect(loggerHook.matcher).toContain('invoice-my-clients')
    })
  })
})
