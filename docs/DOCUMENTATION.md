# Pickaroo Crave Match v3 — Technical Documentation

> **Document Version:** 3.0  
> **Date:** April 27, 2026  
> **Author:** Pickaroo Engineering  
> **Status:** Prototype — Browser-based static demo

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Capabilities Matrix](#3-capabilities-matrix)
   - 3.1 [Screen 1 — Lobby (Group)](#31-screen-1--lobby)
   - 3.2 [Screen 2 — Crave Match (Group Swipe)](#32-screen-2--crave-match-swipe)
   - 3.3 [Screen 3 — Hub Ordering (Group)](#33-screen-3--hub-ordering)
   - 3.4 [Screen 2S — Single User Crave Match](#34-screen-2s--single-user-crave-match)
   - 3.5 [Screen 3S — Single User Ordering](#35-screen-3s--single-user-ordering)
4. [System Diagrams](#4-system-diagrams)
   - 4.1 [Context Diagram](#41-context-diagram)
   - 4.2 [Data Flow Diagram (DFD) — Level 0](#42-data-flow-diagram-dfd--level-0)
   - 4.3 [Data Flow Diagram (DFD) — Level 1](#43-data-flow-diagram-dfd--level-1)
   - 4.4 [System Flow Diagram (SFD) — Group](#44-system-flow-diagram-sfd--group)
   - 4.5 [System Flow Diagram (SFD) — Single User](#45-system-flow-diagram-sfd--single-user)
   - 4.6 [HIPO Chart](#46-hipo-chart-hierarchy-plus-inputprocessoutput)
5. [Screen-by-Screen Specification](#5-screen-by-screen-specification)
6. [Data Dictionary](#6-data-dictionary)
7. [Business Rules Engine](#7-business-rules-engine)
8. [Technical Architecture](#8-technical-architecture)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Risks & Mitigations](#10-risks--mitigations)

---

## 1. Executive Summary

**Pickaroo Crave Match** is a gamified food ordering module that solves the "what should we eat?" problem. It operates in **two modes**:

1. **Group Mode** — For friend groups, families, and office teams. Uses a Tinder-like swipe mechanic to aggregate food preferences across a group, determines a consensus match, and routes all orders through a **Unified Hub Delivery** system — one rider, one fee, multiple restaurants.
2. **Single User Mode** — For solo users who want the same fun swipe-to-discover experience. Starts with a mood-based food deck, supports Super Crave (swipe up), and ends with a personal ordering flow — no group coordination needed.

### Value Proposition

| Stakeholder | Value |
|---|---|
| **End Users** | Removes decision paralysis; fun social experience; cheaper delivery via shared fees |
| **Pickaroo** | Higher AOV (average order value) via group orders; viral acquisition through invite links; increased engagement through gamification |
| **Restaurant Partners** | Access to group orders they wouldn't normally receive; Ally Drop expands their delivery radius |

### Key Metrics (Target)

| Metric | Target |
|---|---|
| Time to first swipe | < 5 seconds |
| Swipe completion rate | > 80% |
| Group conversion (match → order) | > 60% |
| Average group size | 3–5 hunters |
| Average order value | ₱800+ |

---

## 2. System Overview

Crave Match operates in **two modes** within the Pickaroo mobile app:

#### Group Mode — 3-screen progressive flow

```mermaid
flowchart LR
    A["Screen 1\nLobby"] -->|Start Swiping| B["Screen 2\nCrave Match"]
    B -->|Match Found| C["Screen 3\nHub Ordering"]
    C -->|Lock Order| D["Rider Dispatch"]
    
    style A fill:#FAF8F5,stroke:#E83683,stroke-width:2px,color:#1A1A2E
    style B fill:#FAF8F5,stroke:#E83683,stroke-width:2px,color:#1A1A2E
    style C fill:#FAF8F5,stroke:#1DE1CE,stroke-width:2px,color:#1A1A2E
    style D fill:#1DE1CE,stroke:#0fa294,stroke-width:2px,color:#fff
```

#### Single User Mode — 3-screen solo flow

```mermaid
flowchart LR
    E["Screen 2S\nMood Select"] -->|Pick Vibe| F["Screen 2S\nSolo Swipe"]
    F -->|Personal Pick| G["Screen 3S\nSolo Order"]
    G -->|Place Order| H["Rider Dispatch"]
    
    style E fill:#FAF8F5,stroke:#FFB347,stroke-width:2px,color:#1A1A2E
    style F fill:#FAF8F5,stroke:#E83683,stroke-width:2px,color:#1A1A2E
    style G fill:#FAF8F5,stroke:#1DE1CE,stroke-width:2px,color:#1A1A2E
    style H fill:#1DE1CE,stroke:#0fa294,stroke-width:2px,color:#fff
```

> **Key Difference:** Single User Mode replaces the lobby with a mood selector ("What's your vibe?") that curates emotion-based food decks, adds a Super Crave gesture (swipe up), and skips group coordination entirely.

### Technology Stack (Prototype)

| Layer | Technology |
|---|---|
| Structure | HTML5 (Semantic) |
| Styling | Vanilla CSS3 (Custom properties, CSS animations) |
| Logic | Vanilla JavaScript (ES6+, Pointer Events API, Canvas API) |
| Modals/Toasts | SweetAlert2 |
| Icons | Font Awesome 6 |
| Typography | Google Fonts (Inter, Outfit) |
| Assets | AI-generated food photography (PNG) |

---

## 3. Capabilities Matrix

### 3.1 Screen 1 — Lobby

| Capability | Description | Status |
|---|---|---|
| **Live Activity Feed** | Auto-scrolling ticker displaying real-time group events (joins, swipe activity, countdowns). Updates every 4 seconds. | ✅ Implemented |
| **Invite / Share** | One-tap invite link copy. Simulates friend joining with avatar pop-in animation. | ✅ Implemented |
| **Stacking Discount Display** | Two-way discount model visualized via tier pills: 5 friends = 5% off, ₱500+ basket = 5% off, max 10%. | ✅ Implemented |
| **Hunters Strip** | Overlapping avatar row showing current group members. Max 12. | ✅ Implemented |
| **Lobby Lock & Navigate** | CTA button locks lobby and transitions to swipe screen with loading state animation. | ✅ Implemented |
| **Leave Match Confirmation** | Modal confirmation to prevent accidental exits. | ✅ Implemented |

### 3.2 Screen 2 — Crave Match (Swipe)

| Capability | Description | Status |
|---|---|---|
| **Photo-First Swipe Cards** | Full-bleed food photography with gradient overlay, category badge, title, and subtitle. | ✅ Implemented |
| **Drag Gesture Swiping** | Pointer Events API-based drag with rotation physics, opacity fade, and snap-back on insufficient threshold (80px). | ✅ Implemented |
| **CRAVE / NOPE Stamps** | Overlaid text stamps that appear during drag (40px threshold), with scale+rotation animations. | ✅ Implemented |
| **Button Swiping** | Alternative NOPE (❌) and CRAVE (🔥) buttons for users who prefer tapping. Includes shake and pulse micro-animations. | ✅ Implemented |
| **3-Deck System** | 24 food categories across 3 interchangeable decks (8 cards each). | ✅ Implemented |
| **Refresh Deck** | Shuffle button cycles to the next deck with spin animation and card scale-out transition. Resets progress. | ✅ Implemented |
| **Progress Dots** | Color-coded indicators: cerise = craved, gray = noped, pill shape = current card. | ✅ Implemented |
| **Dynamic Match Result** | Determines top match and runner-up based on actual swipe choices (not hardcoded). | ✅ Implemented |
| **Confetti Celebration** | Canvas-based 60-particle confetti burst on match found, with gravity, rotation, and fade physics. | ✅ Implemented |
| **Mini Activity Ticker** | Shows simulated group activity ("Raff craved Smash Burgers") updating every 5 seconds. | ✅ Implemented |
| **Swipers Badge** | Shows "3/5 Swiping" status with green pulse dot. | ✅ Implemented |

### 3.3 Screen 3 — Hub Ordering

| Capability | Description | Status |
|---|---|---|
| **Match Summary Badge** | Displays group consensus result with vote count. | ✅ Implemented |
| **Restaurant Picker** | 2-step modal: pick restaurant → pick menu item. 4 restaurants × 3 items each. | ✅ Implemented |
| **Personal Cart** | Dynamic cart that accepts items from the picker. Empty state prompt converts to item list. | ✅ Implemented |
| **Group Items View** | Read-only view of other members' orders with avatar, restaurant, and per-item breakdown. | ✅ Implemented |
| **Ally Drop** | Enhanced nearby restaurant integration showing: distance (300m), savings comparison ("Saves ₱45 vs separate order"). | ✅ Implemented |
| **Payment Split — Even** | Total ÷ member count. Auto-recalculates on cart changes. | ✅ Implemented |
| **Payment Split — By Item** | Each person pays own items + proportional delivery fee share. | ✅ Implemented |
| **Payment Split — Custom** | Manual editing mode. | 🔲 Placeholder |
| **Payment Methods** | Horizontal picker: GCash, Maya, Card, COD, QR Ph. Visual selection state. | ✅ Implemented |
| **Stack Discount Engine** | Auto-applies 5% discount when basket ≥ ₱500. Displayed as line item in totals. | ✅ Implemented |
| **Checkout Flow** | Loading state → confirmation modal with payment method, your share, Ally Drop summary, and ETA. | ✅ Implemented |
| **Live Feed** | Same auto-scrolling ticker as lobby, contextualized for ordering ("Raff confirmed payment via GCash"). | ✅ Implemented |

### 3.4 Screen 2S — Single User Crave Match

| Capability | Description | Status |
|---|---|---|
| **Mood Selector ("What's your vibe?")** | 4 mood buttons (Comfort, Stressed & Starving, Treat Myself, Keep it Light) each curating a 5-card emotion-tailored deck. | ✅ Implemented |
| **Emotion-Based Food Decks** | 4 decks × 5 cards each (20 total), curated by mood. Comfort = Pizza, Fried Chicken, Mac & Cheese, Desserts, Ramen. Stress = Burgers, K-BBQ, Tacos, Wings, Boba. Happy = Sushi, Steak, Dim Sum, Desserts, Cocktails. Light = Poke, Açaí, Smoothies, Salads, Pho. | ✅ Implemented |
| **Super Crave Gesture** | Swipe up to trigger "Super Crave" — instantly ends swiping and crowns that food as the winner. Star (★) button alternative. | ✅ Implemented |
| **SUPER / CRAVE / NOPE Stamps** | 3 stamp types: SUPER (gold, swipe up), CRAVE (turquoise, swipe right), NOPE (red, swipe left). | ✅ Implemented |
| **Sudden Death Tiebreaker** | When multiple foods are craved with no Super Crave, sorts by "time spent admiring" and presents a tap-to-pick modal. | ✅ Implemented |
| **Time Tracking per Card** | Records milliseconds spent on each card for the tiebreaker algorithm. Displays "Admired for: X.Xs" in sudden death. | ✅ Implemented |
| **Session Handoff** | Stores winning food + runner-ups + mood in `sessionStorage` for the solo ordering page. | ✅ Implemented |
| **No Group Elements** | Hides swipers badge, mini activity ticker, discount strip, and members strip via CSS overrides. | ✅ Implemented |

### 3.5 Screen 3S — Single User Ordering

| Capability | Description | Status |
|---|---|---|
| **Match Badge (Solo)** | Displays the personal crave match result with icon, name, and runner-ups. Reads from `sessionStorage`. | ✅ Implemented |
| **Restaurant Picker** | Same 2-step hub picker as group mode: 4 restaurants × 3 items. | ✅ Implemented |
| **Personal Cart** | Dynamic cart with empty state → item list. Same add-from-hub flow. | ✅ Implemented |
| **Simplified Totals** | Subtotal + ₱49 delivery fee + optional stack discount (5% at ₱500+). No Ally Drop, no split. | ✅ Implemented |
| **Payment Methods** | Same 5-method horizontal picker: GCash, Maya, Card, COD, QR Ph. | ✅ Implemented |
| **Solo Checkout** | "Place My Order" CTA → loading → confirmation modal with crave match info, payment, total, item count, and ETA (20-30 min). | ✅ Implemented |
| **No Group Elements** | No live feed, no group items, no split payment, no Ally Drop. Clean solo experience. | ✅ Implemented |

---

## 4. System Diagrams

### 4.1 Context Diagram

The Context Diagram shows Crave Match as a single process interacting with all external entities.

```mermaid
graph TB
    U["👤 User\n(Hunt Master / Hunter)"]
    F["👥 Friends\n(Invited Members)"]
    RDB["🍔 Restaurant DB\n(Hub Menus)"]
    PGW["💳 Payment Gateway\n(GCash, Maya, Card, COD, QRPH)"]
    RDS["🛵 Rider Dispatch\n(Pickaroo Fleet)"]
    
    U -- "Create match, swipe, order, pay" --> CM
    F -- "Join via invite link, swipe, order" --> CM
    CM -- "Fetch menus & availability" --> RDB
    CM -- "Process split payments" --> PGW
    CM -- "Dispatch rider to hub" --> RDS
    
    CM["Pickaroo\nCrave Match\nSystem"]
    
    RDB -- "Menu data, prices" --> CM
    PGW -- "Payment confirmation" --> CM
    RDS -- "Rider ETA, status" --> CM

    style CM fill:#E83683,stroke:#c4276e,color:#fff,stroke-width:3px
    style U fill:#FAF8F5,stroke:#1A1A2E,stroke-width:2px,color:#1A1A2E
    style F fill:#FAF8F5,stroke:#1A1A2E,stroke-width:2px,color:#1A1A2E
    style RDB fill:#FAF8F5,stroke:#FFB347,stroke-width:2px,color:#1A1A2E
    style PGW fill:#FAF8F5,stroke:#66BB6A,stroke-width:2px,color:#1A1A2E
    style RDS fill:#FAF8F5,stroke:#1DE1CE,stroke-width:2px,color:#1A1A2E
```

**External Entities:**

| Entity | Role | Data Exchanged |
|---|---|---|
| **User (Hunt Master)** | Creates session, invites friends, locks lobby, swipes, orders, pays, receives delivery | Session config, swipe decisions, cart items, payment |
| **Friends (Hunters)** | Join via invite link, swipe, add items, pay their share | Join events, swipe decisions, cart items, payment |
| **Restaurant Database** | Serves menu data for the hub picker | Menu items, prices, availability, restaurant metadata |
| **Payment Gateway** | Processes split payments per member | Payment requests, confirmations, pre-auth holds |
| **Rider Dispatch** | Assigns and tracks rider for the unified hub delivery | Pickup locations, drop-off address, ETA updates |

---

### 4.2 Data Flow Diagram (DFD) — Level 0

The Level 0 DFD shows the single Crave Match process with all data stores and external flows.

```mermaid
flowchart TB
    subgraph External["External Entities"]
        USER["👤 User"]
        FRIENDS["👥 Friends"]
    end

    subgraph System["Crave Match System (Process 0)"]
        P0["0\nCrave Match\nApplication"]
    end
    
    subgraph Stores["Data Stores"]
        D1[("D1: Session Store\n(Match config, members, status)")]
        D2[("D2: Food Catalog\n(3 decks × 8 cards)")]
        D3[("D3: Swipe Results\n(Craved/Noped per user)")]
        D4[("D4: Cart Store\n(Items per member)")]
        D5[("D5: Payment Ledger\n(Splits, methods, status)")]
    end

    USER -- "Create session / Swipe decisions / Cart items / Payment selection" --> P0
    FRIENDS -- "Join session / Swipe decisions / Cart items / Payment selection" --> P0
    
    P0 -- "Match results / Order confirmation / ETA" --> USER
    P0 -- "Match results / Split amount / Payment status" --> FRIENDS

    P0 <--> D1
    P0 <--> D2
    P0 <--> D3
    P0 <--> D4
    P0 <--> D5

    style P0 fill:#E83683,stroke:#c4276e,color:#fff,stroke-width:3px
    style D1 fill:#FAF8F5,stroke:#1A1A2E,stroke-width:1px,color:#1A1A2E
    style D2 fill:#FAF8F5,stroke:#1A1A2E,stroke-width:1px,color:#1A1A2E
    style D3 fill:#FAF8F5,stroke:#1A1A2E,stroke-width:1px,color:#1A1A2E
    style D4 fill:#FAF8F5,stroke:#1A1A2E,stroke-width:1px,color:#1A1A2E
    style D5 fill:#FAF8F5,stroke:#1A1A2E,stroke-width:1px,color:#1A1A2E
```

---

### 4.3 Data Flow Diagram (DFD) — Level 1

The Level 1 DFD decomposes Process 0 into its 5 core sub-processes.

```mermaid
flowchart TB
    USER["👤 User / Friends"]
    
    P1["1.0\nSession\nManagement"]
    P2["2.0\nFood\nSwiping"]
    P3["3.0\nMatch\nEngine"]
    P4["4.0\nOrder\nBuilder"]
    P5["5.0\nPayment\nProcessor"]

    D1[("D1: Session Store")]
    D2[("D2: Food Catalog")]
    D3[("D3: Swipe Results")]
    D4[("D4: Cart Store")]
    D5[("D5: Payment Ledger")]

    USER -- "Create/Join session" --> P1
    P1 -- "Session ID, member list" --> D1
    P1 -- "Lobby locked signal" --> P2
    D1 -- "Session config" --> P1

    P2 -- "Load food deck" --> D2
    D2 -- "Food cards (8 per deck)" --> P2
    USER -- "Swipe (crave/nope)" --> P2
    P2 -- "Record decision" --> D3
    P2 -- "All swiped signal" --> P3

    D3 -- "All member decisions" --> P3
    P3 -- "Top match + runner-up" --> USER
    P3 -- "Matched categories" --> P4

    USER -- "Select restaurant, pick items" --> P4
    P4 -- "Store cart items" --> D4
    D4 -- "Group cart (all members)" --> P4
    P4 -- "Subtotal, fees, discounts" --> P5

    USER -- "Select split mode, payment method" --> P5
    P5 -- "Calculate per-person share" --> D5
    P5 -- "Confirmation + ETA" --> USER

    style P1 fill:#FFB347,stroke:#D4920A,color:#1A1A2E,stroke-width:2px
    style P2 fill:#E83683,stroke:#c4276e,color:#fff,stroke-width:2px
    style P3 fill:#1DE1CE,stroke:#0fa294,color:#1A1A2E,stroke-width:2px
    style P4 fill:#B388FF,stroke:#7C4DFF,color:#1A1A2E,stroke-width:2px
    style P5 fill:#66BB6A,stroke:#43A047,color:#fff,stroke-width:2px
```

**Process Descriptions:**

| Process | Name | Inputs | Outputs | Logic |
|---|---|---|---|---|
| **1.0** | Session Management | Create/join request, invite link | Session ID, member list, activity feed events | Creates match session, manages members (max 20), generates invite links (2hr expiry), broadcasts join/leave events |
| **2.0** | Food Swiping | Food deck data, user swipe gesture | Craved/noped arrays, progress state | Renders photo cards, captures drag gestures (80px threshold), tracks decisions per card, supports deck refresh |
| **3.0** | Match Engine | All member swipe results | Top match, runner-up, vote counts | Aggregates craved lists across members, determines consensus via vote count, resolves ties |
| **4.0** | Order Builder | Restaurant menus, user selections | Cart items, subtotal, fees | Presents hub restaurants, adds items to personal cart, aggregates group cart, calculates subtotal + delivery fees |
| **5.0** | Payment Processor | Split mode, payment method, totals | Per-person share, confirmation | Computes split (even/by-item/custom), applies stack discount, processes payment, generates confirmation |

---

### 4.4 System Flow Diagram (SFD) — Group

The SFD shows the complete Group Mode user journey from start to finish, including decision points and error handling.

```mermaid
flowchart TD
    START(["🟢 Start"]) --> CREATE["User opens Crave Match"]
    CREATE --> LOBBY["Display Lobby Screen"]
    
    LOBBY --> INVITE{"Invite\nFriends?"}
    INVITE -- Yes --> SHARE["Copy invite link\n+ Simulate join"]
    SHARE --> LOBBY
    INVITE -- No --> CTA_CHECK{"Click 'Start\nSwiping'?"}
    
    CTA_CHECK -- No --> SKIP{"Click 'Skip to\nOrder'?"}
    SKIP -- Yes --> ORDER_SCREEN
    SKIP -- No --> LOBBY
    CTA_CHECK -- Yes --> LOCK["Lock Lobby\n(Loading animation)"]
    
    LOCK --> SWIPE_SCREEN["Display Swipe Screen\n(Load Deck 1: 8 cards)"]
    
    SWIPE_SCREEN --> SWIPE_ACTION{"User Action?"}
    
    SWIPE_ACTION -- "Drag right / Tap 🔥" --> CRAVE["Record: CRAVE\nAnimate card right\nUpdate progress dot"]
    SWIPE_ACTION -- "Drag left / Tap ❌" --> NOPE["Record: NOPE\nAnimate card left\nUpdate progress dot"]
    SWIPE_ACTION -- "Tap 🔀" --> REFRESH["Switch to next deck\nReset progress\nClear craved/noped"]
    
    REFRESH --> SWIPE_SCREEN
    CRAVE --> REMAINING{"Cards\nremaining?"}
    NOPE --> REMAINING
    
    REMAINING -- Yes --> SWIPE_SCREEN
    REMAINING -- No --> MATCH["Run Match Engine\nFire confetti 🎊"]
    
    MATCH --> SHOW_RESULT["Display Match Modal\n(Top Match + Runner-up)"]
    SHOW_RESULT --> ORDER_SCREEN["Display Hub Ordering Screen"]
    
    ORDER_SCREEN --> ADD{"Add items\nfrom Hub?"}
    ADD -- Yes --> PICK_REST["Open Restaurant Picker\n(4 restaurants)"]
    PICK_REST --> PICK_ITEM["Select Menu Item"]
    PICK_ITEM --> CART["Add to personal cart\nRecalculate totals"]
    CART --> DISCOUNT{"Basket\n≥ ₱500?"}
    DISCOUNT -- Yes --> APPLY_DISC["Apply 5% stack discount"]
    DISCOUNT -- No --> ORDER_SCREEN
    APPLY_DISC --> ORDER_SCREEN
    
    ADD -- No --> SPLIT{"Select split\nmode"}
    SPLIT --> SPLIT_CALC["Calculate per-person share\n(Even / By Item / Custom)"]
    SPLIT_CALC --> PAY_METHOD["Select payment method\n(GCash / Maya / Card / COD / QRPH)"]
    PAY_METHOD --> CHECKOUT{"Lock Group\nOrder?"}
    
    CHECKOUT -- No --> ORDER_SCREEN
    CHECKOUT -- "Yes (empty cart)" --> ERROR["⚠️ Warning:\n'Add items first!'"]
    ERROR --> ORDER_SCREEN
    CHECKOUT -- "Yes (has items)" --> PROCESS["Processing...\n'Routing Riders...'"]
    PROCESS --> CONFIRM["🎉 Order Locked!\nShow confirmation modal"]
    CONFIRM --> TRACK["Track Riders →"]
    TRACK --> DONE(["🔴 End"])

    style START fill:#66BB6A,stroke:#43A047,color:#fff
    style DONE fill:#E83683,stroke:#c4276e,color:#fff
    style MATCH fill:#1DE1CE,stroke:#0fa294,color:#1A1A2E
    style CONFIRM fill:#1DE1CE,stroke:#0fa294,color:#1A1A2E
    style ERROR fill:#FFB347,stroke:#D4920A,color:#1A1A2E
```

---

### 4.5 System Flow Diagram (SFD) — Single User

The Single User SFD shows the solo journey: mood selection → emotion-based swiping → personal ordering.

```mermaid
flowchart TD
    START2(["\ud83d\udfe2 Start"]) --> MOOD["Display Mood Selector\n'What's your vibe?'"]
    
    MOOD --> M1["Need Comfort \ud83e\udd7a"]
    MOOD --> M2["Stressed & Starving \ud83d\udd25"]
    MOOD --> M3["Treat Myself \u2728"]
    MOOD --> M4["Keep it Light \ud83c\udf31"]
    
    M1 --> LOAD["Load Emotion Deck\n(5 cards)"]
    M2 --> LOAD
    M3 --> LOAD
    M4 --> LOAD
    
    LOAD --> SWIPE2["Display Swipe Screen\n(Solo mode)"]
    
    SWIPE2 --> ACTION2{"User Action?"}
    ACTION2 -- "Swipe right / Tap \ud83d\udd25" --> CRAVE2["Record: CRAVE"]
    ACTION2 -- "Swipe left / Tap \u274c" --> NOPE2["Record: NOPE"]
    ACTION2 -- "Swipe up / Tap \u2b50" --> SUPER["Record: SUPER CRAVE\n(Instant winner)"]
    ACTION2 -- "Tap \ud83d\udd00" --> REFRESH2["Shuffle same deck\nReset progress"]
    
    REFRESH2 --> SWIPE2
    SUPER --> MATCH2["Crown winner\nFire confetti \ud83c\udf8a"]
    CRAVE2 --> REM2{"Cards\nremaining?"}
    NOPE2 --> REM2
    
    REM2 -- Yes --> SWIPE2
    REM2 -- No --> CHECK_CRAVED{"Any foods\ncraved?"}
    
    CHECK_CRAVED -- No --> NO_CRAVE["\u2139\ufe0f 'No Cravings?'\nRefresh deck"]
    NO_CRAVE --> SWIPE2
    CHECK_CRAVED -- "1 craved" --> MATCH2
    CHECK_CRAVED -- "2+ craved" --> TIE["Sudden Death! \u2694\ufe0f\nTap to pick winner"]
    TIE --> MATCH2
    
    MATCH2 --> SHOW2["Your Personal Pick!\n(Winner + runner-ups)"]
    SHOW2 --> ORDER2["Display Solo Order Screen"]
    
    ORDER2 --> ADD2{"Add items?"}
    ADD2 -- Yes --> PICK2["Restaurant Picker"]
    PICK2 --> ITEM2["Select Menu Item"]
    ITEM2 --> CART2["Add to cart\nRecalculate totals"]
    CART2 --> DISC2{"Basket \u2265 \u20b1500?"}
    DISC2 -- Yes --> APPLY2["Apply 5% discount"]
    DISC2 -- No --> ORDER2
    APPLY2 --> ORDER2
    
    ADD2 -- No --> PAY2["Select payment method"]
    PAY2 --> CHECKOUT2{"Place My\nOrder?"}
    CHECKOUT2 -- No --> ORDER2
    CHECKOUT2 -- "Empty cart" --> ERR2["\u26a0\ufe0f Add items first!"]
    ERR2 --> ORDER2
    CHECKOUT2 -- "Has items" --> PROCESS2["Placing Order..."]
    PROCESS2 --> CONFIRM2["\ud83c\udf89 Order Placed!\nConfirmation modal"]
    CONFIRM2 --> TRACK2["Track Order \u2192"]
    TRACK2 --> DONE2(["\ud83d\udd34 End"])

    style START2 fill:#66BB6A,stroke:#43A047,color:#fff
    style DONE2 fill:#E83683,stroke:#c4276e,color:#fff
    style MATCH2 fill:#1DE1CE,stroke:#0fa294,color:#1A1A2E
    style CONFIRM2 fill:#1DE1CE,stroke:#0fa294,color:#1A1A2E
    style SUPER fill:#FFB347,stroke:#D4920A,color:#1A1A2E
    style TIE fill:#FFB347,stroke:#D4920A,color:#1A1A2E
```

---

### 4.6 HIPO Chart (Hierarchy Plus Input/Process/Output)

#### 4.6.1 Module Hierarchy

```mermaid
graph TD
    ROOT["Crave Match System\n(Root Module)"]
    
    ROOT --> M1["1.0 Lobby Module\n(script.js)"]
    ROOT --> M2["2.0 Group Swipe Module\n(crave_match.js)"]
    ROOT --> M3["3.0 Group Order Module\n(shared_order.js)"]
    ROOT --> M4["4.0 Solo Swipe Module\n(single_crave_match.js)"]
    ROOT --> M5["5.0 Solo Order Module\n(single_order.js)"]
    
    M1 --> M1A["1.1 Live Activity Feed"]
    M1 --> M1B["1.2 Invite / Share"]
    M1 --> M1C["1.3 Discount Tier Display"]
    M1 --> M1D["1.4 Lobby Lock / Navigate"]
    
    M2 --> M2A["2.1 Card Renderer"]
    M2 --> M2B["2.2 Drag Gesture Engine"]
    M2 --> M2C["2.3 Swipe Tracker"]
    M2 --> M2D["2.4 Deck Refresh"]
    M2 --> M2E["2.5 Match Engine"]
    M2 --> M2F["2.6 Confetti Renderer"]
    
    M3 --> M3A["3.1 Restaurant Picker"]
    M3 --> M3B["3.2 Cart Manager"]
    M3 --> M3C["3.3 Split Calculator"]
    M3 --> M3D["3.4 Payment Selector"]
    M3 --> M3E["3.5 Checkout Processor"]

    M4 --> M4A["4.1 Mood Selector"]
    M4 --> M4B["4.2 Emotion Deck Loader"]
    M4 --> M4C["4.3 Super Crave Engine"]
    M4 --> M4D["4.4 Time Tracker"]
    M4 --> M4E["4.5 Tiebreaker / Match"]
    M4 --> M4F["4.6 Session Handoff"]

    M5 --> M5A["5.1 Match Badge Loader"]
    M5 --> M5B["5.2 Restaurant Picker"]
    M5 --> M5C["5.3 Cart Manager"]
    M5 --> M5D["5.4 Payment Selector"]
    M5 --> M5E["5.5 Solo Checkout"]

    style ROOT fill:#E83683,stroke:#c4276e,color:#fff,stroke-width:2px
    style M1 fill:#FFB347,stroke:#D4920A,color:#1A1A2E,stroke-width:2px
    style M2 fill:#1DE1CE,stroke:#0fa294,color:#1A1A2E,stroke-width:2px
    style M3 fill:#B388FF,stroke:#7C4DFF,color:#1A1A2E,stroke-width:2px
    style M4 fill:#FFB347,stroke:#D4920A,color:#1A1A2E,stroke-width:2px
    style M5 fill:#66BB6A,stroke:#43A047,color:#fff,stroke-width:2px
```

#### 4.5.2 IPO Detail — Per Module

> [!NOTE]
> Each row below maps a sub-module to its exact Input, Processing logic, and Output as implemented in the current codebase.

---

**Module 1.0 — Lobby (script.js)**

| Sub-Module | Input | Process | Output |
|---|---|---|---|
| **1.1 Live Activity Feed** | `activityMessages[]` array (6 pre-defined messages) | `setInterval(addActivityItem, 4000)` — creates DOM element, inserts before first child, trims to max 3 visible items | Animated `activity-item` DOM nodes with emoji, text, timestamp |
| **1.2 Invite / Share** | Click event on `#share-btn` | 1. Show toast "Invite link copied!" 2. Swap button icon to ✓ 3. After 1.5s: create avatar element with random pastel color, append to `#avatar-row` with scale(0→1) bounce animation 4. Increment `huntersCount` 5. Add "X joined" to activity feed | New avatar in strip, activity feed entry, timer on invite feedback |
| **1.3 Discount Tier Display** | `huntersCount` integer | `updateDiscountTiers()` — if hunters ≥ 5, activates first `.tier-pill` via `.active` class | Visual state change on tier pill (turquoise highlight) |
| **1.4 Lobby Lock** | Click event on `#start-swiping-btn` | 1. Remove `.pulse` class 2. Set text to "Locking Lobby..." with reduced opacity 3. After 800ms: set text to "Let's Go! 🚀" 4. After 600ms more: `window.location.href = 'crave_match.html'` | Page navigation to swipe screen |

---

**Module 2.0 — Swipe (crave_match.js)**

| Sub-Module | Input | Process | Output |
|---|---|---|---|
| **2.1 Card Renderer** | `foodCards[]` (current deck, 8 items), `currentIndex` | `renderCards()` — clears container, iterates remaining cards in reverse, calculates scale (1 − stackPos×0.04) and translateY (stackPos×−12) per card, hides cards beyond position 3 with opacity:0. Attaches drag to top card. | Stack of `swipe-card` DOM elements with photo, overlay, stamps, content |
| **2.2 Drag Gesture Engine** | `pointerdown`, `pointermove`, `pointerup` events | `onPointerDown`: capture pointer, record startX. `onPointerMove`: calc deltaX, apply `translateX(Δx) rotate(Δx×0.08)`, show CRAVE stamp if Δx > 40, NOPE stamp if Δx < −40. `onPointerUp`: if \|Δx\| > 80px threshold fire swipe, else snap back. | Card visual follows finger; stamps appear; swipe triggers or snap-back |
| **2.3 Swipe Tracker** | `direction` ('left'/'right'), `currentFood` object | `swipeTopCard()` — pushes to `craved[]` or `noped[]`, applies `card-swipe-left/right` CSS class, increments `currentIndex`, calls `renderProgressDots()`, after 350ms removes card DOM and calls `updateRemainingCards()` | Updated arrays, animated card exit, progress dot state change |
| **2.4 Deck Refresh** | Click event on `#btn-refresh` | `btnRefresh.click` — cycles `currentDeckIndex` (mod 3), replaces `foodCards`, resets `currentIndex`/`craved`/`noped`, animates existing cards to scale(0.5)+opacity(0), after 350ms re-renders | New deck loaded, progress reset, spin animation on button |
| **2.5 Match Engine** | `craved[]` array after all 8 cards swiped | `showMatchResult()` — `craved[0]` = top match, `craved[1]` = runner-up, uses `craved.length` for vote count. Shows "All Swiped!" empty state, then SweetAlert modal after 1200ms with match results and "Order from Hub" CTA. | Confetti burst, empty state card, modal with match data, navigation to order screen |
| **2.6 Confetti Renderer** | Canvas element `#confetti-canvas` | `fireConfetti()` — creates 60 particles at canvas center, each with random velocity/color/rotation/size. Runs `requestAnimationFrame` loop applying gravity (+0.15 vy), air resistance (×0.98 vx), fade (−0.012 opacity), and rotation. Terminates at frame 120 or all particles faded. | 60 animated confetti rectangles on canvas overlay |

---

**Module 3.0 — Order (shared_order.js)**

| Sub-Module | Input | Process | Output |
|---|---|---|---|
| **3.1 Restaurant Picker** | Click event on `#add-more-btn`, `restaurants[]` array (4 restaurants × 3 items) | Step 1: SweetAlert modal lists restaurants with icon/name/item count. Step 2: On restaurant click, opens second modal listing menu items with prices. On item click, calls `addItemToCart()`. | 2-step modal flow → item added to cart |
| **3.2 Cart Manager** | `item` object, `restaurant` object from picker | `addItemToCart()` — clears empty state on first add, pushes `{name, price, restaurant}` to `cartItems[]`, adds `mySubtotal`, creates order-item DOM element, calls `recalculateTotals()`, shows toast confirmation. | Cart item in DOM, updated subtotal, toast notification |
| **3.3 Split Calculator** | `splitMode` ('even'/'item'/'custom'), `total` number | `updateSplitAmounts()` — **Even**: total ÷ 4 for all members. **By Item**: each member's own items + (hubDeliveryFee + allyDropFee) ÷ 4. **Custom**: no-op (placeholder). Updates all `.split-amount` elements. | Per-person share amounts displayed in split rows |
| **3.4 Payment Selector** | Click event on `.method-card` elements | Event delegation on `#payment-methods` — removes `.selected` from all, adds to clicked card, updates `selectedPayment` variable, applies scale(0.93) micro-animation. | Visual selection state, stored payment method string |
| **3.5 Checkout Processor** | Click on `#lock-order-btn`, `cartItems[]`, `selectedPayment`, `yourShareEl.textContent` | 1. Guard: if cart empty, show warning modal. 2. Set button to "Routing Riders..." with opacity 0.7. 3. After 1500ms: set to "Order Locked! 🚀", change bg to cerise. 4. Show SweetAlert with payment method, your share, Ally Drop info, and ETA (25-35 min). 5. After 3000ms: reset button. | Loading state, confirmation modal, button state cycle |

---

**Module 4.0 — Solo Swipe (single_crave_match.js)**

| Sub-Module | Input | Process | Output |
|---|---|---|---|
| **4.1 Mood Selector** | Click event on mood button | `selectMood(mood)` — sets `currentMood`, copies emotion deck to `foodCards[]`, resets state, fades out emotion screen, shows swipe view + progress dots. | Food deck loaded, UI transition to swipe screen |
| **4.2 Emotion Deck Loader** | `currentMood` string ('comfort'/'stress'/'happy'/'light') | Indexes into `emotionDecks` object (4 decks × 5 cards). Each card has: id, name, subtitle, icon, image, category. | 5-card deck ready for swiping |
| **4.3 Super Crave Engine** | Swipe up gesture (Δy < −80px, |Δy| > |Δx|) or ★ button click | Sets `isSuperCrave = true` on food, pushes to `craved[]`, applies `card-swipe-up` class, immediately calls `showMatchResult()`. | Instant match winner, bypasses remaining cards |
| **4.4 Time Tracker** | `Date.now()` on card load and swipe | `cardStartTime` set on each new card. On swipe, `food.timeSpent = Date.now() - cardStartTime`. Used in tiebreaker. | Millisecond time-on-card per food item |
| **4.5 Tiebreaker / Match** | `craved[]` array | `showMatchResult()` — Priority: 1. Super Crave (instant), 2. Single craved (auto-win), 3. Multiple craved → Sudden Death (sort by timeSpent desc, present as tappable buttons). `resolveTiebreaker(foodId)` handles user selection. | Winner crowned via `finishMatch()`, modal displayed |
| **4.6 Session Handoff** | Winning food object, runner-ups, mood | `finishMatch()` calls `sessionStorage.setItem('singleMatchData', JSON.stringify({...}))` storing winner, runnerUps, mood, isSuper. On "Browse Restaurants" → navigates to `single_order.html`. | Data persisted in sessionStorage, page redirect |

---

**Module 5.0 — Solo Order (single_order.js)**

| Sub-Module | Input | Process | Output |
|---|---|---|---|
| **5.1 Match Badge Loader** | `sessionStorage.getItem('singleMatchData')` | Parses JSON, populates `#solo-match-icon`, `#solo-match-title`, `#solo-match-sub` with winner icon, name, and runner-up names. | Match badge displays personal crave result |
| **5.2 Restaurant Picker** | Click on `#solo-add-btn`, same `restaurants[]` as group mode | Identical 2-step SweetAlert flow: restaurant list → menu items. On item click, calls `addItemToCart()`. | 2-step picker modal → item added to cart |
| **5.3 Cart Manager** | `item` + `restaurant` from picker | `addItemToCart()` — clears empty state, pushes to `cartItems[]`, adds to `mySubtotal`, creates DOM element, calls `recalculateTotals()`, shows success toast. | Cart items in DOM, updated subtotal |
| **5.4 Payment Selector** | Click on `.method-card` in `#solo-payment-methods` | Event delegation — toggles `.selected` class, updates `selectedPayment` string, scale micro-animation. | Visual selection + stored payment method |
| **5.5 Solo Checkout** | Click `#solo-checkout-btn`, `cartItems[]`, `selectedPayment` | 1. Guard: empty cart → warning. 2. Button to "Placing Order..." + opacity 0.7. 3. After 1500ms: "Order Placed! 🚀". 4. SweetAlert confirmation with crave match info, payment method, total, item count, ETA (20-30 min). 5. After 3000ms: reset button. | Loading → confirmation modal → button reset |

---

## 5. Screen-by-Screen Specification

### 5.1 Screen 1 — Lobby

![Lobby Screen](lobby_screenshot.png)

| Element | Component | Behavior |
|---|---|---|
| **Status Bar** | Time + signal/wifi/battery icons | Static display |
| **Header** | Back button + "Crave Match 🔥" title | Back → leave confirmation modal |
| **Live Activity Feed** | 3-item ticker with pulse dot | Auto-updates every 4s; new items slide in from top |
| **Stack & Save Badge** | Icon + title + description + 3 tier pills | First pill active by default; second activates at ₱500+ basket |
| **Hunters Strip** | "Hunters" label + avatar row + ➕ button | Avatars overlap (−8px margin); ➕ triggers invite flow |
| **CTA Button** | "Start Swiping 🔥" in cerise | Pulse shadow animation; locks on click with loading states |
| **Skip Link** | "We already know what we want →" | Direct navigation to `shared_order.html` |
| **Footer** | Home indicator bar | Glassmorphic background blur |

### 5.2 Screen 2 — Crave Match

````carousel
![Swipe Screen — Burger Card](swipe_screenshot.png)
<!-- slide -->
![Swipe Screen — Boba Card (5th card)](swipe_boba_screenshot.png)
<!-- slide -->
![Match Found Modal](match_modal_screenshot.png)
````

| Element | Component | Behavior |
|---|---|---|
| **Header** | Back + title + "3/5 Swiping" badge | Badge shows active swiper count with pulse dot |
| **Mini Activity** | Single-line ticker | Updates on each swipe + auto-simulated every 5s |
| **Progress Dots** | 8 dots (1 per card) | Active = cerise pill, Done = turquoise/cerise/gray circle |
| **Card Stack** | Max 3 visible, 8 in DOM | Top card: scale(1). 2nd: scale(0.96) translateY(−12px). 3rd: scale(0.92) translateY(−24px). Rest: hidden |
| **CRAVE Stamp** | "CRAVE" text, turquoise border | Appears at 40px rightward drag with bounce scale |
| **NOPE Stamp** | "NOPE" text, red border | Appears at 40px leftward drag with bounce scale |
| **NOPE Button** | White circle, red ❌ | Shake animation on hover; triggers left swipe |
| **CRAVE Button** | Cerise gradient circle, white 🔥 | Flame dance animation; scale pulse on click |
| **Refresh Button** | White circle, honey 🔀 | Spin animation; cycles deck (1→2→3→1) |

### 5.3 Screen 3 — Hub Ordering

![Order Screen](order_screenshot.png)

| Element | Component | Behavior |
|---|---|---|
| **Mini Feed** | Single-line with green pulse dot | Updates every 5s + on user cart changes |
| **Match Badge** | Burger icon + match text + hub pill | Read-only summary from match result |
| **Hub Header** | "Unified Hub Delivery" badge + name + fee | Shows restaurant count and flat ₱49 delivery fee |
| **Your Items** | Empty state → cart items | "Tap below to add from Uptown Mall 🍽️" converts to item list |
| **Add from Hub** | Dashed turquoise button | Opens 2-step restaurant→menu picker modal |
| **Group Items** | Per-member order cards | Avatar + name + restaurant + itemized prices |
| **Ally Drop Card** | Turquoise-bordered order card | Shows "300m away" tag + "Saves ₱45 vs separate order" |
| **Split Payment** | Segmented control + member rows | Even/By Item/Custom toggle; per-person avatar + amount + status badge |
| **Payment Methods** | Horizontal scroll of 5 cards | GCash, Maya, Card, COD, QR Ph; selected = cerise border |
| **Totals** | Subtotal + delivery + Ally Drop + discount + total | Stack discount auto-shows at ₱500+; total in cerise Outfit font |
| **Lock Order CTA** | Turquoise full-width button | Guards empty cart; shows loading + confirmation modal |

### 5.4 Screen 2S — Single User Crave Match

| Element | Component | Behavior |
|---|---|---|
| **Status Bar** | Time + signal/wifi/battery icons | Static display |
| **Header** | Back button + "Crave Match 🔥" title (centered) | Swipers badge hidden; title centered |
| **Mood Selector** | 4 mood buttons with emoji, title, examples | "What's your vibe?" → each loads emotion-curated deck. Fades out on selection |
| **Progress Dots** | 5 dots (1 per card) | Hidden initially; shown after mood selection. Same color coding as group |
| **Card Stack** | Max 3 visible, 5 in DOM | Same photo-first stack as group mode. Includes SUPER stamp (gold, centered) |
| **SUPER Stamp** | "SUPER" text, gold border | Appears on upward drag (60px threshold); centered on card |
| **CRAVE / NOPE Stamps** | Same as group mode | Left/right drag stamps |
| **NOPE Button** | White circle, red ❌ | Same shake animation |
| **Super Crave Button** | White circle, gold ★ | New button between NOPE and CRAVE. Triggers upward swipe animation |
| **CRAVE Button** | Turquoise gradient circle, white 🔥 | Same flame dance animation |
| **Refresh Button** | White circle, honey 🔀 | Shuffles current mood deck (not cycle) |
| **Sudden Death Modal** | Tappable food buttons sorted by admire time | Shows when 2+ foods craved with no Super Crave. Displays "Admired for: X.Xs" |
| **Personal Pick Modal** | Winner card + runner-ups + "Browse Restaurants" CTA | Navigates to `single_order.html` on confirm |

### 5.5 Screen 3S — Solo Ordering

| Element | Component | Behavior |
|---|---|---|
| **Status Bar** | Time + signal/wifi/battery icons | Static display |
| **Header** | Back button + "Your Order" title | Back → `single_crave_match.html` |
| **Match Badge** | Winner icon + "[Name] matched!" + runner-up text | Reads from `sessionStorage`; shows "Your top crave!" if no data |
| **Hub Header** | "Hub Delivery" badge + "Uptown Mall Hub" + ₱49 fee | Simplified: "1 Delivery Fee • Your Pick" (no group restaurant count) |
| **Your Items** | Empty state → cart items | Same as group mode cart |
| **Add from Hub** | Dashed turquoise button | Same 2-step restaurant picker |
| **Payment Methods** | Horizontal scroll of 5 cards | GCash, Maya, Card, COD, QR Ph; same selection mechanics |
| **Totals** | Subtotal + ₱49 delivery + discount + total | No Ally Drop fee, no split. Discount auto-shows at ₱500+ |
| **Place My Order CTA** | Turquoise full-width button | Guards empty cart; loading → confirmation with crave match info + ETA (20-30 min) |

---

## 6. Data Dictionary

### 6.1 Food Card Object

```json
{
  "id": 1,
  "name": "Smash Burgers",
  "subtitle": "Juicy, cheesy, messy goodness",
  "icon": "🍔",
  "image": "images/smash_burger.png",
  "category": "Fast Food"
}
```

| Field | Type | Description |
|---|---|---|
| `id` | `number` | Unique identifier (1–24 across 3 decks) |
| `name` | `string` | Display name for the card title |
| `subtitle` | `string` | Appetizing description below title |
| `icon` | `string` | Emoji icon for category badge and activity feed |
| `image` | `string` | Relative path to food photo (PNG) |
| `category` | `string` | Cuisine category label |

### 6.2 Restaurant Object

```json
{
  "name": "Burger Joint",
  "icon": "🍔",
  "items": [
    { "name": "Smash Burger", "price": 180 },
    { "name": "Cheesy Fries", "price": 95 },
    { "name": "Milkshake", "price": 120 }
  ]
}
```

### 6.3 Cart Item Object

```json
{
  "name": "Smash Burger",
  "price": 180,
  "restaurant": "Burger Joint"
}
```

### 6.4 Session State Variables

| Variable | Type | Scope | Description |
|---|---|---|---|
| `huntersCount` | `number` | Lobby | Current member count (init: 3, max: 12) |
| `currentDeckIndex` | `number` | Group Swipe | Active deck (0, 1, or 2) |
| `foodCards` | `array` | Swipe (Both) | Current deck's food items (8 for group, 5 for solo) |
| `currentIndex` | `number` | Swipe (Both) | Index of top card |
| `craved` | `array` | Swipe (Both) | Food items swiped right |
| `noped` | `array` | Swipe (Both) | Food items swiped left |
| `currentMood` | `string` | Solo Swipe | Selected mood ('comfort'/'stress'/'happy'/'light') |
| `cardStartTime` | `number` | Solo Swipe | `Date.now()` when current card was shown (for tiebreaker) |
| `cartItems` | `array` | Order (Both) | User's personal cart items |
| `mySubtotal` | `number` | Order (Both) | Sum of user's cart items (₱) |
| `groupItemsTotal` | `number` | Group Order | Sum of group members' items (₱780 fixed in prototype) |
| `selectedPayment` | `string` | Order (Both) | Active payment method key |
| `splitMode` | `string` | Group Order | Active split mode ('even', 'item', 'custom') |

### 6.5 Session Handoff Object (Single User)

```json
{
  "winner": {
    "id": 1,
    "name": "Wood-fired Pizza",
    "subtitle": "Charred crust, fresh mozzarella",
    "icon": "🍕",
    "image": "images/woodfired_pizza.png",
    "category": "Italian",
    "isSuperCrave": false,
    "timeSpent": 3420
  },
  "runnerUps": [],
  "mood": "comfort",
  "isSuper": false
}
```

| Field | Type | Description |
|---|---|---|
| `winner` | `object` | The winning food card object (with added `timeSpent` and optional `isSuperCrave`) |
| `runnerUps` | `array` | Other craved foods that didn't win |
| `mood` | `string` | The mood that was selected ('comfort', 'stress', 'happy', 'light') |
| `isSuper` | `boolean` | Whether the win was via Super Crave gesture |

---

## 7. Business Rules Engine

### 7.1 Stacking Discount Logic

```
RULE: Stack Discount Calculation

IF group_size >= 5 THEN
    friend_discount = 5%
ELSE
    friend_discount = 0%

IF basket_subtotal >= 500 THEN
    basket_discount = 5%
ELSE
    basket_discount = 0%

total_discount = MIN(friend_discount + basket_discount, 10%)
discount_amount = ROUND(basket_subtotal × total_discount)
```

> [!IMPORTANT]
> The maximum combined discount is capped at **10%** to protect margins. Both conditions can stack independently.

### 7.2 Split Payment Logic

```
RULE: Even Split
    per_person = total / member_count

RULE: By Item Split
    fee_share = (hub_delivery_fee + ally_drop_fee) / member_count
    per_person = own_items_subtotal + fee_share

RULE: Custom Split (Future)
    per_person = manually_entered_amount
    CONSTRAINT: SUM(all_shares) MUST EQUAL total
```

### 7.3 Ally Drop Eligibility

```
RULE: Ally Drop
    IF restaurant_distance <= 500m FROM hub THEN
        eligible = TRUE
        ally_fee = ₱15 (flat)
        savings = normal_delivery_fee - ally_fee
    ELSE
        eligible = FALSE
```

### 7.4 Session Constraints

| Rule | Value | Rationale |
|---|---|---|
| Max members per session | 20 | Server load + UX readability |
| Invite link expiry | 2 hours | Prevent ghost sessions |
| Min members to start | 1 (Hunt Master alone) | Allow solo use |
| Cards per deck (Group) | 8 | Optimal for 60-second swipe sessions |
| Cards per deck (Solo) | 5 | Faster solo sessions with curated mood decks |
| Swipe threshold (drag) | 80px | Balance between accidental and intentional |
| Super Crave threshold (up) | 80px (with |Δy| > |Δx|) | Prevents accidental vertical swipes |
| Stamp visibility threshold | 40px (60px for Super) | Early visual feedback before commit |
| Confetti particles (Group) | 60 | Celebratory without lag |
| Confetti particles (Solo) | 40 | Slightly lighter for solo context |
| Tiebreaker sort key | `timeSpent` (ms, descending) | Longer admiration = stronger preference |
| Session handoff | `sessionStorage` | Persists within tab, clears on close |

---

## 8. Technical Architecture

### 8.1 File Structure

```
Pickaroo-Crave-Match/
├── index.html              # Screen 1: Lobby (Group entry point)
├── stylesheet.css           # Global design system + lobby styles
├── script.js                # Lobby logic (feed, invite, navigate)
├── crave_match.html         # Screen 2: Group swipe cards
├── crave_match.css          # Swipe styles (cards, stamps, controls)
├── crave_match.js           # Group swipe logic (gestures, tracking, match, confetti)
├── shared_order.html        # Screen 3: Group hub ordering + payment
├── shared_order.css         # Order styles (split, methods, totals)
├── shared_order.js          # Group order logic (picker, cart, split calc, checkout)
├── single_crave_match.html  # Screen 2S: Solo mood select + swipe
├── single_crave_match.js    # Solo swipe (mood decks, super crave, tiebreaker)
├── single_order.html        # Screen 3S: Solo ordering
├── single_order.js          # Solo order logic (picker, cart, checkout)
├── images/                  # AI-generated food photography + avatars
│   ├── smash_burger.png
│   ├── woodfired_pizza.png
│   ├── sushi_platter.png
│   ├── loaded_tacos.png
│   ├── boba_milktea.png
│   ├── ramen_bowl.png
│   ├── fried_chicken.png
│   ├── desserts_sweets.png
│   ├── avatar_raff.png
│   ├── avatar_maan.png
│   ├── avatar_john.png
│   ├── avatar_default.png
│   └── icons/gcash.png
├── docs/
│   └── DOCUMENTATION.md
└── README.md
```

### 8.2 Design System Tokens

| Token | Value | Usage |
|---|---|---|
| `--turquoise` | `#1DE1CE` | Secondary CTA, success states, hub badges |
| `--cerise` | `#E83683` | Primary CTA, craved dots, payment split "your share" |
| `--honey` | `#FFB347` | Refresh button, warnings, pending badges |
| `--sage` | `#66BB6A` | Paid badges, active pulse dots, success states |
| `--bg` | `#FAF8F5` | Page background (warm off-white) |
| `--card` | `#FFFFFF` | Card surfaces (solid, no blur) |
| `--text-primary` | `#1A1A2E` | Headlines, names, prices |
| `--text-secondary` | `#6B7280` | Descriptions, subtitles |
| `--text-muted` | `#9CA3AF` | Timestamps, inactive pills |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Avatar pop-in, stamp appearance |
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Card transitions, button states |
| `--dur-fast` | `0.2s` | Micro-interactions (button press) |
| `--dur-normal` | `0.35s` | Card swipes, feed transitions |

### 8.3 Animation Catalog

| Animation | Location | Trigger | Duration |
|---|---|---|---|
| `pulse-dot` | Activity feed, swipers badge | Automatic (infinite loop) | 2s |
| `slide-in-feed` | Activity items | New item added | 0.4s |
| `cta-pulse` | "Start Swiping" button | Automatic (until clicked) | 2.5s |
| `shake` | NOPE button | Hover or click | 0.4s |
| `flame-dance` | CRAVE button icon | Automatic (infinite loop) | 1.5s |
| `spin-once` | Refresh button icon | Click | 0.6s |
| `pop-check` | "All Swiped" checkmark | Match found | 0.5s |
| `card-swipe-left/right` | Top card | Swipe commit | 0.4s |
| `item-slide-in` | Order items | DOM insertion | 0.35s |
| `slide-up` | Section cards | Page load (staggered) | 0.3s |
| Confetti physics | Canvas overlay | Match found | ~2s (120 frames) |

---

## 9. Non-Functional Requirements

| Requirement | Target | Current Status |
|---|---|---|
| **Performance** | First Contentful Paint < 1s | ✅ Static HTML, no framework overhead |
| **Bundle Size** | Total JS < 50KB | ✅ ~41KB across 3 files (unminified) |
| **Image Optimization** | Total images < 10MB | ⚠️ 7.0MB total (PNGs; should convert to WebP) |
| **Accessibility** | WCAG 2.1 AA | 🔲 Needs ARIA labels on cards, keyboard navigation |
| **Responsiveness** | 320px–428px viewport | ✅ Fixed 375px phone container (prototype) |
| **Offline Support** | Service worker cache | 🔲 Not implemented |
| **Browser Support** | Chrome, Safari, Edge, Firefox | ✅ Uses standard APIs (Pointer Events, Canvas 2D) |
| **Touch Support** | iOS Safari, Android Chrome | ✅ Pointer Events API works across all |

---

## 10. Risks & Mitigations

### Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Real-time sync latency | Split payments show stale data | High | WebSocket with Redis pub/sub; polling fallback every 3s |
| Concurrent cart modifications | Race condition on checkout | Medium | Optimistic locking; Hunt Master has exclusive lock 5min before deadline |
| Deep link failures (invite) | Users can't join session | Medium | Firebase Dynamic Links + web-based fallback with QR code |
| Image loading on slow networks | Blank cards during swipe | Low | `loading="eager"` on visible cards; WebP conversion; lazy-load deck 2/3 |

### Business Risks

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Discount abuse (large groups) | Margin erosion | Medium | Hard cap at 10%; minimum ₱500 basket for basket discount |
| Split-pay partial failure | Hunt Master stuck with bill | Medium | Pre-authorization hold on all cards before order lock |
| Ally Drop rider detour | Delivery delay > 10 min | Low | 500m radius cap; ₱15 flat fee covers rider time |
| Spam invite links | Bots joining sessions | Low | 2hr link expiry; max 20 members; Hunt Master approval gate |
| Low swipe completion | Users abandon mid-deck | Medium | 8-card decks (60 seconds); refresh button for variety fatigue |

> [!TIP]
> For production deployment, prioritize: WebSocket integration for real-time sync, image optimization (PNG→WebP), and proper authentication/session management via Pickaroo's existing auth layer.

---

*End of Document*
