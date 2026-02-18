import { describe, it, expect, beforeAll } from 'vitest'
import {
  readJson,
  readFile,
  fileExists,
  listDir,
  parseFrontmatter,
} from './helpers.js'

describe('Cross-References & Integrity', () => {
  describe('manifest logo reference', () => {
    it('logo path in plugin.json points to an existing file', () => {
      const manifest = readJson('.cursor-plugin/plugin.json')
      if (manifest.logo) {
        expect(
          fileExists(manifest.logo),
          `Logo path "${manifest.logo}" does not exist`,
        ).toBe(true)
      }
    })

    it('logo is an SVG file', () => {
      const manifest = readJson('.cursor-plugin/plugin.json')
      if (manifest.logo) {
        expect(manifest.logo).toMatch(/\.svg$/i)
      }
    })
  })

  describe('unique names across components', () => {
    let allNames

    beforeAll(() => {
      allNames = {
        skills: [],
        agents: [],
        commands: [],
      }

      for (const skillDir of listDir('skills')) {
        const fm = parseFrontmatter(`skills/${skillDir}/SKILL.md`)
        allNames.skills.push(fm.data.name)
      }

      for (const agentFile of listDir('agents').filter((f) =>
        f.endsWith('.md'),
      )) {
        const fm = parseFrontmatter(`agents/${agentFile}`)
        allNames.agents.push(fm.data.name)
      }

      for (const cmdFile of listDir('commands').filter((f) =>
        f.endsWith('.md'),
      )) {
        const fm = parseFrontmatter(`commands/${cmdFile}`)
        allNames.commands.push(fm.data.name)
      }
    })

    it('no duplicate skill names', () => {
      const unique = new Set(allNames.skills)
      expect(unique.size).toBe(allNames.skills.length)
    })

    it('no duplicate agent names', () => {
      const unique = new Set(allNames.agents)
      expect(unique.size).toBe(allNames.agents.length)
    })

    it('no duplicate command names', () => {
      const unique = new Set(allNames.commands)
      expect(unique.size).toBe(allNames.commands.length)
    })

    it('no name collisions between agents and commands', () => {
      const agentSet = new Set(allNames.agents)
      for (const cmd of allNames.commands) {
        expect(
          agentSet.has(cmd),
          `Command name "${cmd}" collides with an agent name`,
        ).toBe(false)
      }
    })
  })

  describe('MCP server name consistency', () => {
    it('MCP server name in .mcp.json matches plugin name', () => {
      const manifest = readJson('.cursor-plugin/plugin.json')
      const mcpConfig = readJson('.mcp.json')
      const serverNames = Object.keys(mcpConfig.mcpServers)
      expect(serverNames).toContain(manifest.name)
    })
  })

  describe('README completeness', () => {
    let readme

    beforeAll(() => {
      readme = readFile('README.md')
    })

    it('documents all skills', () => {
      for (const skillDir of listDir('skills')) {
        const fm = parseFrontmatter(`skills/${skillDir}/SKILL.md`)
        expect(
          readme.includes(fm.data.name),
          `README does not mention skill "${fm.data.name}"`,
        ).toBe(true)
      }
    })

    it('documents all agents', () => {
      for (const agentFile of listDir('agents').filter((f) =>
        f.endsWith('.md'),
      )) {
        const fm = parseFrontmatter(`agents/${agentFile}`)
        expect(
          readme.includes(fm.data.name),
          `README does not mention agent "${fm.data.name}"`,
        ).toBe(true)
      }
    })

    it('documents all commands', () => {
      for (const cmdFile of listDir('commands').filter((f) =>
        f.endsWith('.md'),
      )) {
        const fm = parseFrontmatter(`commands/${cmdFile}`)
        expect(
          readme.includes(fm.data.name),
          `README does not mention command "${fm.data.name}"`,
        ).toBe(true)
      }
    })

    it('mentions the MCP server', () => {
      expect(readme).toContain('invoice-my-clients')
    })

    it('mentions IMC_API_KEY setup', () => {
      expect(readme).toContain('IMC_API_KEY')
    })

    it('has a setup section', () => {
      expect(readme.toLowerCase()).toContain('setup')
    })

    it('has usage examples', () => {
      expect(readme.toLowerCase()).toContain('usage')
    })
  })

  describe('hook script cross-references', () => {
    it('all scripts referenced in hooks.json exist', () => {
      const hooksConfig = readJson('hooks/hooks.json')
      for (const hooks of Object.values(hooksConfig.hooks)) {
        for (const hook of hooks) {
          const match = hook.command.match(/\.\/scripts\/([a-zA-Z0-9_.-]+)/)
          if (match) {
            expect(
              fileExists(`scripts/${match[1]}`),
              `Script "${match[1]}" referenced in hooks.json does not exist`,
            ).toBe(true)
          }
        }
      }
    })

    it('all scripts in scripts/ are referenced by hooks.json', () => {
      const hooksConfig = readJson('hooks/hooks.json')
      const allHookCommands = Object.values(hooksConfig.hooks)
        .flat()
        .map((h) => h.command)
        .join(' ')

      for (const script of listDir('scripts')) {
        expect(
          allHookCommands.includes(script),
          `Script "${script}" exists but is not referenced by any hook`,
        ).toBe(true)
      }
    })
  })

  describe('MCP tool references in content', () => {
    const knownTools = [
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

    it('all known MCP tools are referenced somewhere in skills or agents', () => {
      let allContent = ''

      for (const skillDir of listDir('skills')) {
        allContent += readFile(`skills/${skillDir}/SKILL.md`) + '\n'
      }
      for (const agentFile of listDir('agents').filter((f) =>
        f.endsWith('.md'),
      )) {
        allContent += readFile(`agents/${agentFile}`) + '\n'
      }

      for (const tool of knownTools) {
        expect(
          allContent.includes(tool),
          `MCP tool "${tool}" is not referenced in any skill or agent`,
        ).toBe(true)
      }
    })
  })
})
