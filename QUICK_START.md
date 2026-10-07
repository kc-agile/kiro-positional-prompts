# Quick Start: Positional Prompts Power

## Install (30 seconds)

Add to `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "positional-prompts": {
      "command": "npx",
      "args": ["@kiro-powers/positional-prompts"],
      "disabled": false
    }
  }
}
```

Restart Kiro. Done.

## Use

### 1. Create a template

Use the MCP tool `create_template`:

```
name: "code-review"
template: "Review this {0} code:\n\n{1}\n\nFocus on: {2}"
description: "Code review template"
```

### 2. Render with arguments

Use the MCP tool `render_prompt`:

```
name: "code-review"
args: ["TypeScript", "const add = (a: number, b: number) => a + b;", "type safety"]
```

**Output:**
```
Review this TypeScript code:

const add = (a: number, b: number) => a + b;

Focus on: type safety
```

Copy and paste into chat. Done.

## Why?

- **Reuse prompts**: Define once, use anywhere
- **Consistency**: Same structure, same quality
- **Sharing**: Teams share prompt templates
- **No overhead**: No dependencies, no bloat

## Examples

See `examples/templates.json` for 6 ready-to-use templates:
- code-review
- test-generator
- documentation
- refactor
- bug-analysis
- api-design

## Learn More

- [Team Workflow Guide](guides/team-workflow.md) – Step-by-step with examples
- [Advanced Strategies](guides/advanced.md) – Composition, scaling, integrations
- [Installation](INSTALL.md) – Troubleshooting and setup
