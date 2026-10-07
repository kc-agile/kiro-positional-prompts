#!/usr/bin/env node
/**
 * Test script for Positional Prompts Power
 * Simulates MCP client calls
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const server = spawn('node', ['server.js'], {
  cwd: __dirname
});

let output = '';
let requestId = 0;

function sendRequest(method, params = {}) {
  const id = ++requestId;
  const req = { jsonrpc: '2.0', id, method, params };
  server.stdin.write(JSON.stringify(req) + '\n');
  return new Promise((resolve) => {
    const listener = (line) => {
      try {
        const res = JSON.parse(line);
        if (res.id === id) {
          server.stdout.removeListener('line', listener);
          resolve(res);
        }
      } catch (e) {
        // Not JSON, skip
      }
    };
    server.stdout.on('line', listener);
  });
}

async function test() {
  console.log('🧪 Testing Positional Prompts Power\n');

  // Setup: listen to server output line by line
  const rl = require('readline').createInterface({
    input: server.stdout,
    crlfDelay: Infinity
  });

  rl.on('line', (line) => {
    try {
      const res = JSON.parse(line);
      if (res.result) {
        console.log(`✓ Response (ID ${res.id}):`, JSON.stringify(res.result, null, 2));
      } else if (res.error) {
        console.log(`✗ Error (ID ${res.id}):`, res.error.message);
      }
    } catch (e) {
      // Ignore parse errors
    }
  });

  // Test 1: List tools
  console.log('\n📋 Test 1: List available tools');
  server.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list'
  }) + '\n');

  await new Promise(r => setTimeout(r, 500));

  // Test 2: Create a template
  console.log('\n📝 Test 2: Create template "code-review"');
  server.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'create_template',
      arguments: {
        name: 'code-review',
        template: 'Review this {0} code:\n\n```{0}\n{1}\n```\n\nFocus on: {2}',
        description: 'Code review template'
      }
    }
  }) + '\n');

  await new Promise(r => setTimeout(r, 500));

  // Test 3: Render the template
  console.log('\n🔄 Test 3: Render template with arguments');
  server.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'render_prompt',
      arguments: {
        name: 'code-review',
        args: ['TypeScript', 'const greet = (name: string) => `Hello, ${name}!`;', 'type safety']
      }
    }
  }) + '\n');

  await new Promise(r => setTimeout(r, 500));

  // Test 4: List templates
  console.log('\n📚 Test 4: List all templates');
  server.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'list_templates',
      arguments: {}
    }
  }) + '\n');

  await new Promise(r => setTimeout(r, 500));

  // Test 5: Get template details
  console.log('\n🔍 Test 5: Get template details');
  server.stdin.write(JSON.stringify({
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'get_template',
      arguments: {
        name: 'code-review'
      }
    }
  }) + '\n');

  await new Promise(r => setTimeout(r, 500));

  console.log('\n✅ Tests complete');
  server.kill();
  process.exit(0);
}

setTimeout(() => {
  test().catch(err => {
    console.error('Test failed:', err);
    server.kill();
    process.exit(1);
  });
}, 100);
