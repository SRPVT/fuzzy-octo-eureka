const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

// ✅ Railway Port Fix
const PORT = process.env.PORT || 8080;

// Get env vars
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

// Required
if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI) {
  console.error("❌ Missing environment variables!");
  process.exit(1);
}

// ----------------------------
// STATIC FILES (FLATTENED FIX)
// ----------------------------

// Serve all files in the root directory
app.use(express.static(__dirname));

// Fix broken asset paths (since assets were flattened)
app.get("/assets/:file", (req, res) => {
  res.sendFile(path.join(__dirname, `assets__${req.params.file}`));
});

app.get("/attached_assets/:file", (req, res) => {
  res.sendFile(path.join(__dirname, `attached_assets__${req.params.file}`));
});

// ----------------------------
// SEND INDEX.HTML
// ----------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ----------------------------
// DISCORD LOGIN
// ----------------------------
app.get("/api/discord-login", (req, res) => {
  const state = req.query.state || "xd";

  const url =
    `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}` +
    `&response_type=code&scope=identify%20guilds%20bot&state=${state}`;

  res.redirect(url);
});

// ----------------------------
// CALLBACK
// ----------------------------
app.get("/auth/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) return res.send("OAuth error: " + error);
  if (!code) return res.send("No OAuth code provided");

  try {
    const tokenRes = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    const token = await tokenRes.json();
    if (!token.access_token) return res.send("Token exchange failed");

    const userRes = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const user = await userRes.json();

    res.send(`
      <script>
        localStorage.setItem('discord_user_token', '${token.access_token}');
        localStorage.setItem('discord_authenticated', 'true');
        localStorage.setItem('discord_user_data', JSON.stringify(${JSON.stringify(
          user
        )}));
        window.location.href = '/';
      </script>
    `);
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// ----------------------------
// SIMPLE BOT STATUS ENDPOINT
// ----------------------------
app.get("/api/bot-status", (req, res) => {
  res.json({ status: "unknown" });
});

// ----------------------------
// START SERVER
// ----------------------------
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
