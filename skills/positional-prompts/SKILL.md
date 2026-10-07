---
name: positional-prompts
description: Template and reuse prompts with positional parameters
keywords:
  - prompts
  - templates
  - parametric
  - reuse
---

# Positional Prompts

Template and reuse prompts with positional parameters. Create templates with `{0}`, `{1}`, etc., then fill them with arguments.

## Quick Start

### 1. Create a Template

Use the MCP tool `create_template`:

```json
{
  "name": "code-review",
  "template": "Review this {0} code:\n\n```{0}\n{1}\n```\n\nFocus on: {2}",
  "description": "Code review template"
}
```

### 2. Render with Arguments

Use the MCP tool `render_prompt`:

```json
{
  "name": "code-review",
  "args": ["TypeScript", "const add = (a, b) => a + b;", "type safety"]
}
```

**Result:**
```
Review this TypeScript code:

```typescript
const add = (a, b) => a + b;
```

Focus on: type safety
```

## Available Tools

### `create_template`
Store a reusable prompt template with positional placeholders.

**Parameters:**
- `name` (string, required): Template identifier (e.g., "code-review")
- `template` (string, required): Template text with `{0}`, `{1}`, etc. placeholders
- `description` (string, optional): What the template does

### `render_prompt`
Fill a template with arguments.

**Parameters:**
- `name` (string, required): Template identifier
- `args` (array of strings, required): Values for `{0}`, `{1}`, etc., in order

### `list_templates`
List all stored templates.

### `get_template`
Get details of a single template.

**Parameters:**
- `name` (string, required): Template identifier

## Example Templates

### code-review
Review code with language, snippet, and focus area.

**Usage:**
```json
{
  "name": "code-review",
  "args": ["Python", "def fib(n):\n  if n <= 1: return n\n  return fib(n-1) + fib(n-2)", "time complexity"]
}
```

### test-generator
Generate unit tests for a function.

**Usage:**
```json
{
  "name": "test-generator",
  "args": ["JavaScript", "const validate = (email) => /^.+@.+\\..+$/.test(email);", "valid emails, invalid emails"]
}
```

### documentation
Write documentation for a component.

**Usage:**
```json
{
  "name": "documentation",
  "args": ["API Reference", "User authentication", "REST endpoint documentation", "backend developers"]
}
```

## How It Works

1. **Define** a template with positional placeholders (`{0}`, `{1}`, etc.)
2. **Store** it with `create_template`
3. **Render** with `render_prompt` by passing arguments
4. **Reuse** the same template with different arguments

Templates are persisted to `~/.kiro/positional-prompts/templates.json` and survive across sessions.

## Typical Workflow

1. Create a template for a common task (e.g., code review)
2. Render it with your specific context (language, code, focus)
3. Copy the rendered prompt and use it in chat or workflows
4. Reuse the template next time without rewriting

## Team Collaboration

Share templates in `.kiro/steering/` files so teammates discover and reuse them:

```markdown
# Team Prompts

## code-review
Template: `code-review`
Parameters: language, code snippet, focus areas

## test-generator  
Template: `test-generator`
Parameters: language, function, test scope
```

## Storage

Templates are saved as JSON in `~/.kiro/positional-prompts/templates.json`. They persist across sessions and workspaces.

## See Also

- [Team Workflow Guide](guides/team-workflow.md) – Step-by-step usage guide
- [Advanced Strategies](guides/advanced.md) – Composition, scaling, integrations
- [Examples](examples/templates.json) – Ready-to-use templates
