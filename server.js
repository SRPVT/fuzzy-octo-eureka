const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

// Railway port fix
const PORT = process.env.PORT || 8080;

// ---------------------------------
// ENV VARIABLES
// ---------------------------------
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// Check required OAuth vars
if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_REDIRECT_URI) {
  console.error("❌ Missing OAuth environment variables!");
  process.exit(1);
}

// ---------------------------------
// STATIC FILE HANDLING (FLATTENED)
// ---------------------------------

// Serve ALL files from project root
app.use(express.static(path.join(__dirname)));

// Serve flattened asset files like assets__xyz.css → /assets/xyz.css
app.get("/assets/:file", (req, res) => {
  res.sendFile(path.join(__dirname, `assets__${req.params.file}`));
});

// Serve attached assets
app.get("/attached_assets/:file", (req, res) => {
  res.sendFile(path.join(__dirname, `attached_assets__${req.params.file}`));
});

// ---------------------------------
// MAIN PAGE
// ---------------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ---------------------------------
// DISCORD LOGIN
// ---------------------------------
app.get("/api/discord-login", (req, res) => {
  const state = req.query.state || "xd";

  const url =
    `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}` +
    `&response_type=code&scope=identify%20guilds%20bot&state=${state}`;

  res.redirect(url);
});

// ---------------------------------
// OAUTH CALLBACK
// ---------------------------------
app.get("/auth/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) return res.send("OAuth error: " + error);
  if (!code) return res.send("No OAuth code provided");

  try {
    // Exchange code for token
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

    // Get Discord user
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

// ---------------------------------
// BOT STATUS API (REAL WORKING VERSION)
// ---------------------------------
app.get("/api/bot-status", async (req, res) => {
  const botToken = DISCORD_BOT_TOKEN;

  if (!botToken) {
    return res.json({
      status: "unknown",
      message: "Bot token not configured",
    });
  }

  try {
    const response = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bot ${botToken}` },
    });

    if (response.status === 401) {
      return res.json({
        status: "offline",
        message: "Invalid token",
      });
    }

    if (!response.ok) {
      return res.json({
        status: "offline",
        message: "Bot is offline",
      });
    }

    const botData = await response.json();

    return res.json({
      status: "online",
      username: botData.username,
      id: botData.id,
    });

  } catch (error) {
    return res.json({
      status: "offline",
      message: "Error checking bot status",
      error: error.message,
    });
  }
});

// ---------------------------------
// START SERVER
// ---------------------------------
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
