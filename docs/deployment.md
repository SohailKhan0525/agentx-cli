# Live Deployment Guide

Once AgentX builds your full-stack website and validates the build locally, it can deploy your project live to cloud hosting platforms.

---

## 🚀 Supported Deployment Targets

| Provider | Supported Stacks | Command |
|:---|:---|:---|
| **Vercel** | Next.js, React + Vite, Astro, Nuxt | `npx vercel --prod` |
| **Netlify** | Next.js, React + Vite, Astro | `npx netlify deploy --prod` |
| **Cloudflare Pages** | Next.js (Edge), React + Vite, Astro | `npx wrangler pages deploy` |
| **GitHub Pages** | Astro, React + Vite (Static) | Automated GitHub Actions workflow |

---

## 🔒 Automated Git & GitHub Flow

1. **Git Initialization**:
   AgentX initializes a clean git repository in the target project folder with standard `.gitignore` rules.
2. **Atomic Commits**:
   Creates descriptive semantic commits (e.g. `feat: scaffold Next.js 15 app`, `feat: implement Stripe checkout flow`).
3. **GitHub Push**:
   Uses the GitHub CLI (`gh repo create`) or user-configured remote to push code directly to your GitHub account.
4. **Deploy Hooks & CI**:
   Configures repository webhooks and CI/CD pipelines for automated deployments upon `git push`.
