# Contributing

## Development

This power ships as an npm package with a single MCP server (`server.js`).

### Local Testing

1. Clone this repo
2. Link locally: `npm link`
3. Update `.kiro/settings/mcp.json` to point to your local copy
4. Restart Kiro and test

### Adding Features

- Keep the server lightweight—no heavy dependencies
- Follow the MCP spec for request/response format
- Document new tools in `guides/getting-started.md`
- Test with the Kiro MCP UI or via direct calls

### Submitting Changes

- Make a branch
- Test your changes
- Submit a PR with a clear description

## Publishing

This power is published to npm as `@kiro-powers/positional-prompts`.

To publish a new version:

```bash
npm version patch|minor|major
npm publish
```

Update the docs with the new version number.
