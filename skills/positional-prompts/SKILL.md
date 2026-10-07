---
name: positional-prompts
description: Create, manage, and invoke prompt templates with positional parameters ({0}, {1}, $1, $2) and slash commands
keywords:
  - prompts
  - templates
  - parametric
  - slash-commands
  - mcp
---

# Positional Prompts Power

Manage and invoke reusable prompt templates with positional parameters (`{0}`, `{1}`, `${1}`, `$1`) and interactive slash commands in Kiro.

## How It Works in Kiro

When this Power is active, Kiro automatically registers stored prompt templates as **MCP Prompts**:
1. **Interactive Slash Commands**: Type `/` in Kiro chat to see prompts like `/code-review`, `/test-generator`, `/refactor`, etc.
2. **Positional & Named Substitution**: Supports `{0}`, `{1}`, `${1}`, `${2}`, `$1`, `$2`, and named placeholders `{language}`, `{code}`.
3. **Agent MCP Tools**: The agent can create, list, render, and delete prompt templates on the fly.
4. **Persistent Storage**: Saved in `~/.kiro/positional-prompts/templates.json` across workspaces and sessions.

---

## 1. Using Slash Commands in Chat

Type `/` in Kiro chat to choose a template, or invoke it directly:

```
/code-review language="TypeScript" code="const add = (a, b) => a + b;" focus="type safety"
```

Or pass positional parameters:
```
/code-review TypeScript "const add = (a, b) => a + b;" "type safety"
```

### Built-in Templates
- `/code-review` – Structured code review with language, snippet, and focus area.
- `/test-generator` – Generate comprehensive unit tests covering edge cases.
- `/refactor` – Refactor code with specific constraints and goals.
- `/bug-analysis` – Analyze stack traces and propose bug fixes.
- `/explain` – Explain code architecture for a specific developer audience.
- `/api-design` – Design REST/GraphQL API contracts and endpoints.

---

## 2. Using MCP Tools (Agent Workflows)

When writing automation scripts or interacting via the AI agent, use the registered MCP tools:

### `create_template`
Create a new reusable prompt template.
```json
{
  "name": "sql-optimizer",
  "template": "Optimize this {0} SQL query:\n\n```sql\n{1}\n```\n\nTarget latency: {2}",
  "description": "SQL query optimization template",
  "paramNames": ["dialect", "query", "target_latency"]
}
```

### `render_prompt`
Render a prompt with arguments (array or object):
```json
{
  "name": "sql-optimizer",
  "args": ["PostgreSQL", "SELECT * FROM users WHERE status = 'active';", "< 50ms"]
}
```

### `list_templates`
List all currently stored templates.

### `get_template`
Retrieve the template text, description, and parameter names.

### `delete_template`
Remove an existing template.

---

## 3. Placeholder Formats Supported

| Format | Example | Description |
|---|---|---|
| `{0}`, `{1}`, `{2}` | `Review {0} code: {1}` | 0-indexed positional placeholders |
| `${1}`, `${2}` | `Review ${1} code: ${2}` | 1-indexed Copilot / bash style |
| `$1`, `$2` | `Review $1 code: $2` | 1-indexed shorthand |
| `{name}` | `Review {language} code: {code}` | Named parameter replacement |

---

## 4. Alternative: Native File Prompts (`.kiro/prompts/`)

For workspace-scoped static prompt files that don't need persistent MCP storage, Kiro also natively supports markdown files placed in `.kiro/prompts/`:

**`.kiro/prompts/code-review.md`**:
```markdown
Review this ${1} code:

```${1}
${2}
```

Focus on: ${3}
```
Invoked in chat via:
```
/code-review typescript "const x = 1;" "clean code"
```
