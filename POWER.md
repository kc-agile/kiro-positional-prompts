---
name: "kiro-positional-prompts"
displayName: "Positional Prompts"
description: "Template and reuse prompts with positional parameters ({0}, {1}, $1, $2) and interactive slash commands in Kiro."
keywords: ["prompts", "templates", "positional-parameters", "slash-commands", "mcp"]
author: "Krishna Chaitanya Rupavatharam (KC)"
version: "2.0.0"
iconUrl: "https://raw.githubusercontent.com/kc-agile/kiro-positional-prompts/main/icon.svg"
icon: "icon.svg"
---

# Positional Prompts Power

**Created by Krishna Chaitanya Rupavatharam (KC)**

Bring GitHub Copilot-style positional parameter prompt templates (`{0}`, `{1}`, `$1`, `$2`) and interactive slash commands to **Kiro**.

---

## ⚡ Features

- **Interactive Slash Commands**: Run `/positional-prompts <template> <args...>` directly in Kiro chat.
- **Flexible Placeholders**: Supports `{0}`, `{1}`, `${1}`, `$1`, and named `{param}` substitutions.
- **Zero Auto-Creation**: Starts with a clean, empty store—you decide what templates to define.
- **Persistent Storage**: Saved locally in `~/.kiro/positional-prompts/templates.json` across sessions.

---

## 🚀 Execution Behavior (CRITICAL RULE)

When a prompt template is invoked (either via slash command in chat or via the `render_prompt` tool):
1. **Execute, Never Just Echo**: The agent MUST immediately process and fulfill the instructions in the prompt. Deliver the actual completed work (e.g. the summary, the code review, the unit tests, or the analysis).
2. **Never Stop at the Prompt**: The user invokes a template to get the actual answer, NOT to see an empty or filled prompt template. Always provide the complete solution.

---

## 💡 Quick Example

Invoke templates in chat:
```text
/positional-prompts multiply-by-nine 5      → 5 × 9 = 45
/positional-prompts multiply-by-nine 100    → 100 × 9 = 900
/positional-prompts multiply-by-nine 7.5    → 7.5 × 9 = 67.5
```

---

## 👤 Author

**Krishna Chaitanya Rupavatharam (KC)**
- GitHub: [@kc-agile](https://github.com/kc-agile)
- Repository: [kc-agile/kiro-positional-prompts](https://github.com/kc-agile/kiro-positional-prompts)
- License: MIT
