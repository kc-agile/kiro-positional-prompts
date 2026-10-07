# Positional Prompts API Reference

## Tools

### create_template
Store a reusable prompt template with positional placeholders.

**Parameters:**
- `name` (string, required): Template identifier. Use kebab-case, e.g., "code-review"
- `template` (string, required): Template text with `{0}`, `{1}`, `{2}`, etc. placeholders
- `description` (string, optional): Human-readable description of what the template does

**Returns:**
```json
{
  "success": true,
  "message": "Template \"<name>\" created",
  "template": {
    "template": "...",
    "description": "...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Example:**
```json
{
  "name": "create_template",
  "arguments": {
    "name": "code-review",
    "template": "Review this {0} code:\n\n```{0}\n{1}\n```\n\nFocus on: {2}",
    "description": "Structured code review with language, snippet, and focus areas"
  }
}
```

### render_prompt
Fill a template with arguments.

**Parameters:**
- `name` (string, required): Template identifier
- `args` (array of strings, required): Values for `{0}`, `{1}`, etc., in order

**Returns:**
```json
{
  "success": true,
  "template": "<template_name>",
  "rendered": "...",
  "argsUsed": 3
}
```

**Example:**
```json
{
  "name": "render_prompt",
  "arguments": {
    "name": "code-review",
    "args": [
      "TypeScript",
      "const greet = (name: string) => `Hello, ${name}!`;",
      "type safety and conciseness"
    ]
  }
}
```

### list_templates
List all stored templates.

**Parameters:** None

**Returns:**
```json
{
  "templates": [
    {
      "name": "code-review",
      "description": "...",
      "template": "...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### get_template
Get details of a single template.

**Parameters:**
- `name` (string, required): Template identifier

**Returns:**
```json
{
  "name": "<template_name>",
  "template": "...",
  "description": "...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Error Responses

When a template is not found:
```json
{
  "error": {
    "code": -32602,
    "message": "Template \"<name>\" not found"
  }
}
```

## Storage Location

Templates are persisted as JSON at:
- **Linux/Mac**: `~/.kiro/positional-prompts/templates.json`
- **Windows**: `%USERPROFILE%\.kiro\positional-prompts\templates.json`

## Data Format

Each template is stored as:
```json
{
  "template": "Template text with {0}, {1}, ...",
  "description": "Optional description",
  "createdAt": "ISO 8601 timestamp"
}
```
