import fs from 'fs';
import path from 'path';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // We should be careful about preserving casing or just doing case insensitive?
  // "agentx" -> "agentx"
  // "AgentX" -> "AgentX"
  // "agentx-cli" -> "agentx" ?
  // The instructions:
  // - Name: AgentX-CLI
  // - Command: agentx
  // - NPM package: agentx-cli
  
  // Let's do string replacements
  content = content.replace(/agentx-cli/g, "agentx-cli");
  content = content.replace(/agentx/g, "agentx");
  content = content.replace(/AgentX/g, "AgentX");
  content = content.replace(/AGENTX/g, "AGENTX");
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', 'dist', '.bun', 'packages/app', 'packages/desktop'].includes(file)) {
        walk(fullPath);
      }
    } else {
      if (['.ts', '.tsx', '.js', '.json', '.md'].includes(path.extname(fullPath))) {
        replaceInFile(fullPath);
      }
    }
  }
}

walk('.');
console.log('Renaming complete.');
