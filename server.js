const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

app.post("/submit-answer", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!process.env.DISCORD_WEBHOOK_URL) {
    return res.status(500).json({ error: "Discord webhook is missing from .env" });
  }

  try {
    const discordResponse = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Love Quiz Reply",
        content: message
      })
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      console.error("Discord error:", discordResponse.status, errorText);
      return res.status(500).json({
        error: `Discord rejected the webhook with status ${discordResponse.status}`
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on http://localhost:3000");
});
