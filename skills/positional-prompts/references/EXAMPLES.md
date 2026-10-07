# Template Examples

## code-review
Review code with language, code snippet, and focus areas.

**Template:**
```
Review this {0} code:

```{0}
{1}
```

Focus on: {2}
```

**Parameters:**
- {0}: Programming language (e.g., "TypeScript", "Python", "Go")
- {1}: Code snippet to review
- {2}: Focus areas (e.g., "performance, security", "readability")

**Usage:**
```json
{
  "name": "code-review",
  "args": [
    "Python",
    "def fibonacci(n):\n  if n <= 1: return n\n  return fibonacci(n-1) + fibonacci(n-2)",
    "time complexity and space efficiency"
  ]
}
```

**Result:**
```
Review this Python code:

```python
def fibonacci(n):
  if n <= 1: return n
  return fibonacci(n-1) + fibonacci(n-2)
```

Focus on: time complexity and space efficiency
```

## test-generator
Generate unit tests for a function.

**Template:**
```
Write unit tests for this {0} function:

```{0}
{1}
```

Test cases should cover: {2}
```

**Parameters:**
- {0}: Language
- {1}: Function code
- {2}: Test scope (edge cases, coverage goals, etc.)

**Usage:**
```json
{
  "name": "test-generator",
  "args": [
    "JavaScript",
    "const validate = (email) => /^[^@]+@[^@]+\\.[^@]+$/.test(email);",
    "valid emails, invalid formats, edge cases with dots"
  ]
}
```

## documentation
Write documentation for a component.

**Template:**
```
Write {0} documentation for this {1} component:

{2}

Target audience: {3}
```

**Parameters:**
- {0}: Documentation type (e.g., "API Reference", "User Guide", "Technical Architecture")
- {1}: Component/system name
- {2}: Component description
- {3}: Target audience (e.g., "backend developers", "end users", "DevOps engineers")

## refactor
Refactor code with constraints.

**Template:**
```
Refactor this {0} code:

```{0}
{1}
```

Constraints: {2}

Goal: {3}
```

**Parameters:**
- {0}: Language
- {1}: Code to refactor
- {2}: Constraints (e.g., "no breaking changes", "performance critical")
- {3}: Goal (e.g., "reduce duplication", "improve type safety")

## bug-analysis
Analyze and debug issues.

**Template:**
```
Analyze this {0} bug:

Error: {1}

Context: {2}

Expected behavior: {3}
```

**Parameters:**
- {0}: Language
- {1}: Error message or stack trace
- {2}: What you were doing when the error occurred
- {3}: Expected behavior

## api-design
Design APIs with requirements.

**Template:**
```
Design a {0} API for: {1}

Requirements: {2}

Constraints: {3}
```

**Parameters:**
- {0}: API type (e.g., "REST", "GraphQL", "gRPC")
- {1}: Use case/domain
- {2}: Functional requirements
- {3}: Technical constraints (performance, security, etc.)

## Custom Templates

You can create your own templates for any workflow. Some ideas:

- **security-review**: Analyze code for security vulnerabilities
- **performance-audit**: Profile and optimize code
- **architecture-review**: Evaluate system design
- **migration-plan**: Plan code migrations
- **release-notes**: Generate release documentation
- **incident-postmortem**: Analyze incidents

Template naming: Use lowercase with hyphens, e.g., "my-custom-template"
