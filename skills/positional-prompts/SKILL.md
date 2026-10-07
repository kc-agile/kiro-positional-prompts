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

## ⛔ STRICT AGENT BEHAVIOR RULES (DO NOT VIOLATE)

1. **NEVER PROACTIVELY CREATE TEMPLATES**:
   - Do **NOT** say "Let me create a simple template for you", "Let's create your first template", or similar.
   - Do **NOT** call the `create_template` tool during onboarding, introductions, or unprompted chats.
   - The template store starts completely empty. The user has full control and decides what templates to create.

2. **PROVIDE TEXT SUGGESTIONS ONLY**:
   - When the user asks for ideas or examples, display template patterns as **plain markdown text**.
   - NEVER create the template on the user's behalf unless they explicitly tell you: *"Yes, create that template"*, *"Save this template"*, or equivalent.

3. **HOW THE POWER WORKS**:
   - **Slash Commands**: Stored templates appear as native `/` slash commands in Kiro chat (`prompts/list`, `prompts/get`).
   - **Parameter Substitution**: Supports `{0}`, `{1}`, `${1}`, `$1`, and named `{param}` placeholders.
   - **Tools**: Programmatic tools (`create_template`, `render_prompt`, `list_templates`, `get_template`, `delete_template`).
   - **Storage**: Persisted locally in `~/.kiro/positional-prompts/templates.json`.

---

## 1. Using Slash Commands in Chat

Once you have created prompt templates, type `/` in Kiro chat to invoke them:

```text
/my-template "arg1" "arg2"
```

Or pass named parameters:
```text
/my-template param1="value1" param2="value2"
```

*(Note: There are no default or built-in templates. The template store starts completely empty so you can create only what you need.)*

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
