# Publish Checklist

Before publishing to npm and GitHub, verify:

## Code
- [x] server.js implements MCP spec (tools/list, tools/call)
- [x] All 4 tools work: create_template, render_prompt, list_templates, get_template
- [x] Persistence to ~/.kiro/positional-prompts/templates.json works
- [x] test.js validates core functionality
- [x] No external dependencies (only Node.js stdlib)

## Structure
- [x] power.json: Metadata and MCP server config
- [x] package.json: npm metadata with scripts
- [x] LICENSE: MIT license included
- [x] README.md: Main documentation
- [x] QUICK_START.md: 30-second setup guide
- [x] INSTALL.md: Detailed installation and troubleshooting
- [x] guides/: Getting Started, Team Workflow, Advanced strategies
- [x] examples/: Ready-to-use templates
- [x] .npmignore: Exclude non-essential files from package

## GitHub
- [x] .git initialized
- [x] First commit: "Initial: Positional Prompts power for Kiro"
- [x] .github/workflows/test.yml: CI pipeline (npm test)
- [x] .gitignore: Excludes node_modules, logs, etc.

## Publishing Steps

1. **Create GitHub repo**
   ```bash
   cd /path/to/kiro-positional-prompts
   git remote add origin https://github.com/your-username/kiro-positional-prompts.git
   git branch -M main
   git push -u origin main
   ```

2. **Update package.json** with correct GitHub URL

3. **Publish to npm**
   ```bash
   npm publish
   ```

4. **Verify installation**
   ```bash
   npm install @kiro-powers/positional-prompts
   ```

## Documentation Checklist

- [x] Installation instructions in README and INSTALL.md
- [x] Quick start in QUICK_START.md
- [x] Team workflow guide with examples
- [x] Advanced strategies for scaling
- [x] Example templates with descriptions
- [x] Troubleshooting section
- [x] Contributing guide

## Quality Checks

- [x] No hardcoded paths (uses ~ for home)
- [x] Cross-platform (Windows/Mac/Linux paths)
- [x] No console output clutter (only errors logged to stderr)
- [x] Proper MCP JSON protocol compliance
- [x] Error handling for missing templates
- [x] Graceful directory creation

## Post-Publish

1. Test with `npx @kiro-powers/positional-prompts`
2. Add to Kiro's power gallery (if applicable)
3. Create release notes for v1.0.0
4. Share in Kiro community channels
