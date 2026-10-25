# SHEild — Smart Women's Safety Platform

**Your Safety. Your Control.**

A complete, privacy-first women's safety platform built with React, TypeScript, and Vite.

## Features

- 🆘 **Emergency SOS** — One-tap alert to trusted contacts with GPS location
- 📍 **Safe Trip** — Timed check-ins with missed-check-in notifications  
- 🤖 **Digital Shield** — AI-powered analysis of suspicious messages/links
- 🔒 **Evidence Vault** — Encrypted storage for harassment evidence
- 👥 **Trusted Contacts** — SOS & trip notification network
- 🛡️ **Privacy Controls** — Full data control, export, and deletion

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (Demo Mode — no Firebase required)
npm run dev

# Open http://localhost:5173
# Use demo login: demo@sheild.app / any password
```

## Production Setup (Firebase)

1. Copy `.env.example` to `.env`
2. Fill in your Firebase credentials from the [Firebase Console](https://console.firebase.google.com)
3. Enable Email/Password auth, Firestore, and Storage
4. Deploy Cloud Functions for secure AI backend
5. Run `npm run build` for production build

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3
- **Routing**: React Router DOM v6
- **Backend**: Firebase (Auth, Firestore, Storage) — Demo mode available
- **Maps**: Leaflet + OpenStreetMap
- **AI**: Secure backend LLM proxy (rule-based demo mode)

## Demo Mode

When Firebase credentials are not configured, the app runs in **Demo Mode**:
- All authentication is simulated locally
- SOS alerts are NOT sent to real contacts
- Evidence is stored in browser localStorage (encrypted in production)
- AI analysis uses local pattern matching

Demo Mode is clearly labeled throughout the UI.

## Privacy & Safety Commitments

- No location tracking without explicit consent
- Zero third-party data sharing
- All evidence encrypted with AES-256 (production)
- No fake emergency calls — real integrations only
- Full data export and deletion rights

## Emergency Helplines (India)

| Service | Number |
|---------|--------|
| Women Helpline | 1091 |
| Cyber Crime | 1930 |
| Police | 100 |
| Ambulance | 108 |
