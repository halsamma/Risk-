# SOC2 Compass — Multi-Framework Compliance Platform

A full-stack compliance assessment platform for IT and GRC professionals. Assess your current state, track findings, and get step-by-step remediation guidance across multiple frameworks.

## Frameworks Supported

| Framework | Controls | Description |
|---|---|---|
| 🔐 **SOC 2** | 52 | AICPA Trust Service Criteria (all 5) |
| 🦅 **FedRAMP Moderate** | 110 | NIST 800-53 (all 20 families) |
| 💳 **PCI DSS v4** | 72 | Payment Card Industry Data Security |
| 🔑 **PCI PIN** | 33 | PIN Transaction Security Requirements |
| 🤖 **NIST AI RMF** | 41 | AI Risk Management Framework |

## Features

- **Guided questionnaire** — Yes / Partial / No / N/A per control with inline guidance
- **Upload audit findings** — paste or upload an auditor report; AI (or keyword parser) maps findings to control IDs
- **Auto-generated findings** — gaps auto-create prioritized findings with severity
- **Remediation plans** — static playbooks + AI-tailored plans (requires Anthropic API key)
- **Real-world examples** — every control has a scenario, evidence list, and quick win
- **Full accounts** — JWT auth with refresh tokens, per-user assessments
- **OWASP Top 10 compliant** — rate limiting, bcrypt, JWT rotation, audit logs
- **Mobile responsive** — works on phones and tablets

## Stack

- **Backend** — Node.js + Express + TypeScript + `node:sqlite` (built-in, no native modules)
- **Frontend** — React + Vite + Tailwind CSS
- **AI** — Anthropic Claude API (optional — falls back to keyword parser)

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

```bash
cp .env.example .env
node setup.js          # auto-generates JWT secrets
```

Edit `.env` and set `ANTHROPIC_API_KEY` (optional — AI features only).

### 3. Run

Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:3001)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend && npm run dev
```

Open **http://localhost:5173** — create an account and start your first assessment.

## AI Features (Optional)

Get an API key at [console.anthropic.com](https://console.anthropic.com). Without it:
- Document upload uses a keyword-based parser (works well for structured reports)
- Questionnaire, findings, and static remediation plans work fully
- The "Generate AI Plan" and "Ask Claude" buttons are disabled

## License

MIT
