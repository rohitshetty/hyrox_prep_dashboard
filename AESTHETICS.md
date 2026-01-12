# Hyrox Dashboard - Aesthetics Guide

## Design Concept: "Race Timing Display"

Inspired by race timing systems, gym scoreboards, and athletic performance displays. The aesthetic is **functional brutalism meets athletic precision** - think CrossFit leaderboards, marathon checkpoint displays, and industrial gym environments.

This is not a wellness app with soft gradients. It's a training tool for someone preparing to push through 8 grueling stations. The design should feel like staring at a race clock: urgent, clear, motivating.

---

## Typography

### Primary Font: **Bebas Neue**
- Use for: Headers, week numbers, phase names, large stats
- Character: Bold, condensed, athletic, unmistakably sporty
- All caps for headers creates race-bib energy

### Secondary Font: **JetBrains Mono**
- Use for: Workout details, exercise prescriptions, distances, weights, times
- Character: Technical, precise, easy to scan at a glance
- Monospace creates natural alignment for sets/reps/weights

### Body Font: **Barlow**
- Use for: Descriptions, notes, longer text blocks
- Character: Semi-condensed, athletic but readable
- Weight 400 for body, 600 for emphasis

```css
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --font-display: 'Bebas Neue', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Barlow', sans-serif;
}
```

---

## Color Palette

### Foundation: Dark Theme
Dark by default - you're checking this at 5:30am before the gym or between sets. Light themes cause eye strain in dim environments.

### Core Colors

```css
:root {
  /* Backgrounds - layered darks */
  --bg-base: #0a0a0b;           /* Near black - main background */
  --bg-surface: #141416;         /* Elevated surfaces, cards */
  --bg-elevated: #1c1c1f;        /* Hover states, active elements */

  /* Text hierarchy */
  --text-primary: #f5f5f4;       /* Primary text - warm white */
  --text-secondary: #a1a1a1;     /* Secondary info, labels */
  --text-muted: #525252;         /* Disabled, hints */

  /* Accent: Electric Lime */
  --accent: #d4f505;             /* Primary accent - high visibility */
  --accent-dim: #a8c404;         /* Hover/pressed states */
  --accent-glow: rgba(212, 245, 5, 0.15); /* Glow effects */

  /* Semantic - Phase Colors */
  --phase-base: #3b82f6;         /* Blue - building foundation */
  --phase-build: #22c55e;        /* Green - progressive overload */
  --phase-recovery: #eab308;     /* Yellow/Gold - adaptation */
  --phase-peak: #f97316;         /* Orange - maximum output */
  --phase-taper: #a855f7;        /* Purple - sharpening */
  --phase-race: #ef4444;         /* Red - race day */

  /* Workout Type Colors */
  --type-run: #60a5fa;           /* Light blue - running */
  --type-strength: #4ade80;      /* Light green - lifting */
  --type-hyrox: #fb923c;         /* Orange - station work */

  /* Utility */
  --border: #262629;             /* Subtle borders */
  --border-focus: #404044;       /* Focus states */
}
```

### The Accent Philosophy
Electric lime (#d4f505) is deliberately uncomfortable - it demands attention like a race clock counting down. It's used sparingly:
- Current day indicator
- Active navigation states
- Key stats and numbers
- Call-to-action elements

---

## Layout Principles

### Grid System
- 8px base unit
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
- Max content width: 1200px
- Card padding: 24px (desktop), 16px (mobile)

### Card Design
```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 2px;  /* Sharp corners - not rounded */
}

.card-active {
  border-left: 3px solid var(--accent);
}
```

Sharp corners (2px max radius) reinforce the industrial aesthetic. No soft, friendly rounded corners.

### Information Density
Training data is dense. Embrace it:
- Tight line heights for exercise lists (1.3)
- Compact tables for weekly views
- Minimal whitespace within cards, generous between sections

---

## Component Patterns

### Workout Card
```
┌─────────────────────────────────────┐
│ ▌TEMPO RUN                    8 KM  │  ← Accent border, Bebas Neue
│                                     │
│ 2km E + 2×10min T (3min jog) + 2km E│  ← JetBrains Mono
│                                     │
│ Threshold development         MON   │  ← Barlow muted, day badge
└─────────────────────────────────────┘
```

### Stats Display
Large numbers. Race-clock energy.
```
┌─────────────────────────────────────┐
│           WEEK 5 · BUILD            │  ← Phase badge
│                                     │
│              48                     │  ← Bebas Neue, 72px
│              KM                     │  ← Muted, smaller
│                                     │
│    Tempo    Easy    Int    Long     │
│     10       8      11      19      │  ← Breakdown
└─────────────────────────────────────┘
```

### Exercise List
```
BACK SQUAT                    5×5 @ 77kg
PAUSED SQUATS                 3×3 @ 70kg
RDL                           3×8 @ 80kg
LEG CURLS                     3×12
PLANKS                        3×45s
```
Monospace alignment. Exercise name left, prescription right.

---

## Motion & Animation

### Philosophy
One orchestrated moment beats scattered micro-interactions. Focus animation budget on:
1. Page load reveals
2. Day/week transitions
3. Chart animations on stats page

### Page Load Sequence
Staggered reveal with subtle upward movement:

```css
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal-item {
  animation: reveal 0.4s ease-out forwards;
  opacity: 0;
}

.reveal-item:nth-child(1) { animation-delay: 0ms; }
.reveal-item:nth-child(2) { animation-delay: 50ms; }
.reveal-item:nth-child(3) { animation-delay: 100ms; }
.reveal-item:nth-child(4) { animation-delay: 150ms; }
```

### Hover States
Subtle, instant feedback:
```css
.card {
  transition: border-color 0.15s ease, background 0.15s ease;
}

.card:hover {
  border-color: var(--border-focus);
  background: var(--bg-elevated);
}
```

### Chart Animations
- Line charts: Draw path animation on mount (1s duration)
- Bar charts: Grow from baseline (0.6s, staggered per bar)

---

## Background Treatment

### Base Layer
Subtle noise texture over solid dark. Creates depth without distraction.

```css
body {
  background-color: var(--bg-base);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-blend-mode: overlay;
  background-size: 128px 128px;
}
```

### Stats Page
Subtle grid pattern evoking graph paper / race track lines:

```css
.stats-background {
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 48px 48px;
}
```

---

## Iconography

Minimal. Use text and symbols where possible:
- Navigation: Text labels, not icons
- Workout types: Colored left borders, not icons
- Stats: Numbers are the visual, not decorative icons

When icons are necessary:
- Stroke-based, 1.5px weight
- 20×20px default size
- Match text color of context

---

## Responsive Behavior

### Mobile (< 640px)
- Single column layout
- Full-width cards
- Reduced typography scale (Bebas headers: 32px → 24px)
- Sticky header with current day
- Bottom navigation for week switching

### Tablet (640px - 1024px)
- 2-column grid for weekly view
- Side-by-side workout types on day view

### Desktop (> 1024px)
- 7-column grid for weekly view (full week visible)
- 3-column layout for stats page

---

## Sample Tailwind Config

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['Barlow', 'sans-serif'],
      },
      colors: {
        bg: {
          base: '#0a0a0b',
          surface: '#141416',
          elevated: '#1c1c1f',
        },
        accent: {
          DEFAULT: '#d4f505',
          dim: '#a8c404',
          glow: 'rgba(212, 245, 5, 0.15)',
        },
        phase: {
          base: '#3b82f6',
          build: '#22c55e',
          recovery: '#eab308',
          peak: '#f97316',
          taper: '#a855f7',
          race: '#ef4444',
        },
        type: {
          run: '#60a5fa',
          strength: '#4ade80',
          hyrox: '#fb923c',
        },
      },
      animation: {
        reveal: 'reveal 0.4s ease-out forwards',
      },
      keyframes: {
        reveal: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Reference Mood

- Race timing displays at finish lines
- CrossFit competition leaderboards
- Peloton output screens
- Industrial gym environments (concrete, chalk, iron)
- Sports broadcast graphics (but darker, more minimal)

**NOT**: Wellness apps, meditation apps, soft fitness trackers, anything with illustrations of people exercising, anything with motivational quotes in script fonts.

---

## Implementation Notes

1. **Dark mode only** - No light theme toggle. This is a focused tool.
2. **No decorative elements** - Every pixel serves function.
3. **Numbers are heroes** - Mileage, weights, times should dominate visually.
4. **Accent restraint** - Electric lime on more than 5% of the viewport is too much.
5. **Mobile-first** - Most views happen at the gym on a phone.
