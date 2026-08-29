<p align="center">
  <a href="https://github.com/SohailKhan0525/agentx-cli">
    <p align="center">
  <img src="screenshot-uk.png" alt="AgentX Code" width="600" />
</p>
  </a>
</p>
<p align="center">وكيل برمجة بالذكاء الاصطناعي مفتوح المصدر.</p>
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

### التثبيت

```bash
# YOLO
curl -fsSL https://raw.githubusercontent.com/SohailKhan0525/agentx-cli/main/install | bash

# مديري الحزم
npm i -g agentx-ai@latest        # او bun/pnpm/yarn
scoop install agentx             # Windows
choco install agentx             # Windows
brew install SohailKhan0525/tap/agentx # macOS و Linux (موصى به، دائما محدث)
brew install agentx              # macOS و Linux (صيغة brew الرسمية، تحديث اقل)
sudo pacman -S agentx            # Arch Linux (Stable)
paru -S agentx-bin               # Arch Linux (Latest from AUR)
mise use -g agentx               # اي نظام
nix run nixpkgs#agentx           # او github:SohailKhan0525/agentx-cli لاحدث فرع dev
```

> [!TIP]
> احذف الاصدارات الاقدم من 0.1.x قبل التثبيت.

### تطبيق سطح المكتب (BETA)

يتوفر AgentX Code ايضا كتطبيق سطح مكتب. قم بالتنزيل مباشرة من [صفحة الاصدارات](https://github.com/SohailKhan0525/agentx-cli/releases) او من [github.com/SohailKhan0525/agentx-cli/download](https://github.com/SohailKhan0525/agentx-cli/download).

| المنصة                | التنزيل                            |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `agentx-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `agentx-desktop-mac-x64.dmg`     |
| Windows               | `agentx-desktop-windows-x64.exe` |
| Linux                 | `.deb` او `.rpm` او AppImage       |

```bash
# macOS (Homebrew)
brew install --cask agentx-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/agentx-desktop
```

#### مجلد التثبيت

يحترم سكربت التثبيت ترتيب الاولوية التالي لمسار التثبيت:

1. `$OPENCODE_INSTALL_DIR` - مجلد تثبيت مخصص
2. `$XDG_BIN_DIR` - مسار متوافق مع مواصفات XDG Base Directory
3. `$HOME/bin` - مجلد الثنائيات القياسي للمستخدم (ان وجد او امكن انشاؤه)
4. `$HOME/.agentx/bin` - المسار الافتراضي الاحتياطي

```bash
# امثلة
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://raw.githubusercontent.com/SohailKhan0525/agentx-cli/main/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://raw.githubusercontent.com/SohailKhan0525/agentx-cli/main/install | bash
```

### Agents

يتضمن AgentX Code وكيليْن (Agents) مدمجين يمكنك التبديل بينهما باستخدام زر `Tab`.

- **build** - الافتراضي، وكيل بصلاحيات كاملة لاعمال التطوير
- **plan** - وكيل للقراءة فقط للتحليل واستكشاف الكود
  - يرفض تعديل الملفات افتراضيا
  - يطلب الاذن قبل تشغيل اوامر bash
  - مثالي لاستكشاف قواعد كود غير مألوفة او لتخطيط التغييرات

بالاضافة الى ذلك يوجد وكيل فرعي **general** للبحث المعقد والمهام متعددة الخطوات.
يستخدم داخليا ويمكن استدعاؤه بكتابة `@general` في الرسائل.

تعرف على المزيد حول [agents](https://github.com/SohailKhan0525/agentx-cli/docs/agents).

### التوثيق

لمزيد من المعلومات حول كيفية ضبط AgentX Code، [**راجع التوثيق**](https://github.com/SohailKhan0525/agentx-cli/docs).

### المساهمة

اذا كنت مهتما بالمساهمة في AgentX Code، يرجى قراءة [contributing docs](./CONTRIBUTING.md) قبل ارسال pull request.

### البناء فوق AgentX Code

اذا كنت تعمل على مشروع مرتبط بـ AgentX Code ويستخدم "agentx" كجزء من اسمه (مثل "agentx-dashboard" او "agentx-mobile")، يرجى اضافة ملاحظة في README توضح انه ليس مبنيا بواسطة فريق AgentX Code ولا يرتبط بنا بأي شكل.

---

**انضم الى مجتمعنا** [Discord](https://discord.gg/agentx) | [X.com](https://x.com/agentx)
