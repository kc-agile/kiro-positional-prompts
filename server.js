#!/usr/bin/env node
/**
 * Positional Prompts MCP Server
 * Manages prompt templates with positional parameters
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Storage directory: ~/.kiro/positional-prompts
const homeDir = process.env.HOME || process.env.USERPROFILE || '~';
const storageDir = path.join(homeDir, '.kiro', 'positional-prompts');
const templatesFile = path.join(storageDir, 'templates.json');

// Ensure storage directory exists
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Load templates from disk
function loadTemplates() {
  if (fs.existsSync(templatesFile)) {
    try {
      const data = fs.readFileSync(templatesFile, 'utf-8');
      return new Map(JSON.parse(data));
    } catch (err) {
      console.error(`Failed to load templates: ${err.message}`);
      return new Map();
    }
  }
  return new Map();
}

// Save templates to disk
function saveTemplates(map) {
  try {
    const data = JSON.stringify(Array.from(map.entries()), null, 2);
    fs.writeFileSync(templatesFile, data, 'utf-8');
  } catch (err) {
    console.error(`Failed to save templates: ${err.message}`);
  }
}

// In-memory storage (persisted to disk)
const prompts = loadTemplates();

// Read stdin line by line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function sendResponse(id, result = null, error = null) {
  const response = { jsonrpc: '2.0', id };
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  console.log(JSON.stringify(response));
}

function handleRequest(req) {
  const { id, method, params } = req;

  switch (method) {
    case 'tools/list':
      sendResponse(id, {
        tools: [
          {
            name: 'create_template',
            description: 'Create a prompt template with positional parameters like {0}, {1}',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Template name (e.g., "code-review")' },
                template: { type: 'string', description: 'Template text with {0}, {1}, etc.' },
                description: { type: 'string', description: 'What this template does' }
              },
              required: ['name', 'template']
            }
          },
          {
            name: 'render_prompt',
            description: 'Fill a template with arguments',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Template name' },
                args: { type: 'array', items: { type: 'string' }, description: 'Arguments to fill {0}, {1}, etc.' }
              },
              required: ['name', 'args']
            }
          },
          {
            name: 'list_templates',
            description: 'List all available templates',
            inputSchema: { type: 'object', properties: {} }
          },
          {
            name: 'get_template',
            description: 'Get template details',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Template name' }
              },
              required: ['name']
            }
          }
        ]
      });
      break;

    case 'tools/call': {
      const { name, arguments: toolArgs } = params;

      if (name === 'create_template') {
        const { name: templateName, template, description } = toolArgs;
        prompts.set(templateName, {
          template,
          description: description || '',
          createdAt: new Date().toISOString()
        });
        saveTemplates(prompts);
        sendResponse(id, {
          success: true,
          message: `Template "${templateName}" created`,
          template: prompts.get(templateName)
        });
      }

      else if (name === 'render_prompt') {
        const { name: templateName, args } = toolArgs;
        const prompt = prompts.get(templateName);
        if (!prompt) {
          sendResponse(id, null, {
            code: -32602,
            message: `Template "${templateName}" not found`
          });
          return;
        }
        let rendered = prompt.template;
        args.forEach((arg, idx) => {
          rendered = rendered.replace(new RegExp(`\\{${idx}\\}`, 'g'), arg);
        });
        sendResponse(id, {
          success: true,
          template: templateName,
          rendered,
          argsUsed: args.length
        });
      }

      else if (name === 'list_templates') {
        const list = Array.from(prompts.entries()).map(([name, data]) => ({
          name,
          description: data.description,
          template: data.template,
          createdAt: data.createdAt
        }));
        sendResponse(id, { templates: list });
      }

      else if (name === 'get_template') {
        const { name: templateName } = toolArgs;
        const prompt = prompts.get(templateName);
        if (!prompt) {
          sendResponse(id, null, {
            code: -32602,
            message: `Template "${templateName}" not found`
          });
          return;
        }
        sendResponse(id, {
          name: templateName,
          ...prompt
        });
      }

      else {
        sendResponse(id, null, { code: -32601, message: 'Method not found' });
      }
      break;
    }

    default:
      sendResponse(id, null, { code: -32601, message: 'Method not found' });
  }
}

rl.on('line', (line) => {
  try {
    const req = JSON.parse(line);
    handleRequest(req);
  } catch (err) {
    console.error(`Parse error: ${err.message}`);
  }
});

rl.on('close', () => {
  process.exit(0);
});
