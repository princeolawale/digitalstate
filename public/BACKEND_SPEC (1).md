# AI ARENA — Backend Specification
## For Backend Developer

---

## Stack Recommendation
- **Runtime**: Node.js + Express (or Fastify)
- **Realtime**: Socket.io (WebSocket)
- **Database**: PostgreSQL (main) + Redis (sessions & realtime state)
- **Auth**: JWT tokens stored in localStorage (username-only, no password — or add bcrypt later)
- **Deployment**: Railway / Render / Fly.io

---

## File Structure (what frontend sends you)

```
public/
  landing.html   ← Login page (username only)
  game.html      ← Main game
  game.html loads iframe src="/"  ← that's the Next.js globe
```

---

## AUTH SYSTEM

### POST /api/auth/login
```json
Request:  { "username": "StarikVlad" }
Response: { "token": "jwt...", "user": { "id": "uuid", "username": "StarikVlad", "createdAt": "..." } }
```
- Username = identity. No password needed for alpha.
- Store in DB: `users(id, username, created_at, last_login)`
- Return JWT. Frontend stores in `localStorage.ai_arena_token`

### GET /api/auth/me
```json
Headers: Authorization: Bearer <token>
Response: { "user": {...}, "gameState": {...} }
```
Returns saved game state if exists.

---

## GAME STATE PERSISTENCE

### POST /api/game/save
```json
Headers: Authorization: Bearer <token>
Body: {
  "influence": 142,
  "capital": 3400,
  "nationsOwned": 4,
  "softPower": 67,
  "military": 72,
  "economic": 81,
  "narrative": 45,
  "espionage": 38,
  "epoch": 2,
  "president": {
    "name": "Viktor Blackwood",
    "codename": "THE ARCHITECT",
    "avatar": "🤴",
    "nationId": "us",
    "bg": "mil",
    "traits": ["char", "strat"]
  },
  "agents": [...],
  "countries": [...],
  "wars": [...],
  "alliances": [...]
}
```
- Auto-save every 60 seconds from frontend
- DB table: `game_states(id, user_id, state JSON, updated_at)`

### GET /api/game/load
Returns full game state for authenticated user.

---

## MULTIPLAYER — SOCKET.IO EVENTS

### Connection
```js
// Frontend connects with JWT
const socket = io('wss://your-api.com', {
  auth: { token: localStorage.getItem('ai_arena_token') }
});
```

### Events: Frontend → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `player:join` | `{ username, nation, president }` | Player enters world |
| `action:declare_war` | `{ targetPlayerId, targetNation }` | Declare war on another player |
| `action:propose_alliance` | `{ targetPlayerId }` | Send alliance request |
| `action:accept_alliance` | `{ fromPlayerId }` | Accept alliance |
| `action:reject_alliance` | `{ fromPlayerId }` | Reject alliance |
| `action:deploy_agent` | `{ targetNation, missionType, agentId }` | Deploy agent to nation |
| `chat:government` | `{ message }` | Global government chat |
| `player:save_state` | `{ gameState }` | Save game state |

### Events: Server → Frontend

| Event | Payload | Description |
|-------|---------|-------------|
| `world:players` | `[{ id, username, nation, status, influence }]` | Live player list |
| `world:event` | `{ text, type, timestamp }` | Global event feed |
| `war:declared` | `{ from, to, nation }` | War notification |
| `alliance:request` | `{ fromId, fromName }` | Alliance invite received |
| `alliance:accepted` | `{ byId, byName }` | Alliance confirmed |
| `agent:mission_result` | `{ agentId, success, outcome }` | Mission result |
| `crisis:global` | `{ text, type, choices }` | Epoch crisis (all players see this) |
| `epoch:advance` | `{ epoch, name }` | New epoch begins |

---

## DATABASE SCHEMA

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(24) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Game states
CREATE TABLE game_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  state JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Wars (P2P)
CREATE TABLE wars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attacker_id UUID REFERENCES users(id),
  defender_id UUID REFERENCES users(id),
  started_epoch INT,
  status VARCHAR(20) DEFAULT 'active', -- active | resolved | stalemate
  created_at TIMESTAMP DEFAULT NOW()
);

-- Alliances (P2P)
CREATE TABLE alliances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_a UUID REFERENCES users(id),
  player_b UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending | active | broken
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agent missions (for server-side resolution)
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  agent_name VARCHAR(64),
  mission_type VARCHAR(64),
  target_nation VARCHAR(64),
  target_player_id UUID REFERENCES users(id), -- if targeting player
  days_remaining INT,
  risk VARCHAR(10),
  status VARCHAR(20) DEFAULT 'active', -- active | success | failed | captured
  created_at TIMESTAMP DEFAULT NOW()
);

-- Global event log
CREATE TABLE world_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT,
  type VARCHAR(20),
  epoch INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## MULTIPLAYER GAME RULES (Server enforced)

### War System
- Player A declares war on Player B → both enter "war" state
- Server runs war resolution every epoch:
  - Compare military scores + random factor
  - Loser loses 1 ally nation, 200 capital
  - War ends after 3 epochs or peace treaty
- **Notify both players via Socket.io**

### Alliance System
- Player A proposes → Server stores `pending`
- Player B accepts → status = `active`
- Alliance bonus: +15% income for both players
- Either can break it; breaking costs 100 softPower

### Agent Infiltration (PvP)
- Player A deploys spy to Player B's nation
- Server runs check: PlayerA.espionage vs PlayerB.espionage × random
- Success: PlayerA gains intel on PlayerB's cabinet loyalties
- Failure: PlayerB gets alert "Foreign agent detected"

### Shadow Government Detection
- If 3+ of a player's cabinet drop to "suspicious" loyalty:
  - Server emits `event:coup_risk` to that player
  - If not addressed in 1 epoch: random agent defects to opposition

---

## EPOCH CRON JOB (Server-side)
Run every 5 minutes (= 1 in-game epoch tick):
```js
// Pseudo-code
async function epochTick() {
  const activePlayers = await getActivePlayers();
  for (const player of activePlayers) {
    // Passive income
    player.capital += 50 + (player.nationsOwned * 25);
    player.influence += player.nationsOwned * 3;
    // Resolve active missions
    await resolveMissions(player);
    // Loyalty drift on agents
    await driftAgentLoyalty(player);
    // Save state
    await saveGameState(player);
    // Emit update
    io.to(player.socketId).emit('state:update', player.gameState);
  }
  // Global epoch event
  if (currentEpoch % 2 === 0) emitGlobalCrisis();
  currentEpoch++;
}
setInterval(epochTick, 5 * 60 * 1000);
```

---

## REDIS USAGE
```
ai_arena:online_players  → Hash { socketId: username }
ai_arena:player:{userId} → Hash { status, nation, influence } (live data)
ai_arena:world_events    → List (last 50 events)
ai_arena:sessions:{token} → String userId (24h TTL)
```

---

## API ENDPOINTS SUMMARY

```
POST   /api/auth/login              Auth
GET    /api/auth/me                 Validate token

POST   /api/game/save               Save state
GET    /api/game/load               Load state

GET    /api/world/players           Online player list
GET    /api/world/events            Global event log (last 50)

POST   /api/war/declare             Declare war { targetPlayerId }
POST   /api/war/peace               Sue for peace { warId }

POST   /api/alliance/propose        { targetPlayerId }
POST   /api/alliance/accept         { allianceId }
POST   /api/alliance/break          { allianceId }

POST   /api/mission/deploy          { agentData, missionType, targetNation, targetPlayerId? }
GET    /api/mission/active          Active missions for user

WebSocket: wss://your-api.com/socket.io
```

---

## CORS
```js
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

---

## ENV VARIABLES
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret-256bit
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
```

---

## WHAT FRONTEND ALREADY DOES (no changes needed)
- ✅ Login via username → saves to localStorage
- ✅ Redirect to game.html if not logged in
- ✅ President creation with all fields
- ✅ Panel toggle (fixed — no white trail)
- ✅ Globe via iframe (Next.js)
- ✅ Agent creation + mission assignment
- ✅ Hierarchy view (President → Cabinet → Agents → Allies)
- ✅ Mock multiplayer players list (replace with Socket.io)
- ✅ Wars / alliances (UI ready, needs Socket.io events)
- ✅ Crisis system
- ✅ Epoch progression
- ✅ Event feed

## WHAT BACKEND NEEDS TO IMPLEMENT
- 🔲 JWT auth
- 🔲 PostgreSQL + Redis
- 🔲 Socket.io server
- 🔲 Epoch cron job
- 🔲 Mission resolution logic
- 🔲 War resolution logic
- 🔲 Alliance management
- 🔲 Agent loyalty drift (server-side)
- 🔲 Game state persistence

---

*Frontend built with: HTML/CSS/JS + Three.js globe (Next.js/React) + iframe integration*
*Contact: share this file + landing.html + game.html*
