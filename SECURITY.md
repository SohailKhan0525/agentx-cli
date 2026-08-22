# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | :white_check_mark: |
| < 2.0   | :x:                |

## Security Features in AgentX

- **OS Secure Storage**: API keys and auth credentials are stored in OS-level credential storage (`keytar` / macOS Keychain / Windows Credential Manager / Linux Secret Service).
- **Key Masking**: API keys are always masked in logs and terminal outputs.
- **Local Isolation**: Sensitive data is stored strictly in user-owned config and data directories.

## Reporting a Vulnerability

If you discover a security vulnerability within AgentX, please report it via GitHub Issues at:
[github.com/SohailKhan0525/agentx-cli/issues](https://github.com/SohailKhan0525/agentx-cli/issues)

We appreciate your assistance in keeping AgentX secure.
