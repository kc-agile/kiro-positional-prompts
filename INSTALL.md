# Installation Guide

## Quick Install

Add this to your `.kiro/settings/mcp.json`:

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

Then restart Kiro or reconnect MCP servers.

## Verify Installation

1. Open Kiro's MCP Server panel
2. Look for "positional-prompts" in the list
3. In chat, use the power's tools to create and render templates

## Local Development

To test locally before publishing:

```bash
npm link
```

Then in `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "positional-prompts": {
      "command": "node",
      "args": ["/path/to/server.js"],
      "disabled": false
    }
  }
}
```

## Troubleshooting

### MCP server won't connect
- Check that Node.js is installed: `node --version`
- Verify npx works: `npx --version`
- Try restarting Kiro

### Templates not persisting
- Check that `~/.kiro/positional-prompts/` directory exists
- Ensure the directory is writable: `ls -la ~/.kiro/positional-prompts/`

### Server crashes
- Check Kiro's console for error messages
- Try reinstalling: `npm uninstall @kiro-powers/positional-prompts && npm install @kiro-powers/positional-prompts@latest`
