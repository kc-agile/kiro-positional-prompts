# Positional Prompts Power - Steering Guide

## Overview

The **Positional Prompts Power** enables reusable prompt templates with positional (`{0}`, `{1}`, `${1}`, `$1`) and named (`{param}`) placeholders in Kiro.

---

## Agent Behavior & Guidelines

- **User-Driven Creation**: Do **not** create templates automatically. The user decides what templates they need.
- **Provide Suggestions**: When the user asks for prompt ideas, offer helpful template suggestions and let the user choose which ones to create.
- **Confirmation**: Only call the `create_template` tool when the user explicitly requests to create or save a template.

---

## Template Suggestions for Users

Here are common template patterns you can suggest to users:

### 1. Code Review
- **Name:** `code-review`
- **Parameters:** `language`, `code`, `focus`
- **Template:**
  ```text
  Review this {0} code for quality and best practices:

  ```{0}
  {1}
  ```

  Focus on: {2}
  ```

### 2. Test Generator
- **Name:** `test-generator`
- **Parameters:** `language`, `code`, `test_scope`
- **Template:**
  ```text
  Write comprehensive unit tests for this {0} function:

  ```{0}
  {1}
  ```

  Test scope and coverage requirements: {2}
  ```

### 3. Refactoring
- **Name:** `refactor`
- **Parameters:** `language`, `code`, `constraints`, `goal`
- **Template:**
  ```text
  Refactor this {0} code to improve readability and maintainability:

  ```{0}
  {1}
  ```

  Constraints: {2}
  Goal: {3}
  ```

### 4. Bug Analysis
- **Name:** `bug-analysis`
- **Parameters:** `language`, `error_message`, `code`, `expected_behavior`
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

---

## Supported Placeholder Formats

| Format | Example | Description |
|---|---|---|
| `{0}`, `{1}`, `{2}` | `Review {0} code: {1}` | 0-indexed positional placeholders |
| `${1}`, `${2}` | `Review ${1} code: ${2}` | 1-indexed Copilot & shell style |
| `$1`, `$2` | `Review $1 code: $2` | 1-indexed shorthand |
| `{name}` | `Review {language} code: {code}` | Named parameter replacement |

---

## Available Tools

- `create_template`: Store a prompt template when requested by the user.
- `render_prompt`: Fill a stored template with arguments.
- `list_templates`: View all currently stored templates.
- `get_template`: Retrieve details of a specific template.
- `delete_template`: Delete a template by name.
