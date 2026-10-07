# Onboarding Guide: Positional Prompts Power

Welcome to the **Positional Prompts Power** for Kiro! ⚡

This Power gives you and your AI agent the ability to define, manage, and invoke parameterized prompt templates using positional parameters (`{0}`, `{1}`, `${1}`, `$1`) and named parameters (`{param}`) with native slash-command support in Kiro Chat.

---

## 🎯 Core Principles

1. **User-Driven Creation**: The AI agent will **not** create templates automatically. You decide what templates you need.
2. **Helpful Suggestions**: When asked for ideas, the agent will suggest template structures and wait for your confirmation before saving them.
3. **Dual Protocol**: Works as native slash commands in Kiro Chat (`prompts/get`) and as programmatic tools for agents (`tools/call`).

---

## 💡 How to Use

### 1. In Kiro Chat (Slash Commands)
Once you create a template, type `/` in chat to invoke it directly:
```text
/code-review typescript "const add = (a, b) => a + b;" "type safety"
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
- macOS / Linux: `~/.kiro/positional-prompts\templates.json`

They persist across all your projects and chat sessions.
