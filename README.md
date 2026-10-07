# Positional Prompts Power

A lightweight Kiro Power for templating and reusing prompts with positional parameters.

## Overview

Define prompt templates once with `{0}`, `{1}`, etc. placeholders, then fill them with different arguments each time. Perfect for teams that want consistent, reusable prompts without reinventing the wheel.

```
Template:  "Review this {0} code:\n\n{1}\n\nFocus on: {2}"

Render with ["TypeScript", "const greet = ...", "type safety"]

Result:    "Review this TypeScript code:\n\n...\n\nFocus on: type safety"
```

## Features

- **Zero dependencies** – just Node.js
- **Persistent storage** – templates saved to `~/.kiro/positional-prompts/`
- **MCP-native** – 4 simple tools (create, render, list, get)
- **Cross-platform** – Windows, Mac, Linux
- **Team-friendly** – share templates in steering files
- **Composable** – combine prompts in workflows

## Install

### From GitHub

```bash
# Clone into local plugins directory
git clone https://github.com/kc-agile/kiro-positional-prompts.git ~/.kiro/plugins/positional-prompts
```

Then restart Kiro. The power will auto-discover via `plugin.json`.

### From the Kiro UI

1. Open Kiro → Powers panel
2. Click "Add plugin from GitHub"
3. Enter: `kc-agile/kiro-positional-prompts`
4. Click install

Then restart Kiro.

### For Local Development

```bash
git clone https://github.com/kc-agile/kiro-positional-prompts.git
cd kiro-positional-prompts
npm test  # Verify MCP server works
```

Then add to Kiro plugins from the local path.

## Quick Start

**Step 1: Create a template**

Use the MCP tool `create_template`:
```json
{
  "name": "code-review",
  "template": "Review this {0} code:\n\n{1}\n\nFocus on: {2}",
  "description": "Code review template"
}
```

**Step 2: Render with arguments**

Use the MCP tool `render_prompt`:
```json
{
  "name": "code-review",
  "args": ["TypeScript", "const add = (a, b) => a + b;", "type safety"]
}
```

**Step 3: Use the result**

Copy the rendered prompt and paste into Kiro chat.

**See [QUICK_START.md](QUICK_START.md) for a 30-second overview.**

## Tools

### `create_template`
Store a reusable prompt template.

**Parameters:**
- `name` (string): Template ID
- `template` (string): Template with `{0}`, `{1}`, ... placeholders
- `description` (string, optional): What the template does

### `render_prompt`
Fill a template with arguments.

**Parameters:**
- `name` (string): Template ID
- `args` (string[]): Values for `{0}`, `{1}`, etc.

### `list_templates`
List all stored templates.

### `get_template`
Get a single template's details.

## Examples

See **[examples/templates.json](examples/templates.json)** for ready-to-use templates:

- **code-review**: Review code with language, snippet, and focus
- **test-generator**: Generate tests for a function
- **documentation**: Write docs for components
- **refactor**: Refactor with constraints
- **bug-analysis**: Debug issues
- **api-design**: Design APIs

## Guides

- **[QUICK_START.md](QUICK_START.md)** – 30-second setup
- **[guides/team-workflow.md](guides/team-workflow.md)** – Step-by-step with examples
- **[guides/advanced.md](guides/advanced.md)** – Composition, scaling, integrations
- **[INSTALL.md](INSTALL.md)** – Troubleshooting

## Use Cases

### Code Review at Scale
Define a code-review template once. Teams reuse it for every code review with language, snippet, and focus.

### Test Generation Consistency
Use a test-generator template to ensure tests follow a consistent structure.

### Documentation Templates
Keep documentation consistent across projects with parameterized templates.

### Team Collaboration
Share templates in steering files so everyone uses the same prompts.

### Workflow Automation
Compose templates in Kiro workflows for multi-step tasks.

## How It Works

1. **Store templates** in persistent storage (`~/.kiro/positional-prompts/templates.json`)
2. **Render on demand** by substituting arguments into placeholders
3. **Reuse anywhere** – in chat, workflows, or other tools
4. **Share with teams** – include templates in steering files or documentation

## Architecture

- **server.js**: MCP server implementing the 4 tools
- **power.json**: Metadata and MCP server config
- **storage**: JSON file in `~/.kiro/positional-prompts/templates.json`

No external dependencies, no database, no backend.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT

## Publishing

To publish a new version:

```bash
npm version patch|minor|major
npm publish
```

See [PUBLISH_CHECKLIST.md](PUBLISH_CHECKLIST.md) for full details.

---

**Questions?** See the [guides](guides/) folder or open an issue.
