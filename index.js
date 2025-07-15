import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const ROBLOSECURITY = process.env.ROBLOSECURITY;

app.post('/check', async (req, res) => {
  const { userId, targetUserId } = req.body;

  if (!userId || !targetUserId) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const response = await fetch(`https://friends.roblox.com/v1/users/${userId}/followings?limit=100`, {
      headers: {
        Cookie: `.ROBLOSECURITY=${ROBLOSECURITY}`
      }
    });

    const data = await response.json();
    const isFollowing = data.data.some(user => user.id == targetUserId);

    res.json({ isFollowing });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on port ${port}`));