import { describe, it, expect, beforeAll } from 'vitest'
import { readFile } from './helpers.js'

describe('README.md', () => {
  let readme

  beforeAll(() => {
    readme = readFile('README.md')
  })

  it('is not empty', () => {
    expect(readme.trim().length).toBeGreaterThan(0)
  })

  it('has a top-level heading', () => {
    expect(readme).toMatch(/^#\s+.+/m)
  })

  it('is at least 500 characters (substantive documentation)', () => {
    expect(readme.length).toBeGreaterThan(500)
  })

  describe('required sections', () => {
    it('has a Features section', () => {
      expect(readme).toMatch(/##\s+.*[Ff]eatures/)
    })

    it('has a Setup section', () => {
      expect(readme).toMatch(/##\s+.*[Ss]etup/)
    })

    it('has a Usage section', () => {
      expect(readme).toMatch(/##\s+.*[Uu]sage/)
    })

    it('has an Architecture section', () => {
      expect(readme).toMatch(/##\s+.*[Aa]rchitecture/)
    })

    it('has a Troubleshooting section', () => {
      expect(readme).toMatch(/##\s+.*[Tt]roubleshooting/)
    })
  })

  describe('content quality', () => {
    it('mentions Invoice My Clients', () => {
      expect(readme).toContain('Invoice My Clients')
    })

    it('mentions the MCP server', () => {
      expect(readme).toContain('MCP')
    })

    it('has API key setup instructions', () => {
      expect(readme).toContain('IMC_API_KEY')
    })

    it('includes the app URL', () => {
      expect(readme).toContain('invoicemyclients.com')
    })

    it('has code blocks for configuration', () => {
      expect(readme).toContain('```')
    })

    it('has tables for structured information', () => {
      expect(readme).toContain('|')
    })

    it('does not contain TODO/FIXME placeholders', () => {
      expect(readme).not.toMatch(/\bTODO\b/)
      expect(readme).not.toMatch(/\bFIXME\b/)
    })

    it('does not contain placeholder text', () => {
      expect(readme).not.toContain('[TODO')
      expect(readme).not.toContain('TBD')
      expect(readme).not.toContain('lorem ipsum')
    })

    it('has a license section or mention', () => {
      expect(readme.toLowerCase()).toContain('license')
    })

    it('has support/contact information', () => {
      const lower = readme.toLowerCase()
      const hasSupport =
        lower.includes('support') ||
        lower.includes('issues') ||
        lower.includes('contact')
      expect(hasSupport).toBe(true)
    })
  })

  describe('directory tree', () => {
    it('includes a directory structure representation', () => {
      const hasTree =
        readme.includes('├──') ||
        readme.includes('└──') ||
        readme.includes('plugin.json')
      expect(hasTree).toBe(true)
    })
  })
})
