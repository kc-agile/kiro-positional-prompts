# Onboarding Guide: Positional Prompts Power

Welcome to the **Positional Prompts Power** for Kiro! ⚡

This Power gives you and your AI agent the ability to define, manage, and invoke parameterized prompt templates using positional parameters (`{0}`, `{1}`, `${1}`, `$1`) and named parameters (`{param}`) with native slash-command support in Kiro Chat.

---

## 🎯 Core Principles

1. **User-Driven Creation (Zero Auto-Creation)**: The AI agent will **never** proactively create or offer to create templates (no *"Let me create a simple template for you"*). The user has complete control and decides what templates to create.
2. **Helpful Suggestions Only**: When asked for ideas, the agent will suggest template structures in plain text and wait for your explicit confirmation before saving anything.
3. **Inspect Before Create**: When asked to create a template, the agent must call `list_templates` first to verify existing templates and avoid overwriting any existing template unexpectedly.
4. **Execute, Never Just Echo**: When a template is invoked, the AI agent must immediately process and fulfill the prompt's instructions, delivering the complete finished answer rather than merely echoing the prompt text.
5. **Dual Protocol**: Works as native slash commands in Kiro Chat (`prompts/get`) and as programmatic tools for agents (`tools/call`).

---

## 💡 How to Use

### 1. In Kiro Chat (Slash Commands)
Once you create a template, invoke it via the power namespace:
```text
/positional-prompts multiply-by-nine 5
/positional-prompts code-review typescript "const add = (a, b) => a + b;" "type safety"
```

### 2. Available Tools for the Agent
- `create_template`: Store a prompt template when requested by the user.
- `render_prompt`: Fill a template with arguments.
- `list_templates`: View all currently stored templates.
- `get_template`: Retrieve details of a specific template.
- `delete_template`: Delete a template by name.

---

## 📋 Suggested Template Patterns

When you want to create templates, here are popular starting points:

### Code Review
- **Name:** `code-review`
- **Template:**
  ```text
  Review this {0} code for quality and best practices:

  ```{0}
  {1}
  ```

  Focus on: {2}
  ```
- **Parameters:** `language`, `code`, `focus`

### Test Generator
- **Name:** `test-generator`
- **Template:**
  ```text
  Write comprehensive unit tests for this {0} function:

  ```{0}
  {1}
  ```

  Test scope and coverage requirements: {2}
  ```
- **Parameters:** `language`, `code`, `test_scope`

### Refactoring
- **Name:** `refactor`
- **Template:**
  ```text
  Refactor this {0} code to improve readability and maintainability:

  ```{0}
  {1}
  ```

  Constraints: {2}
  Goal: {3}
  ```
- **Parameters:** `language`, `code`, `constraints`, `goal`

### Bug Analysis
- **Name:** `bug-analysis`
- **Template:**
  ```text
  Analyze and fix this {0} bug:

  Error / Symptom:
  {1}

  Relevant Code:
  ```{0}
  {2}
  ```

  Expected behavior:
  {3}
  ```
- **Parameters:** `language`, `error_message`, `code`, `expected_behavior`

---

## 🔤 Supported Parameter Syntax

| Format | Example | Description |
|---|---|---|
| `{0}`, `{1}`, `{2}` | `Review {0} code: {1}` | 0-indexed positional placeholders |
| `${1}`, `${2}` | `Review ${1} code: ${2}` | 1-indexed Copilot & shell style |
| `$1`, `$2` | `Review $1 code: $2` | 1-indexed shorthand |
| `{name}` | `Review {language} code: {code}` | Named parameter replacement |

---

## 💾 Storage

Templates are saved locally in:
- Windows: `%USERPROFILE%\.kiro\positional-prompts\templates.json`
- macOS / Linux: `~/.kiro/positional-prompts/templates.json`

They persist across all your projects and chat sessions.
