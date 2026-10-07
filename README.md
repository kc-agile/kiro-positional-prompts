# Positional Prompts Power

A Kiro Power for templating and reusing prompts with positional parameters.

## Install

Add to your `.kiro/settings/mcp.json`:

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

Then restart Kiro or reconnect the MCP server.

## Usage

### Create a Template

Store a reusable prompt template with `{0}`, `{1}`, ... placeholders.

**Tool:** `create_template`

```json
{
  "name": "code-review",
  "template": "Review this {0} code:\n\n{1}\n\nFocus on: {2}",
  "description": "Code review template"
}
```

### Render a Template

Fill a template with arguments.

**Tool:** `render_prompt`

```json
{
  "name": "code-review",
  "args": ["TypeScript", "const greet = (name) => `Hello, ${name}!`;", "readability and performance"]
}
```

### List All Templates

**Tool:** `list_templates` (no parameters)

### Get Template Details

**Tool:** `get_template`

```json
{
  "name": "code-review"
}
```

## How It Works

1. **Create**: Define a template with positional placeholders.
2. **Reuse**: Render the template by passing arguments—no need to rewrite the prompt.
3. **Share**: Store templates in your steering files or share them across your team.

## Example: Code Review Workflow

```
Template:
  "Review this {0} code:\n\n{1}\n\nFocus on: {2}"

Rendered with ["Python", "def fib(n):\n  if n <= 1: return n\n  return fib(n-1) + fib(n-2)", "time complexity"]:
  "Review this Python code:
  
  def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)
  
  Focus on: time complexity"
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
