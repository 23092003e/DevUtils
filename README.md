# DevUtils

A client-side web application for developers to convert, encode, decode, and work with QR codes — all running in the browser with no backend required.

**Live demo:** [https://dev-utils-ivory.vercel.app](https://dev-utils.sorcerer-n8n.online/)

---

## Features

| Tool | Description |
|---|---|
| QR Generator | Generate QR code from any text or URL, export as PNG |
| QR Reader | Decode QR code from uploaded image or clipboard paste |
| Text / Base64 | Bidirectional encode and decode |
| Text / Hex | Bidirectional, supports compact and uppercase modes |
| Text / Binary | Bidirectional 8-bit binary conversion |
| Text / ASCII | Bidirectional decimal ASCII code conversion |
| URL Encode/Decode | Full URL or component encoding via `encodeURIComponent` |
| HTML Entity | Encode and decode HTML special characters |
| Hash Generator | MD5, SHA-1, SHA-256, SHA-512 from any input |
| JWT Decoder | Decode and inspect JWT header and payload (read-only) |
| Hex / RGB Color | Convert between hex, RGB, and HSL with live color preview |
| Number Base Converter | Convert numbers between base 2, 8, 10, and 16 |

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite 6
- **Styling:** Tailwind CSS v4
- **Animation:** Motion
- **QR generation:** `qrcode`
- **QR reading:** `jsqr`
- **MD5 hashing:** `blueimp-md5`
- **SHA hashing:** Web Crypto API (native)
- **AI integration:** `@google/genai` (Gemini)

---

## Getting Started

### Prerequisites

- Node.js >= 18

### Installation

```bash
git clone https://github.com/23092003e/DevUtils.git
cd DevUtils
npm install
```

### Environment setup

Copy the example env file and add your Gemini API key:

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

```
GEMINI_API_KEY=your_api_key_here
```

Get a free API key at https://aistudio.google.com

### Run locally

```bash
npm run dev
```

App runs at http://localhost:3000

### Build for production

```bash
npm run build
```

---

## Project Structure

```
DevUtils/
├── src/               # Application source code
├── index.html         # Entry HTML
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
├── package.json       # Dependencies and scripts
└── .env.example       # Environment variable template
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Type-check with TypeScript |
| `npm run clean` | Remove build artifacts |

---

## License

MIT
