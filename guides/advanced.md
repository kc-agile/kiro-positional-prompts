# Advanced: Templating Strategies

## Dynamic Prompt Libraries

### Using Steering Files to Store Templates

Create `.kiro/steering/my-prompts.md` with `inclusion: manual`:

```markdown
---
inclusion: manual
name: My Prompt Library
description: Team-specific prompts for our project
---

# Prompt Templates

## bug-fix-workflow
When a bug is reported, use this template:

Template ID: `bug-fix`
Parameters:
1. Bug description
2. Steps to reproduce
3. Expected vs actual
4. Environment

Example render:
- "Login fails for Gmail accounts"
- "1. Go to signup\n2. Select 'Gmail'\n3. Try to proceed"
- "Should open OAuth dialog / Shows blank screen"
- "Chrome 120, macOS Sonoma"

## feature-planning
For planning new features:

Template ID: `feature-plan`
Parameters:
1. Feature name
2. Use case
3. Success criteria
4. Constraints

...
```

Then in chat, use `#My Prompt Library` to surface it, and reference the template ID when rendering.

### Auto-Generating Prompts from Code

Hook into Kiro to auto-generate templates from code patterns:

Create `.kiro/hooks/analyze-on-save.json`:
```json
{
  "version": "v1",
  "hooks": [{
    "name": "Auto-generate review prompt",
    "trigger": "PostFileSave",
    "matcher": "\\.ts$",
    "action": {
      "type": "command",
      "command": "node generate-template.js"
    }
  }]
}
```

Your `generate-template.js` could:
1. Read the saved file
2. Extract function/class signatures
3. Create a review template with that code

## Prompt Composition

Combine multiple templates into a workflow:

```
1. Use "test-generator" to create tests
2. Use "code-review" to review the tests
3. Use "documentation" to document the new function
```

Store this workflow in a steering file:

```markdown
# Test-Driven Development Workflow

1. **Generate Tests**
   Template: `test-generator`
   Args: [language, function, coverage]

2. **Review Tests**
   Template: `code-review`
   Args: [language, generated tests, focus on correctness]

3. **Document**
   Template: `documentation`
   Args: ["Function Docs", function name, brief description, developers]
```

## Multi-Parameter Templates

For complex prompts, use many parameters:

```json
{
  "name": "pr-review-comprehensive",
  "template": "Review this PR for {0} project:\n\nChanges:\n{1}\n\nTest coverage: {2}\n\nPerformance impact: {3}\n\nSecurity concerns: {4}\n\nBackcompat: {5}",
  "description": "Comprehensive PR review template"
}
```

Then render:
```json
{
  "name": "pr-review-comprehensive",
  "args": [
    "auth-service",
    "Added JWT refresh token rotation",
    "95% coverage, added 12 tests",
    "Token refresh is now O(1) vs O(n)",
    "None identified",
    "Tokens issued before this PR will still work"
  ]
}
```

## Conditional Templates

Create multiple variants for different contexts:

```json
// For quick fixes
{ "name": "bug-fix-quick", "template": "Fix: {0}\n\n{1}" }

// For complex bugs
{ "name": "bug-fix-complex", "template": "Complex bug: {0}\n\nContext: {1}\n\nRoot cause analysis: {2}\n\nProposed fix: {3}" }

// For security bugs
{ "name": "bug-fix-security", "template": "Security bug: {0}\n\nImpact: {1}\n\nWorkaround: {2}\n\nPermanent fix: {3}" }
```

Choose the right template for the situation.

## Integration with Workflows

Use templates in Kiro workflow steps:

In a workflow YAML, capture a rendered prompt:

```yaml
steps:
  - name: render-prompt
    agent: wf-coder
    prompt: |
      Use the positional-prompts power to render the "code-review" template:
      - Language: JavaScript
      - Code: [read from {{file.path}}]
      - Focus: performance and security
      
      Show me the rendered prompt.
```

Then use that rendered prompt in the next step for actual analysis.

## Tips for Scale

1. **Namespace templates**: Prefix with domain. `auth-code-review`, `api-design`, `db-schema`
2. **Version templates**: If changing significantly, increment. `code-review-v1`, `code-review-v2`
3. **Document ownership**: In steering, note who maintains each template
4. **Archive old templates**: Keep them but mark deprecated
5. **Metrics**: Track which templates are used most; refine the popular ones

## Combining with AI

Use rendered prompts with Kiro's AI:

```
1. Create template: "code-analysis"
2. Render with your code
3. Paste rendered prompt into Kiro chat
4. AI provides analysis
5. Save useful results back to templates
```

Iterate: good prompts become templates; templates are reused and refined.
