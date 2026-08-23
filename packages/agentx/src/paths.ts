// paths.ts
import path from 'path'
import os from 'os'

export function getConfigDir(): string {
  switch (process.platform) {
    case 'win32':
      return path.join(process.env.APPDATA ?? os.homedir(), 'agentx-cli')
    case 'darwin':
      return path.join(os.homedir(), 'Library', 'Application Support', 'agentx-cli')
    default:
      return path.join(
        process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), '.config'),
        'agentx-cli'
      )
  }
}
