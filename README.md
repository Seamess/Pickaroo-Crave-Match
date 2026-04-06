# Pickaroo Crave Match v2

## Overview
**Crave Match** is Pickaroo's collaborative food discovery and group ordering module. It transforms the "what should we eat?" decision into a fun, low-friction, Tinder-style swiping experience. Users create a match session, invite friends, swipe on food categories with real photos, find what the group craves, then order together from a unified hub with a single delivery fee.

This prototype demonstrates the full UI/UX flow across 3 screens, built as a mobile-first static web app.

## Design Philosophy

### v2 Changes from v1
- **Restrained Glassmorphism** — Glass effects only on footer/header overlays. Cards are solid white with subtle shadows for clarity.
- **Photo-first Swipe Cards** — AI-generated food photography replaces flat icons. Users should *crave* what they see.
- **Warm Palette** — Off-white background (`#FAF8F5`) with cerise (`#E83683`) and turquoise (`#1DE1CE`) accents.
- **Typography** — `Outfit` for bold display headings, `Inter` for body text.
- **Live Activity Feed** — Replaces the dead-end chat feature with a system-generated ticker.
- **Reduced Friction** — Settings removed from lobby; users start swiping in 1 tap.

## Key Features

### 1. Simplified Lobby (Screen 1 — `index.html`)
- **Live Activity Feed** — Auto-scrolling ticker showing real-time updates: "Raff joined the match", "Maan is swiping on Pizza".
- **Stacking Discount** — Two-way model: invite 5 friends = 5% off + ₱500+ basket = 5% off (max 10%).
- **Compact Hunters Strip** — Overlapping avatar row with invite button. No separate settings page.
- **1-Tap CTA** — "Start Swiping 🔥" is the dominant screen element.

### 2. Crave Match Swipe (Screen 2 — `crave_match.html`)
- **Photo Cards** — 8 food categories per deck with full-bleed photography and gradient text overlay.
- **Drag Gestures** — Pointer-event-based card dragging with CRAVE/NOPE stamp overlays.
- **Refresh Deck** — 3 pre-loaded decks (24 total food options). Shuffle button cycles through them.
- **Progress Dots** — Color-coded dots show swipe progress (cerise = craved, gray = noped).
- **Dynamic Match** — Results based on actual swipe choices, not hardcoded.
- **Confetti** — Canvas-based particle burst when all cards are swiped.
- **Mini Activity Ticker** — Shows what other group members are swiping in real time.

### 3. Hub Ordering & Payment (Screen 3 — `shared_order.html`)
- **Match Summary Badge** — Shows what the group matched on.
- **Restaurant Picker** — Modal with 4 restaurants, each with 3 menu items.
- **Enhanced Ally Drop** — Ordering from a nearby restaurant outside the hub with savings comparison ("Saves ₱45 vs separate order").
- **Payment Split** — Segmented control with 3 modes:
  - **Even Split** — Total divided equally among all members.
  - **By Item** — Each person pays for their own items + split delivery fee.
  - **Custom** — Manual adjustment (placeholder in prototype).
- **Payment Methods** — Horizontal picker with 5 PH payment options: GCash, Maya, Credit/Debit Card, Cash on Delivery, QR Ph.
- **Per-Person Breakdown** — Visual cards showing each member's share and paid/pending status.
- **Stack Discount** — Automatically applies when basket exceeds ₱500.

## How to View and Test

1. Open `index.html` in any modern web browser (Chrome, Edge, Safari, Firefox).
2. **Lobby**: See the live activity feed auto-update. Click the `+` button to simulate inviting friends. Click "Start Swiping" to proceed.
3. **Swipe**: Drag cards left/right or use the NOPE (❌) / CRAVE (🔥) buttons. Click the shuffle (🔀) button to refresh the deck. Complete all 8 cards to see the match result with confetti.
4. **Order**: Click "Add from Hub" to pick a restaurant and menu item. Toggle between split modes (Even/By Item/Custom). Select a payment method. Click "Lock Group Order" to see the checkout confirmation.

## File Structure
```
├── index.html           # Screen 1: Lobby
├── stylesheet.css       # Lobby design system
├── script.js            # Lobby logic
├── crave_match.html     # Screen 2: Swipe
├── crave_match.css      # Swipe styles
├── crave_match.js       # Swipe logic (3 decks, gestures, confetti)
├── shared_order.html    # Screen 3: Order & Payment
├── shared_order.css     # Order styles
├── shared_order.js      # Order logic (picker, split calc, payment)
├── images/              # AI-generated food photography
│   ├── smash_burger.png
│   ├── woodfired_pizza.png
│   ├── sushi_platter.png
│   ├── loaded_tacos.png
│   ├── boba_milktea.png
│   ├── ramen_bowl.png
│   ├── fried_chicken.png
│   └── desserts_sweets.png
└── README.md
```

## Risks, Constraints & Mitigations

### Technical
- **Real-Time Sync**: Shared cart requires WebSockets; mitigate with Redis queues + polling fallback.
- **Deep Linking**: Invite links need universal links (Firebase Dynamic Links); fallback to web-based guest cart.
- **Race Conditions**: Hunt Master has exclusive checkout; cart locks 5 minutes before deadline.

### Business & Operational
- **Margin Protection**: Stack discount capped at 10%. Basket must exceed ₱500 threshold.
- **Delivery**: Single drop-off point enforced (Hunt Master's location).
- **Split-Pay Failures**: Pre-authorization hold on each card. Hunt Master covers remainder if any card fails.
- **Ally Drop Feasibility**: Limited to 500m radius from hub. ₱15 flat fee covers rider detour.
- **Spam Invites**: Links expire in 2 hours. Max 20 members per session. Hunt Master approval required.