import { describe, it, expect } from 'vitest'
import { listDir, parseFrontmatter, readFile, fileExists } from './helpers.js'

const skillDirs = listDir('skills')

describe('Skills', () => {
  it('has at least one skill', () => {
    expect(skillDirs.length).toBeGreaterThanOrEqual(1)
  })

  describe.each(skillDirs)('%s', (skillDir) => {
    const skillPath = `skills/${skillDir}/SKILL.md`

    it('has a SKILL.md file', () => {
      expect(fileExists(skillPath)).toBe(true)
    })

    it('has valid YAML frontmatter', () => {
      expect(() => parseFrontmatter(skillPath)).not.toThrow()
    })

    describe('frontmatter', () => {
      let fm

      beforeEach(() => {
        fm = parseFrontmatter(skillPath)
      })

      it('has a name field', () => {
        expect(fm.data).toHaveProperty('name')
        expect(typeof fm.data.name).toBe('string')
      })

      it('name is lowercase kebab-case', () => {
        expect(fm.data.name).toMatch(/^[a-z][a-z0-9-]*[a-z0-9]$/)
      })

      it('name matches directory name', () => {
        expect(fm.data.name).toBe(skillDir)
      })

      it('has a description field', () => {
        expect(fm.data).toHaveProperty('description')
        expect(typeof fm.data.description).toBe('string')
        expect(fm.data.description.length).toBeGreaterThan(20)
      })

      it('description mentions when to use the skill', () => {
        const desc = fm.data.description.toLowerCase()
        const hasUsageContext =
          desc.includes('use when') ||
          desc.includes('use for') ||
          desc.includes('use this') ||
          desc.includes('help') ||
          desc.includes('manage') ||
          desc.includes('create') ||
          desc.includes('generate') ||
          desc.includes('perform')
        expect(hasUsageContext).toBe(true)
      })
    })

    describe('content', () => {
      let fm

      beforeEach(() => {
        fm = parseFrontmatter(skillPath)
      })

      it('has body content after frontmatter', () => {
        expect(fm.content.trim().length).toBeGreaterThan(100)
      })

      it('has a top-level heading', () => {
        expect(fm.content).toMatch(/^#\s+.+/m)
      })

      it("has a 'When to use' or 'Prerequisites' section", () => {
        const content = fm.content.toLowerCase()
        const hasTriggerSection =
          content.includes('when to use') ||
          content.includes('prerequisites') ||
          content.includes('instructions')
        expect(hasTriggerSection).toBe(true)
      })

      it("has an 'Instructions' section", () => {
        const content = fm.content.toLowerCase()
        expect(content).toContain('instructions')
      })

      it('has numbered steps', () => {
        expect(fm.content).toMatch(/###\s+Step\s+\d/)
      })

      it('references MCP tools', () => {
        const toolNames = [
          'create_invoice',
          'update_invoice',
          'get_invoice',
          'get_invoices',
          'search_invoices',
          'create_business',
          'update_business',
          'get_business',
          'get_businesses',
          'search_businesses',
          'create_invoice_item',
          'update_invoice_item',
          'get_invoice_items',
          'delete_invoice_item',
          'get_user_settings',
        ]
        const content = fm.content
        const referencesAnyTool = toolNames.some((tool) =>
          content.includes(tool),
        )
        expect(referencesAnyTool).toBe(true)
      })

      it('has example prompts or usage examples', () => {
        const content = fm.content.toLowerCase()
        const hasExamples =
          content.includes('example') ||
          content.includes('usage') ||
          content.includes('prompt')
        expect(hasExamples).toBe(true)
      })

      it('does not contain TODO/FIXME placeholders', () => {
        expect(fm.content).not.toMatch(/\bTODO\b/i)
        expect(fm.content).not.toMatch(/\bFIXME\b/i)
      })
    })

    it('file starts with --- (frontmatter delimiter)', () => {
      const raw = readFile(skillPath)
      expect(raw.trimStart()).toMatch(/^---/)
    })
  })
})
