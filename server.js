// ─── Server.js — Hinghoihome Portfolio API Proxy ──────────────────────────────
const express = require("express");
const fetch   = require("node-fetch");
const path    = require("path");

const app  = express();
const PORT = process.env.PORT || 3000;

const API_URL = "https://api-uat.hinghoihome.com/public/api/v1/get-electric-usage";
const API_KEY = process.env.HINGHOI_API_KEY; // ← อ่านจาก Railway Variables

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serve HTML, CSS, JS files

// ─── API Proxy Route ───────────────────────────────────────────────────────────
app.post("/api/meter-usage", async (req, res) => {
  const { meter_mac_address, lower_timestamptz, upper_timestamptz } = req.body;

  // Validation
  if (!meter_mac_address || !lower_timestamptz || !upper_timestamptz) {
    return res.status(400).json({
      code: "missing_fields",
      message: "กรุณาส่ง meter_mac_address, lower_timestamptz, upper_timestamptz"
    });
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY, // ← ใช้จาก process.env
      },
      body: JSON.stringify({
        meter_mac_address,
        lower_timestamptz,
        upper_timestamptz,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.json(data);

  } catch (err) {
    return res.status(500).json({
      code: "server_error",
      message: err.message
    });
  }
});

// ─── Fallback — serve index.html ──────────────────────────────────────────────
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});