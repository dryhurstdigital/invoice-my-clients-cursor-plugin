import { describe, it, expect } from 'vitest'
import { fileExists, listDir } from './helpers.js'

describe('Plugin Structure', () => {
  describe('required directories', () => {
    it.each([
      '.cursor-plugin',
      'rules',
      'skills',
      'agents',
      'commands',
      'hooks',
      'assets',
      'scripts',
    ])('has %s directory', (dir) => {
      expect(fileExists(dir)).toBe(true)
    })
  })

  describe('required files', () => {
    it.each([
      '.cursor-plugin/plugin.json',
      '.mcp.json',
      'hooks/hooks.json',
      'assets/logo.svg',
      'README.md',
      'LICENSE',
      '.gitignore',
    ])('has %s', (file) => {
      expect(fileExists(file)).toBe(true)
    })
  })

  describe('rules directory', () => {
    it('contains at least one .mdc file', () => {
      const files = listDir('rules')
      const mdcFiles = files.filter((f) => f.endsWith('.mdc'))
      expect(mdcFiles.length).toBeGreaterThanOrEqual(1)
    })

    it('contains only .mdc files', () => {
      const files = listDir('rules')
      for (const file of files) {
        expect(file).toMatch(/\.mdc$/)
      }
    })
  })

  describe('skills directory', () => {
    it('contains at least one skill subdirectory', () => {
      const entries = listDir('skills')
      expect(entries.length).toBeGreaterThanOrEqual(1)
    })

    it('each skill subdirectory has a SKILL.md file', () => {
      const entries = listDir('skills')
      for (const skill of entries) {
        expect(fileExists(`skills/${skill}/SKILL.md`)).toBe(true)
      }
    })
  })

  describe('agents directory', () => {
    it('contains at least one .md file', () => {
      const files = listDir('agents')
      const mdFiles = files.filter((f) => f.endsWith('.md'))
      expect(mdFiles.length).toBeGreaterThanOrEqual(1)
    })

    it('contains only markdown files', () => {
      const files = listDir('agents')
      for (const file of files) {
        expect(file).toMatch(/\.(md|mdc|markdown)$/)
      }
    })
  })

  describe('commands directory', () => {
    it('contains at least one command file', () => {
      const files = listDir('commands')
      const cmdFiles = files.filter((f) => /\.(md|mdc|markdown|txt)$/.test(f))
      expect(cmdFiles.length).toBeGreaterThanOrEqual(1)
    })

    it('contains only valid command file types', () => {
      const files = listDir('commands')
      for (const file of files) {
        expect(file).toMatch(/\.(md|mdc|markdown|txt)$/)
      }
    })
  })

  describe('scripts directory', () => {
    it('contains at least one script', () => {
      const files = listDir('scripts')
      expect(files.length).toBeGreaterThanOrEqual(1)
    })
  })
})
