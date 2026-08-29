<p align="center">
  <a href="https://github.com/SohailKhan0525/agentx-cli">
    <p align="center">
  <img src="screenshot-uk.png" alt="AgentX Code" width="600" />
</p>
  </a>
</p>
<p align="center">L’agente di coding AI open source.</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@agent-qofeno/agentx-cli"><img alt="npm" src="https://img.shields.io/npm/v/@agent-qofeno/agentx-cli?style=flat-square" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/SohailKhan0525/agentx-cli/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![AgentX Code Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://github.com/SohailKhan0525/agentx-cli)

---

### Installazione

```bash
# YOLO
curl -fsSL https://raw.githubusercontent.com/SohailKhan0525/agentx-cli/main/install | bash

# Package manager
npm i -g agentx-ai@latest        # oppure bun/pnpm/yarn
scoop install agentx             # Windows
choco install agentx             # Windows
brew install SohailKhan0525/tap/agentx # macOS e Linux (consigliato, sempre aggiornato)
brew install agentx              # macOS e Linux (formula brew ufficiale, aggiornata meno spesso)
sudo pacman -S agentx            # Arch Linux (Stable)
paru -S agentx-bin               # Arch Linux (Latest from AUR)
mise use -g agentx               # Qualsiasi OS
nix run nixpkgs#agentx           # oppure github:SohailKhan0525/agentx-cli per l’ultima branch di sviluppo
```

> [!TIP]
> Rimuovi le versioni precedenti alla 0.1.x prima di installare.

### App Desktop (BETA)

AgentX Code è disponibile anche come applicazione desktop. Puoi scaricarla direttamente dalla [pagina delle release](https://github.com/SohailKhan0525/agentx-cli/releases) oppure da [github.com/SohailKhan0525/agentx-cli/download](https://github.com/SohailKhan0525/agentx-cli/download).

| Piattaforma           | Download                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `agentx-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `agentx-desktop-mac-x64.dmg`     |
| Windows               | `agentx-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm`, oppure AppImage    |

```bash
# macOS (Homebrew)
brew install --cask agentx-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/agentx-desktop
```

#### Directory di installazione

Lo script di installazione rispetta il seguente ordine di priorità per il percorso di installazione:

1. `$OPENCODE_INSTALL_DIR` – Directory di installazione personalizzata
2. `$XDG_BIN_DIR` – Percorso conforme alla XDG Base Directory Specification
3. `$HOME/bin` – Directory binaria standard dell’utente (se esiste o può essere creata)
4. `$HOME/.agentx/bin` – Fallback predefinito

```bash
# Esempi
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://raw.githubusercontent.com/SohailKhan0525/agentx-cli/main/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://raw.githubusercontent.com/SohailKhan0525/agentx-cli/main/install | bash
```

### Agenti

AgentX Code include due agenti integrati tra cui puoi passare usando il tasto `Tab`.

- **build** – Predefinito, agente con accesso completo per il lavoro di sviluppo
- **plan** – Agente in sola lettura per analisi ed esplorazione del codice
  - Nega le modifiche ai file per impostazione predefinita
  - Chiede il permesso prima di eseguire comandi bash
  - Ideale per esplorare codebase sconosciute o pianificare modifiche

È inoltre incluso un sotto-agente **general** per ricerche complesse e attività multi-step.
Viene utilizzato internamente e può essere invocato usando `@general` nei messaggi.

Scopri di più sugli [agenti](https://github.com/SohailKhan0525/agentx-cli/docs/agents).

### Documentazione

Per maggiori informazioni su come configurare AgentX Code, [**consulta la nostra documentazione**](https://github.com/SohailKhan0525/agentx-cli/docs).

### Contribuire

Se sei interessato a contribuire a AgentX Code, leggi la nostra [guida alla contribuzione](./CONTRIBUTING.md) prima di inviare una pull request.

### Costruire su AgentX Code

Se stai lavorando a un progetto correlato a AgentX Code e che utilizza “agentx” come parte del nome (ad esempio “agentx-dashboard” o “agentx-mobile”), aggiungi una nota nel tuo README per chiarire che non è sviluppato dal team AgentX Code e che non è affiliato in alcun modo con noi.

---

**Unisciti alla nostra community** [Discord](https://discord.gg/agentx) | [X.com](https://x.com/agentx)
