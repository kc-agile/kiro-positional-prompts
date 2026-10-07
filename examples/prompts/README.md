# Native File Prompt Examples (.kiro/prompts/)

If you prefer file-based prompts stored directly in your workspace instead of (or alongside) the MCP Power, you can copy these `.md` files to your workspace's `.kiro/prompts/` directory.

## How to Use

1. Copy any `.md` file to `.kiro/prompts/` in your workspace (or `~/.kiro/prompts/` for global availability).
2. Kiro automatically discovers them as slash commands.
3. In chat, type the command:
   ```text
   /code-review typescript "const sum = (a, b) => a + b;" "edge cases"
   ```

## File Prompts Syntax

Kiro file prompts use:
- `${1}`, `${2}`, `${3}` for positional arguments
- `$ARGUMENTS` or `${@}` for all arguments
