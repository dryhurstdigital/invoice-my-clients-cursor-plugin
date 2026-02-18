import { describe, it, expect, beforeAll } from 'vitest'
import { readJson, readFile } from './helpers.js'

describe('Plugin Manifest (.cursor-plugin/plugin.json)', () => {
  let manifest

  beforeAll(() => {
    manifest = readJson('.cursor-plugin/plugin.json')
  })

  it('is valid JSON', () => {
    expect(() => readJson('.cursor-plugin/plugin.json')).not.toThrow()
  })

  describe('required fields', () => {
    it('has a name field', () => {
      expect(manifest).toHaveProperty('name')
      expect(typeof manifest.name).toBe('string')
    })

    it('name is lowercase kebab-case', () => {
      expect(manifest.name).toMatch(/^[a-z0-9][a-z0-9.\-]*[a-z0-9]$/)
    })

    it('name starts with alphanumeric', () => {
      expect(manifest.name[0]).toMatch(/[a-z0-9]/)
    })

    it('name ends with alphanumeric', () => {
      expect(manifest.name[manifest.name.length - 1]).toMatch(/[a-z0-9]/)
    })
  })

  describe('optional fields', () => {
    it('has a valid version (semver)', () => {
      if (manifest.version) {
        expect(manifest.version).toMatch(/^\d+\.\d+\.\d+/)
      }
    })

    it('has a description string', () => {
      expect(manifest).toHaveProperty('description')
      expect(typeof manifest.description).toBe('string')
      expect(manifest.description.length).toBeGreaterThan(10)
    })

    it('has a valid author object', () => {
      expect(manifest).toHaveProperty('author')
      expect(manifest.author).toHaveProperty('name')
      expect(typeof manifest.author.name).toBe('string')
      if (manifest.author.email) {
        expect(manifest.author.email).toMatch(/@/)
      }
    })

    it('has a homepage URL', () => {
      if (manifest.homepage) {
        expect(manifest.homepage).toMatch(/^https?:\/\//)
      }
    })

    it('has a repository URL', () => {
      if (manifest.repository) {
        expect(manifest.repository).toMatch(/^https?:\/\//)
      }
    })

    it('has a valid license string', () => {
      if (manifest.license) {
        expect(typeof manifest.license).toBe('string')
        expect(manifest.license.length).toBeGreaterThan(0)
      }
    })

    it('has keywords as an array of strings', () => {
      if (manifest.keywords) {
        expect(Array.isArray(manifest.keywords)).toBe(true)
        for (const kw of manifest.keywords) {
          expect(typeof kw).toBe('string')
          expect(kw.length).toBeGreaterThan(0)
        }
      }
    })

    it('has at least 3 keywords for discoverability', () => {
      if (manifest.keywords) {
        expect(manifest.keywords.length).toBeGreaterThanOrEqual(3)
      }
    })

    it('has a logo path that is a relative path', () => {
      if (manifest.logo) {
        expect(manifest.logo).not.toMatch(/^[A-Z]:\\/)
        expect(manifest.logo).not.toMatch(/^\//)
      }
    })
  })

  describe('no disallowed fields', () => {
    it('does not contain absolute paths', () => {
      const raw = readFile('.cursor-plugin/plugin.json')
      expect(raw).not.toMatch(/[A-Z]:\\/)
      expect(raw).not.toMatch(/"\/.+"/)
    })

    it('does not contain parent directory references', () => {
      const raw = readFile('.cursor-plugin/plugin.json')
      expect(raw).not.toContain('..')
    })
  })
})
