# Team Workflow: Positional Prompts

This guide shows teams how to create and share prompt templates across projects.

## Setup (One-Time)

1. **Install the power:**
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

2. **Restart Kiro** and verify the server appears in the MCP servers panel.

## Workflow: Define, Reuse, Share

### Step 1: Create a Template (One Person, Once)

Define a prompt template with positional parameters. For example, a code review prompt:

**Tool:** `create_template`

```json
{
  "name": "code-review",
  "template": "Review this {0} code:\n\n```{0}\n{1}\n```\n\nFocus on: {2}",
  "description": "Structured code review with language, code, and focus areas"
}
```

**Result:** Template stored and persisted.

### Step 2: Reuse the Template (Any Time, Anyone)

When anyone needs that prompt, they render it with their specific arguments:

**Tool:** `render_prompt`

```json
{
  "name": "code-review",
  "args": ["TypeScript", "const greet = (name: string) => `Hello, ${name}!`;", "type safety and conciseness"]
}
```

**Result:**
```
Review this TypeScript code:

```typescript
const greet = (name: string) => `Hello, ${name}!`;
```

Focus on: type safety and conciseness
```

Copy this rendered text and paste it into your Kiro chat.

### Step 3: Share Templates (Optional)

Store your team's templates in a steering file for discovery:

**`.kiro/steering/prompts.md`** (with `inclusion: manual`):
```markdown
---
inclusion: manual
---

# Team Prompt Templates

## code-review
Review code with specific focus areas.

Template: `code-review`
Parameters: language, code snippet, focus areas

Example:
- {0}: "Python"
- {1}: "def fibonacci(n):\n  if n <= 1: return n\n  return fibonacci(n-1) + fibonacci(n-2)"
- {2}: "time complexity, readability"

## api-design
Design APIs with requirements and constraints.

Template: `api-design`
...
```

## Common Patterns

### Pattern 1: Code Review at Different Levels

Create templates for different review depths:

```json
// Quick review
{
  "name": "quick-review",
  "template": "Quick review of this {0}:\n\n{1}\n\nAny obvious issues?"
}

// Deep review
{
  "name": "deep-review",
  "template": "Deep review of this {0}:\n\n{1}\n\nAnalyze: {2}\n\nSuggest improvements for: {3}"
}
```

### Pattern 2: Language-Specific Templates

```json
{
  "name": "typescript-review",
  "template": "Review this TypeScript code for type safety and patterns:\n\n{0}\n\nSpecific concerns: {1}"
}

{
  "name": "python-review",
  "template": "Review this Python code for idioms and performance:\n\n{0}\n\nSpecific concerns: {1}"
}
```

### Pattern 3: Domain-Specific Prompts

```json
{
  "name": "database-design",
  "template": "Design a database schema for {0}.\n\nRequirements: {1}\n\nConstraints: {2}"
}

{
  "name": "security-audit",
  "template": "Security audit of {0}.\n\nCurrent implementation: {1}\n\nThreat model: {2}"
}
```

## Best Practices

1. **Name templates clearly**: Use lowercase, hyphens. Examples: `code-review`, `test-generator`, `api-design`
2. **Document parameters**: In descriptions or steering files, explain what each `{0}`, `{1}` represents
3. **Keep templates reusable**: Avoid overly specific wording; let arguments provide context
4. **Version important templates**: If a template changes significantly, create a new one (e.g., `code-review-v2`)
5. **Share templates in steering files**: List available templates so teammates discover them
6. **Test before sharing**: Render a template with sample args to verify it works as intended

## Troubleshooting

### Template not found
Make sure you created it with `create_template` first. List all templates with `list_templates`.

### Arguments in wrong order
Double-check that args match the template's `{0}`, `{1}`, etc. order. Use `get_template` to see the template's structure.

### Want to edit a template?
Create a new one with a slightly different name. The old one stays for backwards compatibility.

## Examples

See `../examples/templates.json` for ready-to-use templates.
