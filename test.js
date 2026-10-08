#!/usr/bin/env node
/**
 * Test script for Positional Prompts MCP Server / Kiro Power
 * Validates MCP handshake, Prompts protocol, and Tools protocol
 */

const { spawn } = require('child_process');
const readline = require('readline');

const server = spawn('node', ['server.js'], {
  cwd: __dirname
});

const rl = readline.createInterface({
  input: server.stdout,
  terminal: false
});

let requestId = 0;
const pendingRequests = new Map();

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const res = JSON.parse(trimmed);
    if (res.id !== undefined && pendingRequests.has(res.id)) {
      const { resolve, reject } = pendingRequests.get(res.id);
      pendingRequests.delete(res.id);
      if (res.error) {
        reject(new Error(res.error.message));
      } else {
        resolve(res.result);
      }
    }
  } catch (e) {
    // Non-JSON output
  }
});

function call(method, params = {}) {
  const id = ++requestId;
  return new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject });
    server.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  });
}

async function runTests() {
  console.log('🧪 Starting Positional Prompts Power test suite...\n');

  // Test 1: Initialize handshake
  console.log('1️⃣  Testing MCP initialize handshake...');
  const initResult = await call('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test-client', version: '1.0.0' }
  });
  console.log('   ✓ Handshake successful: serverInfo =', initResult.serverInfo);
  if (!initResult.capabilities.prompts || !initResult.capabilities.tools) {
    throw new Error('Server missing prompt or tool capabilities');
  }

  // Test 2: Tools list
  console.log('\n2️⃣  Testing MCP tools/list...');
  const toolsList = await call('tools/list');
  console.log(`   ✓ Found ${toolsList.tools.length} tools:`, toolsList.tools.map(t => t.name).join(', '));

  // Test 3: Create a template dynamically (user-driven)
  console.log('\n3️⃣  Testing create_template (code-review)...');
  await call('tools/call', {
    name: 'create_template',
    arguments: {
      name: 'code-review',
      template: 'Review this {0} code for quality and best practices:\n\n```{0}\n{1}\n```\n\nFocus on: {2}',
      description: 'Code review template with language, code snippet, and focus area',
      paramNames: ['language', 'code', 'focus']
    }
  });
  console.log('   ✓ Template "code-review" created');

  // Test 4: prompts/list shows the created template
  console.log('\n4️⃣  Testing MCP prompts/list...');
  const promptsList = await call('prompts/list');
  console.log(`   ✓ Found ${promptsList.prompts.length} prompt(s):`, promptsList.prompts.map(p => p.name).join(', '));
  if (!promptsList.prompts.some(p => p.name === 'code-review')) {
    throw new Error('Created prompt "code-review" was not found in prompts/list');
  }

  // Test 5: prompts/get
  console.log('\n5️⃣  Testing MCP prompts/get (code-review)...');
  const renderedPrompt = await call('prompts/get', {
    name: 'code-review',
    arguments: {
      language: 'TypeScript',
      code: 'const add = (a: number, b: number) => a + b;',
      focus: 'type safety & edge cases'
    }
  });
  console.log('   ✓ Rendered prompt content:');
  console.log('   ----------------------------------------');
  console.log('   ' + renderedPrompt.messages[0].content.text.split('\n').join('\n   '));
  console.log('   ----------------------------------------');

  // Test 6: tools/call render_prompt with array arguments ($4 and {0})
  console.log('\n6️⃣  Testing tools/call create_template & render_prompt with positional array...');
  await call('tools/call', {
    name: 'create_template',
    arguments: {
      name: 'test-calc',
      template: 'Calculate {0} + {1} for user $4. Goal: {2}',
      description: 'Calculator test template',
      paramNames: ['num1', 'num2', 'goal', 'user']
    }
  });

  const renderedTool = await call('tools/call', {
    name: 'render_prompt',
    arguments: {
      name: 'test-calc',
      args: ['10', '20', 'quick math', 'Alice']
    }
  });
  console.log('   ✓ Rendered: "' + renderedTool.rendered + '"');
  if (renderedTool.rendered !== 'Calculate 10 + 20 for user Alice. Goal: quick math') {
    throw new Error(`Unexpected render output: ${renderedTool.rendered}`);
  }

  // Test 7: tools/call list_templates
  console.log('\n7️⃣  Testing tools/call list_templates...');
  const listed = await call('tools/call', {
    name: 'list_templates'
  });
  console.log('   ✓ Found templates via tool call:', listed.templates.length);
  if (!listed.content || !Array.isArray(listed.content) || listed.content.length === 0 || typeof listed.content[0].text !== 'string') {
    throw new Error('list_templates missing valid MCP content text array');
  }

  // Test 8: tools/call get_template
  console.log('\n8️⃣  Testing tools/call get_template...');
  const fetched = await call('tools/call', {
    name: 'get_template',
    arguments: { name: 'test-calc' }
  });
  console.log('   ✓ Fetched template details for:', fetched.name);
  if (!fetched.content || !Array.isArray(fetched.content) || fetched.content.length === 0 || typeof fetched.content[0].text !== 'string') {
    throw new Error('get_template missing valid MCP content text array');
  }

  // Test 9: tools/call delete_template
  console.log('\n9️⃣  Testing tools/call delete_template...');
  const deleted = await call('tools/call', {
    name: 'delete_template',
    arguments: { name: 'test-calc' }
  });
  console.log('   ✓ Delete result:', deleted.message);

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!\n');
  server.kill();
  process.exit(0);
}

runTests().catch(err => {
  console.error('\n❌ Test failed:', err.message);
  server.kill();
  process.exit(1);
});
