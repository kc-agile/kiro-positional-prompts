# Example Templates

This folder contains example prompt templates for common tasks. You can import these into your power or use them as inspiration for creating your own.

## Templates Included

### code-review
Review code with language, snippet, and focus area.

**Parameters:**
- `{0}`: Programming language (e.g., "JavaScript", "Python")
- `{1}`: Code snippet to review
- `{2}`: Focus areas (e.g., "performance, security, readability")

**Example:**
```json
{
  "name": "code-review",
  "args": ["TypeScript", "const data = [1,2,3].map(x => x * 2);", "type safety, readability"]
}
```

### test-generator
Generate unit tests for a function.

**Parameters:**
- `{0}`: Language
- `{1}`: Function code
- `{2}`: Test coverage scope

### documentation
Write documentation for a component.

**Parameters:**
- `{0}`: Doc type (e.g., "API", "User Guide", "Architecture")
- `{1}`: Component/technology
- `{2}`: Component description
- `{3}`: Target audience (e.g., "backend developers", "end users")

### refactor
Refactor code with constraints.

**Parameters:**
- `{0}`: Language
- `{1}`: Code to refactor
- `{2}`: Constraints (e.g., "no breaking changes", "improve performance")
- `{3}`: Goal (e.g., "reduce duplication", "increase type safety")

### bug-analysis
Debug and analyze issues.

**Parameters:**
- `{0}`: Language
- `{1}`: Error message
- `{2}`: Context (e.g., "What were you doing?")
- `{3}`: Expected behavior

### api-design
Design APIs with requirements.

**Parameters:**
- `{0}`: API type (e.g., "REST", "GraphQL")
- `{1}`: Use case (e.g., "user authentication", "file upload")
- `{2}`: Requirements
- `{3}`: Constraints

## How to Use

1. Copy a template from `templates.json`
2. Use `create_template` to add it to your power
3. Use `render_prompt` with your specific arguments

Or, teams can add these templates to their `.kiro/steering/` directory and reference them in documentation.

## Creating Your Own

Follow this pattern:
- Keep templates **generic and reusable**
- Use clear parameter names (document what each `{n}` represents)
- Provide **good context** in the template text
- Test with different argument combinations
