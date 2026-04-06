# Pickaroo Group Hunt Feature

## Overview
The **Group Hunt** feature transforms the single-user shopping experience into a collaborative, gamified, and socially engaging activity. It allows users to create a shared cart, invite friends via messenger links, and collectively unlock discount tiers (up to 20% off) based on the number of participants.

This simulated prototype demonstrates the UI/UX design and flow of the group creation and sharing process, built using modern web technologies to mimic a native mobile application.

## Design Philosophy
The UI follows a **Spatial OS / Glassmorphism** design language tailored for modern mobile devices:
- **Translucent Layers:** Semi-transparent white backgrounds with heavy backdrop blurs (`backdrop-filter`) simulate frosted glass floating above a vibrant gradient background.
- **Clean Typography:** Utilizes the crisp **Inter** font family for high legibility.
- **Physical Device Framing:** The application is framed within a mobile container featuring a thick bezel, status bar (time/battery/signal), and a native-style swipe indicator at the bottom.
- **Micro-interactions:** Smooth CSS transitions for button presses and pop-in animations for joining members.

## Key Features Demonstrated

### 1. Gamified Discount Progression ("Pack & Share")
- A visual progress bar tracks how many "Hunters" (friends) have joined the group.
- The interface updates dynamically, highlighting milestones (e.g., 7 hunters = 15% off, 15+ hunters = 20% off) as users simulate joining.

### 2. Group Settings Management
Users can configure their Hunt before sharing:
- **Payment Harmony:** Options for split-payment.
- **Deadlines:** Setting a time limit for friends to add items.
- **Hunt Naming:** Customizing the group name for a personal touch (e.g., "Megamall Munchies!").

### 3. Share & Invite Loop (Simulated)
- Tapping the **Share Icon** (`fa-share-nodes`) triggers a simulated clipboard copy event, alerting the user to paste the link into their messenger groups.
- Visual feedback is provided by temporarily changing the share icon to a checkmark.
- 1.5 seconds later, the prototype automatically simulates a friend clicking the link and joining the group. A new colorful avatar "pops" into the row, and the discount progress bar advances.

### 4. Interactive Chat Teaser
- Built-in UI snippet showing recent activity/chat from group members ("Adding drinks now!").

## How to View and Test

Since this is a static prototype built for a proposal:
1. Open `index.html` in any modern web browser (Chrome, Edge, Safari, Firefox).
2. To experience the share flow:
   - Scroll down to the **Hunt Masters** section.
   - Click the glass **Share button** (the right-most circle with the connection icon).
   - Read the prompt simulating link copying.
   - Wait 1.5 seconds to see a new friend automatically join and watch the progress bar highlight.
3. Scroll through the app to see the native-feeling custom scrollbar and the sticky footer.
4. Click the **"Initiate Group Hunt"** button to view the network loading simulation.

## Risks, Constraints & Mitigations

When transitioning this feature from a prototype to a fully functional application, several business and technical constraints must be considered. Below are the constraints alongside proposed **mitigation strategies**.

### Technical Risks
- **Real-Time Synchronization:** Managing a shared cart across multiple devices requires robust, low-latency WebSocket connections to ensure inventory and cart states don't conflict. 
  - **Mitigation:** Implement operational queues using Redis or simple polling for fallback. Lock specific items to single users while they are editing quantities.
- **Deep Linking & Onboarding:** The "Invite via Link" flow requires reliable deep-link infrastructure. Users who don't have the app installed need a seamless fallback.
  - **Mitigation:** Use universal links (Firebase Dynamic Links / Branch.io) pointing to a web-based "Guest Cart" where users can add items without an account before downloading the app for checkout.
- **Race Conditions on Checkout:** If multiple users try to modify quantities as the deadline approaches, the backend must prevent duplicate charges.
  - **Mitigation:** The "Hunt Master" (creator) has exclusive checkout power. The cart enters a "locked" state 5 minutes before the deadline.

### Business & Operational Constraints
- **Margin Erosion Simulation:** Gamifying discounts (up to 20%) requires strict unit economics so the business doesn't lose margin.
  - **Mitigation:** Cap the max discount amount (e.g., "20% off, up to $15"). Ensure discounts only apply if total cart value exceeds a specific threshold, not just a member count threshold.
- **Logistics & Delivery Complexity:** If users expect "split delivery" from a single group order, logistics costs spike.
  - **Mitigation:** Enforce a single drop-off point policy ("Hunt Master's location"). Friends must coordinate the physical hand-off themselves.
- **Payment & Split-Bill Failures:** If using "Split-Pay," what happens if one member's card declines at the deadline?
  - **Mitigation:** Place a pre-authorization hold on each user's card when they confirm their portion. If a card fails, prompt the Hunt Master to cover the remainder or drop the item.
- **Troll/Spam Invites:** Public group links could be shared on large forums.
  - **Mitigation:** Link expires in 2 hours, and a max cap of 20 members per Hunt is strictly enforced. The Hunt Master must manually approve members.

## File Structure
- `index.html` — The main structure and the static JavaScript interactivity.
- `stylesheet.css` — All layout, glassmorphism aesthetics, mobile framing, and animations.