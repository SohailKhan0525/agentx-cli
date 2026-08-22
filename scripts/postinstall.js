#!/usr/bin/env node
const { execSync } = require('child_process')

function tryInstallSkill(repo, skill) {
  try {
    console.log('Installing skill:', skill)
    execSync(`npx skills add ${repo} ${skill}`, {
      stdio: 'pipe', timeout: 60000
    })
    console.log('✓ Skill installed:', skill)
  } catch {
    console.log('  Skipped:', skill, '(install manually if needed)')
  }
}

console.log('\n✓ AgentX installed successfully')
console.log('  Installing UI skills...\n')

tryInstallSkill(
  'https://github.com/sohailkhan0525/skills',
  '--skill frontend-ui-ux-wizard'
)
tryInstallSkill(
  'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill',
  '--skill ui-ux-pro-max'
)

console.log('\n✓ Ready. Run "agentx" to start building\n')
