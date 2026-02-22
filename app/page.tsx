"use client";

import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  async function doLogin() {
    const val = username.trim();

    if (!val) {
      setError("Callsign required.");
      return;
    }
    if (val.length < 3) {
      setError("Minimum 3 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(val)) {
      setError("Letters, numbers, _ and - only.");
      return;
    }

    setError("");

    try {
      const res = await fetch(
        "https://digitalstate-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: val }),
        }
      );

      const data = await res.json();

      if (!data.token) {
        setError("Login failed.");
        return;
      }

      localStorage.setItem("digital_state_token", data.token);
      localStorage.setItem("digital_state_username", val);

      window.location.href = "/game.html";
    } catch {
      setError("Server connection failed.");
    }
  }

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#c8c2b4",
        fontFamily: "Rajdhani, sans-serif",
      }}
    >
      <div className="badge">2047 · Multiplayer World Domination</div>

      <div className="title-wrap">
        <div className="title-main">
          Digital <span className="arena">State</span>
        </div>
        <div className="tagline">
          Every empire begins with a single <em>decision.</em>
          <br />
          Make yours count — the world is watching.
        </div>
      </div>

      <div className="divider" />

      <div className="login-box">
        <label className="lbl">Commander Username</label>

        <input
          className="login-input"
          type="text"
          placeholder="enter your callsign"
          maxLength={24}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doLogin()}
        />

        <div className="login-error">{error}</div>

        <button className="login-btn" onClick={doLogin}>
          <span>Enter the State</span>
        </button>

        <div className="login-hint">
          No account needed —{" "}
          <a
            style={{ cursor: "pointer" }}
            onClick={doLogin}
          >
            your callsign is your identity
          </a>
        </div>
      </div>

      <div className="bottom-row">
        <div className="bottom-card">
          <span className="ca-badge">CA</span>
          <span>Contract: Coming Soon</span>
          <button className="copy-btn">COPY</button>
        </div>

        <a
          className="bottom-card clickable"
          href="https://x.com/DigitalStateGame"
          target="_blank"
        >
          Follow @DigitalStateGame
        </a>
      </div>

      <div className="version">BUILD 0.1.0 · ALPHA</div>
    </div>
  );
}