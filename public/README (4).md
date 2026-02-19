# Digital State — World Domination Simulator

> *A multiplayer geopolitical strategy game where you build an empire through espionage, economics, and influence — not just war.*

---

## What Is This

Digital State is a browser-based multiplayer game where each player takes the role of a national president in a living geopolitical world. You recruit agents, build influence networks, form alliances, declare wars, and navigate epoch-level global crises — all in real time with other players.

The core philosophy: **domination through systems, not clicks.** Every action — deploying a spy, launching propaganda, applying economic pressure — is a thread in a web. When enough threads connect, countries fall into your sphere of influence. It feels like hunting, not attacking.

---

## File Overview

```
public/
  landing.html       — Login page (username-only auth, saves to localStorage)
  game.html          — Main game interface
  
  (Next.js globe app lives at the root — game.html loads it via iframe)
```

---

## How It Works — Frontend

### 1. Auth Flow

`landing.html` collects a username (no password in alpha). It:
- Validates the callsign (letters, numbers, `_` and `-` only, min 3 chars)
- Stores `digital_state_username` in `localStorage`
- Redirects to `game.html`

`game.html` on load checks `localStorage.digital_state_username`. If missing → redirect back to `landing.html`. This is the **only auth gate** until you wire JWT from the backend.

**When backend is ready:** replace the localStorage check with a JWT validation call to `GET /api/auth/me`. If 401 → redirect to landing.

---

### 2. President Creation Screen

First screen in `game.html` (CSS class `#s-create`). Lets the player configure:

- **Name + Codename** — purely cosmetic, stored in `GS.president`
- **Nation** — 8 options with different starting bonuses (military, economic, etc.)
- **Background** — 6 archetypes that modify starting stats (Military, Business, Intelligence, etc.)
- **Traits** — up to 2 from 8 options (Charismatic, Ruthless, Economist, Spymaster, etc.)
- **Ideology sliders** — Liberal↔Conservative, Globalist↔Nationalist, Diplomat↔Hawk (cosmetic in alpha, should affect AI behavior in full version)

On "Enter State" → calls `launchGame()` which switches to `#s-game` and calls `initGame()`.

---

### 3. Globe (iframe)

The 3D globe is the existing Next.js/Three.js app (`webgl-digital-globe`). It runs at `localhost:3000/` and is embedded into `game.html` via:

```html
<iframe id="globe-iframe" src="/" scrolling="no" onload="iframeLoaded()"></iframe>
```

On iframe load, `iframeLoaded()` injects CSS into the iframe document to hide the Next.js settings panel (`aside`) — leaving only the clean rotating globe.

The globe area (`#globe-area`) has `margin-right: 360px` when the side panel is open. When the panel closes, `margin-right` transitions to `0`. This is how the globe expands/contracts without a white gap — no `width` changes, only `margin`.

**For backend integration:** country markers on the globe (dots + rings) will need to reflect real-time influence data. The easiest approach is `postMessage` from the parent window into the iframe, or rebuild markers inside the game page using a separate Three.js canvas overlay.

---

### 4. Game State Object (`GS`)

All game state lives in a single JS object:

```js
GS = {
  username, influence, capital, nationsOwned, softPower,
  military, economic, narrative, espionage,
  epoch, frame,
  president: { name, codename, avatar, nation, bg, traits },
  cabinet: [...],   // 5 preset ministers, permanent
  agents: [...],    // player-created field agents
  countries: [...], // 14 world nations with influence/stability/status
  wars: [],
  alliances: [],
}
```

**Backend:** serialize this entire object and store as JSONB in `game_states`. Auto-save every 60 seconds via `POST /api/game/save`.

---

### 5. Side Panel — 4 Tabs

| Tab | Contents |
|-----|----------|
| **Ops** | Target country actions (spy, propaganda, economic pressure, military threat, alliance, war declaration) + global actions |
| **Power** | 5 influence bars (military/economic/narrative/espionage/soft power), allied nations list, active wars |
| **Agents** | Cabinet ministers + field agents, recruit button, assign mission button per agent |
| **World** | Live players list, global event feed, command hierarchy tree |

---

### 6. Agent System

**Cabinet** (5 preset ministers):
- Permanent, non-deployable
- Have loyalty states: `loyal` / `neutral` / `suspicious`
- Show live "inner monologue" thought which rotates every ~8 seconds of game time
- Loyalty drifts randomly over time — this is the shadow government mechanic

**Field Agents** (player-created):
- Created via "Recruit Agent" modal (costs 200 💰)
- Each has: name, codename, specialty (Spy/Propagandist/Economist/Military Advisor/Cyber/Diplomat), avatar, auto-generated biography with a vulnerability
- Can be sent on missions

**Missions** (6 types):

| Mission | Risk | Days | Effect |
|---------|------|------|--------|
| Infiltrate Government | High | 14 | +15 influence on target |
| Propaganda Campaign | Med | 7 | Shift narrative |
| Economic Sabotage | High | 10 | Crash target supply chain |
| Intel Gathering | Low | 5 | Map enemy agents |
| Secret Diplomacy | Low | 8 | Broker alliance |
| Eliminate Asset | High | 3 | Remove enemy agent |

Currently mission resolution is simulated client-side with `setTimeout`. **Backend must take over:** store missions in DB, run resolution server-side in the epoch cron job, emit results via Socket.io.

---

### 7. Hierarchy View

Located in the **World** tab. Renders a visual tree:

```
[President]
    │
[Cabinet x5]  ← loyalty color-coded
    │
[Field Agents] ← show mission status
    │
[Allied Nations]
```

Rebuilds on: agent recruited, alliance formed, loyalty changes.

---

### 8. Multiplayer (UI-Ready, Backend Needed)

**World tab → Live Players** shows a mock list of 5 players with ALLY / WAR buttons. These currently call placeholder functions `proposeAlly()` and `proposeWar()` that only add a local event log entry.

**Backend replaces this with Socket.io:**

```js
// Frontend side (add to game.html after backend connects):
const socket = io('wss://api.digitalstate.gg', {
  auth: { token: localStorage.getItem('digital_state_token') }
});

socket.on('world:players', (players) => {
  GS.mockPlayers = players;
  renderPlayers();
});

socket.on('war:declared', ({ from, to }) => {
  addEvt(`⚔ ${from} declares war on ${to}!`, 'red');
});

socket.on('alliance:request', ({ fromName }) => {
  showToast(`${fromName} proposes an alliance`);
});
```

Full event list is in `BACKEND_SPEC.md`.

---

### 9. Epoch & Crisis System

Game time runs in epochs. Client-side: `epochTimer` increments every 33ms (~30fps). Every 600 ticks = 1 epoch.

Per epoch:
- Passive income: `50 + (nationsOwned × 25) + floor(economic/8)` capital
- Agent thought rotation
- Loyalty drift on all agents
- 40% chance of global crisis

**Crises** appear as a top banner. Player chooses Respond or Ignore. Each has different effects (military boost, capital loss, soft power gain, etc.).

**Backend must sync epochs** across all players using a server-side cron job (every 5 min real time = 1 epoch). See `BACKEND_SPEC.md` for the pseudo-code.

---

## What the Backend Developer Needs to Build

See `BACKEND_SPEC.md` for complete spec. Summary:

- [ ] Node.js + Express server
- [ ] PostgreSQL with schema from the spec
- [ ] Redis for live player state
- [ ] Socket.io for all real-time events
- [ ] JWT auth (POST /api/auth/login)
- [ ] Game state save/load endpoints
- [ ] Epoch cron job (server-side tick)
- [ ] Mission resolution logic
- [ ] War resolution (compare military scores + random)
- [ ] Alliance management
- [ ] Agent loyalty drift (server-side, hidden from player)

---

## How to Run (Development)

```bash
# 1. Install dependencies for the globe (Next.js)
git clone https://github.com/e-Nicko/webgl-digital-globe
cd webgl-digital-globe
npm install

# 2. Copy textures if not already there
cp -r models/earth public/models/earth

# 3. Copy the game files
cp landing.html game.html public/

# 4. Start the dev server
npm run dev

# 5. Open
# Landing: http://localhost:3000/landing.html
# Game:    http://localhost:3000/game.html (redirects from landing after login)
```

---

## Design Decisions Worth Noting

**Fonts:** Cinzel (titles, buttons) + Share Tech Mono (labels, stats, monospace data) + Rajdhani (body copy). These three are intentional — Cinzel gives imperial weight, Share Tech Mono gives military-intelligence aesthetic, Rajdhani reads cleanly at small sizes.

**Color system:** Single gold (`#b8963e`) as the primary accent. Red for hostile/war, green for allied/success, blue for intel/cyber. Dark background (`#04060c`) with subtle grid overlay. No purple gradients, no glow abuse.

**Panel toggle:** The globe `#globe-area` uses CSS `margin-right` transition (not width) to avoid layout reflow. The toggle button tracks with `right` CSS transition synced to the same `cubic-bezier`. Toast notification follows the same offset.

**iframe globe:** The `<iframe src="/">` embeds the Next.js globe. CSS is injected post-load to hide the Next.js settings panel. The iframe width is `calc(100% + 360px)` to push the Next.js panel off-screen to the right — only the globe renders in view.

---

## Contact & Handoff

Send the backend developer:
1. `landing.html`
2. `game.html`
3. `BACKEND_SPEC.md` ← full API + DB + Socket.io spec
4. This `README.md`

The frontend is complete and functional as a standalone demo. Everything is wired to receive backend data — just replace mock functions and localStorage auth with real API calls.
