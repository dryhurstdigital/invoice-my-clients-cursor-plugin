import { describe, it, expect } from 'vitest'
import { listDir, parseFrontmatter, readFile } from './helpers.js'

const agentFiles = listDir('agents').filter((f) =>
  /\.(md|mdc|markdown)$/.test(f),
)

describe('Agents', () => {
  it('has at least one agent', () => {
    expect(agentFiles.length).toBeGreaterThanOrEqual(1)
  })

  describe.each(agentFiles)('%s', (filename) => {
    const filePath = `agents/${filename}`

    it('has valid YAML frontmatter', () => {
      expect(() => parseFrontmatter(filePath)).not.toThrow()
    })

    describe('frontmatter', () => {
      let fm

      beforeEach(() => {
        fm = parseFrontmatter(filePath)
      })

      it('has a name field', () => {
        expect(fm.data).toHaveProperty('name')
        expect(typeof fm.data.name).toBe('string')
      })

      it('name is lowercase kebab-case', () => {
        expect(fm.data.name).toMatch(/^[a-z][a-z0-9-]*[a-z0-9]$/)
      })

      it('name matches filename (without extension)', () => {
        const expectedName = filename.replace(/\.(md|mdc|markdown)$/, '')
        expect(fm.data.name).toBe(expectedName)
      })

      it('has a description field', () => {
        expect(fm.data).toHaveProperty('description')
        expect(typeof fm.data.description).toBe('string')
        expect(fm.data.description.length).toBeGreaterThan(20)
      })
    })

    describe('content', () => {
      let fm

      beforeEach(() => {
        fm = parseFrontmatter(filePath)
      })

      it('has body content after frontmatter', () => {
        expect(fm.content.trim().length).toBeGreaterThan(100)
      })

      it('has a top-level heading', () => {
        expect(fm.content).toMatch(/^#\s+.+/m)
      })

      it('has at least one section', () => {
        expect(fm.content).toMatch(/^##\s+.+/m)
      })

      it('defines agent behavior or persona', () => {
        const content = fm.content.toLowerCase()
        const hasPersona =
          content.includes('you are') ||
          content.includes('your ') ||
          content.includes('behavior') ||
          content.includes('guidelines') ||
          content.includes('focus')
        expect(hasPersona).toBe(true)
      })

      it('references MCP tools or capabilities', () => {
        const content = fm.content.toLowerCase()
        const hasMcpRef =
          content.includes('mcp') ||
          content.includes('tool') ||
          content.includes('invoice-my-clients')
        expect(hasMcpRef).toBe(true)
      })

      it('has a tone or guidelines section', () => {
        const content = fm.content.toLowerCase()
        const hasTone =
          content.includes('tone') ||
          content.includes('guideline') ||
          content.includes('behavior') ||
          content.includes('rule')
        expect(hasTone).toBe(true)
      })

      it('does not contain TODO/FIXME placeholders', () => {
        expect(fm.content).not.toMatch(/\bTODO\b/i)
        expect(fm.content).not.toMatch(/\bFIXME\b/i)
      })
    })

    it('file starts with --- (frontmatter delimiter)', () => {
      const raw = readFile(filePath)
      expect(raw.trimStart()).toMatch(/^---/)
    })
  })
})
