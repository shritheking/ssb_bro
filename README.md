# SSB BRO — Aspirant Development Platform

A premium, production-quality **concept website** for **SSB BRO**, associated with **Lt. Vamshi E.** — a defence aspirant development platform for SSB preparation and mentorship.

> **Note:** This is a concept/demo website prepared by **NextGen Web Studio** to demonstrate how SSB BRO could evolve into a dedicated digital platform. All content is based on the verified personal account of Lt. Vamshi E.

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 5**
- **Tailwind CSS v3**
- **React Router v6**
- **Lucide React** icons
- **canvas-confetti** (Journey page celebration)

---

## Getting Started

### Prerequisites

- Node.js ≥ 18 (tested on v20.18.0)
- npm ≥ 9

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Then open **http://localhost:5173**

### Build

```bash
npm run build
```

---

## Demo Credentials

All login is simulated — no real authentication. Click the **"Demo Login"** button on the login pages.

| Portal | Email | Password |
|--------|-------|----------|
| Student | `arjun.aspirant@example.com` | *any* |
| Admin | `mentor@ssbbro.concept` | *any* |

---

## Site Map

### Public Website
| Route | Page |
|-------|------|
| `/` | Home — cinematic landing page |
| `/about` | About SSB BRO & Lt. Vamshi E. |
| `/journey` | Interactive 5-attempt timeline |
| `/programmes` | 8 proposed programme categories |
| `/resources` | Learning resource library |
| `/stories` | Aspirant stories (future verified stories) |
| `/faq` | Frequently asked questions |
| `/contact` | Contact & enquiry form |

### Student Portal (`/student/...`)
| Route | Page |
|-------|------|
| `/student/login` | Demo login |
| `/student/dashboard` | Welcome + metrics + quick links |
| `/student/programmes` | Enrolled programme modules |
| `/student/practice` | TAT / WAT / SRT / SD practice centre |
| `/student/assignments` | Pending and submitted assignments |
| `/student/feedback` | Mentor feedback history |
| `/student/progress` | OLQ skills + habit streaks |
| `/student/sessions` | Booked mentoring sessions |
| `/student/resources` | Bookmarkable learning library |
| `/student/profile` | Editable student profile |

### Admin Dashboard (`/admin/...`)
| Route | Page |
|-------|------|
| `/admin/login` | Demo admin login |
| `/admin/dashboard` | Overview metrics + pending submissions |
| `/admin/aspirants` | Aspirant dossiers |
| `/admin/programmes` | Programme management |
| `/admin/batches` | Batch management |
| `/admin/assignments` | Assignment management |
| `/admin/submissions` | Review submitted work |
| `/admin/feedback` | Compose diagnostic notes |
| `/admin/sessions` | Session scheduling |
| `/admin/resources` | Resource library management |
| `/admin/notifications` | Platform notifications |
| `/admin/settings` | Branding, profile & portal config |

---

## Features

- **Interactive Journey Timeline** with 5-attempt filter system + confetti on Recommendation milestone
- **Psychology Practice Centre** — TAT (image + 4-min timer), WAT (15-second speed drill), SRT scenarios, Self Description editor
- **Assignment System** with localStorage persistence for submissions
- **Resource Library** with bookmarking and reading progress
- **Session Booking** demo modal
- **Admin Resource Manager** — add, edit, delete resources
- **Admin Notifications** — mark-read, filter, delete
- **Admin Settings** — profile, branding preview, notification toggles, feature flags
- **Fully responsive** — tested at 360px, 768px, 1024px, 1440px
- **No backend** — all state via React + localStorage

---

## Brand Identity

- **Primary:** `#0B1422` (deep navy)
- **Secondary:** `#111E30`
- **Card:** `#17263A`
- **Gold accent:** `#C8A96B`
- **Steel accent:** `#6F91B8`
- **Text:** `#F4F3EF`
- **Fonts:** Space Grotesk (headings) · Inter (body) · Playfair Display (editorial)

---

## Important Disclaimers

- All journey statistics are attributed to the **personal experience of Lt. Vamshi E.** — not platform results.
- No selection guarantee is made or implied anywhere on this site.
- No official Indian Army / Air Force / Navy insignia is used.
- This is a **concept website** — no active programmes, fees, or batch dates are confirmed.

---

*Concept by NextGen Web Studio · SSB BRO © 2024*
