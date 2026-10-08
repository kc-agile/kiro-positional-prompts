#!/usr/bin/env node
/**
 * Positional Prompts MCP Server & Kiro Power
 * Author: Krishna chaitanya Rupavatharam
 * 
 * Implements:
 * 1. MCP Prompts Protocol (prompts/list, prompts/get) for interactive slash commands in Kiro Chat
 * 2. MCP Tools Protocol (tools/list, tools/call) for creating, rendering, and managing templates
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
  try {
    fs.mkdirSync(storageDir, { recursive: true });
  } catch (err) {
    // Ignore if already created or cannot create
  }
}

// Load templates from disk (starts empty if no templates created yet)
function loadTemplates() {
  if (fs.existsSync(templatesFile)) {
    try {
      const data = fs.readFileSync(templatesFile, 'utf-8');
      const parsed = JSON.parse(data);
      return new Map(parsed);
    } catch (err) {
      console.error(`Failed to load templates: ${err.message}`);
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

// Helper: Substitute positional & named placeholders
function substituteTemplate(template, args, paramNames = []) {
  let rendered = template;
  if (!args) return rendered;

  if (Array.isArray(args)) {
    args.forEach((val, idx) => {
      const strVal = String(val ?? '');
      // {0}, {1}...
      rendered = rendered.split(`{${idx}}`).join(strVal);
      // ${1}, ${2}... (1-indexed bash/copilot style)
      rendered = rendered.split(`\${${idx + 1}}`).join(strVal);
      // $1, $2...
      rendered = rendered.replace(new RegExp(`\\$${idx + 1}(?!\\d)`, 'g'), strVal);
      // If paramNames has a name for this index, replace {name}
      if (paramNames && paramNames[idx]) {
        rendered = rendered.split(`{${paramNames[idx]}}`).join(strVal);
      }
    });
  } else if (typeof args === 'object') {
    // 1. If paramNames is known, map named keys to positional placeholders
    if (Array.isArray(paramNames)) {
      paramNames.forEach((name, idx) => {
        if (args[name] !== undefined) {
          const strVal = String(args[name]);
          rendered = rendered.split(`{${idx}}`).join(strVal);
          rendered = rendered.split(`\${${idx + 1}}`).join(strVal);
          rendered = rendered.replace(new RegExp(`\\$${idx + 1}(?!\\d)`, 'g'), strVal);
          rendered = rendered.split(`{${name}}`).join(strVal);
        }
      });
    }

    // 2. Map all provided keys directly
    for (const [key, val] of Object.entries(args)) {
      const strVal = String(val ?? '');
      rendered = rendered.split(`{${key}}`).join(strVal);

      if (/^\d+$/.test(key)) {
        const num = parseInt(key, 10);
        rendered = rendered.split(`{${num}}`).join(strVal);
        rendered = rendered.split(`\${${num + 1}}`).join(strVal);
        rendered = rendered.replace(new RegExp(`\\$${num + 1}(?!\\d)`, 'g'), strVal);
        if (paramNames && paramNames[num]) {
          rendered = rendered.split(`{${paramNames[num]}}`).join(strVal);
        }
      }
    }
  }

  return rendered;
}

// Helper: Build MCP prompt argument schema for a template
function getPromptArguments(data) {
  if (data.paramNames && Array.isArray(data.paramNames) && data.paramNames.length > 0) {
    return data.paramNames.map((p, idx) => ({
      name: p,
      description: `Argument ${idx}: ${p}`,
      required: idx === 0
    }));
  }

  const matches = Array.from(data.template.matchAll(/\{(\w+)\}/g));
  const uniqueKeys = [...new Set(matches.map(m => m[1]))];
  
  if (uniqueKeys.length === 0) return [];

  return uniqueKeys.map((key, idx) => ({
    name: key,
    description: `Argument ${key}`,
    required: idx === 0
  }));
}

// In-memory template store
const prompts = loadTemplates();

// Line-by-line stdio interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function sendResponse(id, result = null, error = null) {
  if (id === undefined || id === null) return;
  const response = { jsonrpc: '2.0', id };
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  console.log(JSON.stringify(response));
}

function handleRequest(req) {
  const { id, method, params = {} } = req;

  switch (method) {
    case 'initialize': {
      sendResponse(id, {
        protocolVersion: '2024-11-05',
        capabilities: {
          prompts: {},
          tools: {}
        },
        serverInfo: {
          name: 'positional-prompts',
          version: '1.0.0'
        }
      });
      break;
    }

    case 'notifications/initialized':
    case 'initialized': {
      break;
    }

    case 'ping': {
      sendResponse(id, {});
      break;
    }

    case 'prompts/list': {
      const list = Array.from(prompts.entries()).map(([name, data]) => ({
        name,
        description: data.description || `Prompt template: ${name}`,
        arguments: getPromptArguments(data)
      }));
      sendResponse(id, { prompts: list });
      break;
    }

    case 'prompts/get': {
      const { name: promptName, arguments: promptArgs } = params;
      const prompt = prompts.get(promptName);
      if (!prompt) {
        sendResponse(id, null, {
          code: -32602,
          message: `Prompt template "${promptName}" not found`
        });
        return;
      }

      const rendered = substituteTemplate(prompt.template, promptArgs, prompt.paramNames);

      sendResponse(id, {
        description: prompt.description,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: rendered
            }
          }
        ]
      });
      break;
    }

    case 'tools/list': {
      sendResponse(id, {
        tools: [
          {
            name: 'create_template',
            description: 'Create or update a prompt template with positional ({0}, {1}, $1, $2) and named placeholders. IMPORTANT: Always call list_templates first before creating a template to inspect existing templates and avoid unintended overwrites.',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Template identifier (kebab-case, e.g. "code-review")' },
                template: { type: 'string', description: 'Template string containing {0}, {1}, $1, $2, or {param}' },
                description: { type: 'string', description: 'Brief description of what this template does' },
                paramNames: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Optional human-readable names for parameters (e.g. ["language", "code", "focus"])'
                }
              },
              required: ['name', 'template']
            }
          },
          {
            name: 'render_prompt',
            description: 'Render a stored prompt template by providing positional or named arguments',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Template identifier' },
                args: {
                  description: 'Arguments as an array (["TypeScript", "..."]) or object ({"language": "TypeScript"})',
                  oneOf: [
                    { type: 'array', items: { type: 'string' } },
                    { type: 'object' }
                  ]
                }
              },
              required: ['name', 'args']
            }
          },
          {
            name: 'list_templates',
            description: 'List all stored prompt templates with their descriptions, parameters, and content. Always call this tool first before calling create_template.',
            inputSchema: { type: 'object', properties: {} }
          },
          {
            name: 'get_template',
            description: 'Get details and content of a single prompt template',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Template identifier' }
              },
              required: ['name']
            }
          },
          {
            name: 'delete_template',
            description: 'Delete a stored prompt template by name',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Template identifier to delete' }
              },
              required: ['name']
            }
          }
        ]
      });
      break;
    }

    case 'tools/call': {
      const { name, arguments: toolArgs = {} } = params;

      if (name === 'create_template') {
        const { name: templateName, template, description, paramNames } = toolArgs;
        if (!templateName || !template) {
          sendResponse(id, null, { code: -32602, message: 'Missing required parameters: name, template' });
          return;
        }

        const templateData = {
          template,
          description: description || '',
          paramNames: Array.isArray(paramNames) ? paramNames : [],
          createdAt: new Date().toISOString()
        };

        const isUpdate = prompts.has(templateName);
        prompts.set(templateName, templateData);
        saveTemplates(prompts);

        const paramsStr = templateData.paramNames.length > 0 ? templateData.paramNames.join(', ') : '(positional/none)';
        const textMsg = `Template "${templateName}" ${isUpdate ? 'updated' : 'created'} successfully.\nDescription: ${templateData.description || '(none)'}\nParameters: ${paramsStr}\n\nTemplate:\n${templateData.template}`;

        sendResponse(id, {
          content: [
            {
              type: 'text',
              text: textMsg
            }
          ],
          success: true,
          message: `Template "${templateName}" created successfully`,
          template: templateData
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

        const rendered = substituteTemplate(prompt.template, args, prompt.paramNames);
        const argsCount = Array.isArray(args) ? args.length : Object.keys(args || {}).length;

        sendResponse(id, {
          content: [
            {
              type: 'text',
              text: rendered
            }
          ],
          success: true,
          template: templateName,
          rendered,
          argsUsed: argsCount
        });
      }

      else if (name === 'list_templates') {
        const loaded = loadTemplates();
        prompts.clear();
        for (const [k, v] of loaded.entries()) {
          prompts.set(k, v);
        }

        const list = Array.from(prompts.entries()).map(([tName, data]) => ({
          name: tName,
          description: data.description,
          paramNames: data.paramNames || [],
          template: data.template,
          createdAt: data.createdAt
        }));

        let textOutput;
        if (list.length === 0) {
          textOutput = 'No templates currently stored. The template store is empty.';
        } else {
          textOutput = `Found ${list.length} stored template(s):\n\n` + list.map((t, idx) => {
            const paramsStr = t.paramNames && t.paramNames.length > 0 ? t.paramNames.join(', ') : 'none specified';
            return `${idx + 1}. **${t.name}**\n   - Description: ${t.description || 'No description'}\n   - Parameters: ${paramsStr}\n   - Template:\n${t.template}`;
          }).join('\n\n');
        }

        sendResponse(id, {
          content: [
            {
              type: 'text',
              text: textOutput
            }
          ],
          templates: list
        });
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

        const paramsStr = prompt.paramNames && prompt.paramNames.length > 0 ? prompt.paramNames.join(', ') : 'none specified';
        const textOutput = `Template: ${templateName}\nDescription: ${prompt.description || 'No description'}\nParameters: ${paramsStr}\nCreated: ${prompt.createdAt || 'N/A'}\n\nContent:\n${prompt.template}`;

        sendResponse(id, {
          content: [
            {
              type: 'text',
              text: textOutput
            }
          ],
          name: templateName,
          ...prompt
        });
      }

      else if (name === 'delete_template') {
        const { name: templateName } = toolArgs;
        if (!prompts.has(templateName)) {
          sendResponse(id, null, {
            code: -32602,
            message: `Template "${templateName}" not found`
          });
          return;
        }
        prompts.delete(templateName);
        saveTemplates(prompts);
        sendResponse(id, {
          content: [
            {
              type: 'text',
              text: `Template "${templateName}" deleted successfully.`
            }
          ],
          success: true,
          message: `Template "${templateName}" deleted`
        });
      }

      else {
        sendResponse(id, null, { code: -32601, message: `Tool "${name}" not found` });
      }
      break;
    }

    default:
      sendResponse(id, null, { code: -32601, message: `Method "${method}" not found` });
  }
}

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const req = JSON.parse(trimmed);
    handleRequest(req);
  } catch (err) {
    console.error(`Parse error: ${err.message}`);
  }
});

rl.on('close', () => {
  process.exit(0);
});
