<p align="center">
  <a href="https://github.com/SohailKhan0525/agentx-cli">
    <p align="center">
  <img src="screenshot-uk.png" alt="AgentX Code" width="600" />
</p>
  </a>
</p>
<p align="center">Açık kaynaklı yapay zeka kodlama asistanı.</p>
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

### Kurulum

```bash
# YOLO
curl -fsSL https://raw.githubusercontent.com/SohailKhan0525/agentx-cli/main/install | bash

# Paket yöneticileri
npm i -g agentx-ai@latest        # veya bun/pnpm/yarn
scoop install agentx             # Windows
choco install agentx             # Windows
brew install SohailKhan0525/tap/agentx # macOS ve Linux (önerilir, her zaman güncel)
brew install agentx              # macOS ve Linux (resmi brew formülü, daha az güncellenir)
sudo pacman -S agentx            # Arch Linux (Stable)
paru -S agentx-bin               # Arch Linux (Latest from AUR)
mise use -g agentx               # Tüm işletim sistemleri
nix run nixpkgs#agentx           # veya en güncel geliştirme dalı için github:SohailKhan0525/agentx-cli
```

> [!TIP]
> Kurulumdan önce 0.1.x'ten eski sürümleri kaldırın.

### Masaüstü Uygulaması (BETA)

AgentX Code ayrıca masaüstü uygulaması olarak da mevcuttur. Doğrudan [sürüm sayfasından](https://github.com/SohailKhan0525/agentx-cli/releases) veya [github.com/SohailKhan0525/agentx-cli/download](https://github.com/SohailKhan0525/agentx-cli/download) adresinden indirebilirsiniz.

| Platform              | İndirme                            |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `agentx-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `agentx-desktop-mac-x64.dmg`     |
| Windows               | `agentx-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm` veya AppImage       |

```bash
# macOS (Homebrew)
brew install --cask agentx-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/agentx-desktop
```

#### Kurulum Dizini (Installation Directory)

Kurulum betiği (install script), kurulum yolu (installation path) için aşağıdaki öncelik sırasını takip eder:

1. `$OPENCODE_INSTALL_DIR` - Özel kurulum dizini
2. `$XDG_BIN_DIR` - XDG Base Directory Specification uyumlu yol
3. `$HOME/bin` - Standart kullanıcı binary dizini (varsa veya oluşturulabiliyorsa)
4. `$HOME/.agentx/bin` - Varsayılan yedek konum

```bash
# Örnekler
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://raw.githubusercontent.com/SohailKhan0525/agentx-cli/main/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://raw.githubusercontent.com/SohailKhan0525/agentx-cli/main/install | bash
```

### Ajanlar

AgentX Code, `Tab` tuşuyla aralarında geçiş yapabileceğiniz iki yerleşik (built-in) ajan içerir.

- **build** - Varsayılan, geliştirme çalışmaları için tam erişimli ajan
- **plan** - Analiz ve kod keşfi için salt okunur ajan
  - Varsayılan olarak dosya düzenlemelerini reddeder
  - Bash komutlarını çalıştırmadan önce izin ister
  - Tanımadığınız kod tabanlarını keşfetmek veya değişiklikleri planlamak için ideal

Ayrıca, karmaşık aramalar ve çok adımlı görevler için bir **genel** alt ajan bulunmaktadır.
Bu dahili olarak kullanılır ve mesajlarda `@general` ile çağrılabilir.

[Ajanlar](https://github.com/SohailKhan0525/agentx-cli/docs/agents) hakkında daha fazla bilgi edinin.

### Dokümantasyon

AgentX Code'u nasıl yapılandıracağınız hakkında daha fazla bilgi için [**dokümantasyonumuza göz atın**](https://github.com/SohailKhan0525/agentx-cli/docs).

### Katkıda Bulunma

AgentX Code'a katkıda bulunmak istiyorsanız, lütfen bir pull request göndermeden önce [katkıda bulunma dokümanlarımızı](./CONTRIBUTING.md) okuyun.

### AgentX Code Üzerine Geliştirme

AgentX Code ile ilgili bir proje üzerinde çalışıyorsanız ve projenizin adının bir parçası olarak "agentx" kullanıyorsanız (örneğin, "agentx-dashboard" veya "agentx-mobile"), lütfen README dosyanıza projenin AgentX Code ekibi tarafından geliştirilmediğini ve bizimle hiçbir şekilde bağlantılı olmadığını belirten bir not ekleyin.

---

**Topluluğumuza katılın** [Discord](https://discord.gg/agentx) | [X.com](https://x.com/agentx)
