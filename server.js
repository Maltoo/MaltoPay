import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Endpoint untuk cek username Roblox
app.get("/api/cek", async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: "Username diperlukan." });

  try {
    const userRes = await axios.get(`https://users.roblox.com/v1/users/by-username/${encodeURIComponent(username)}`);
    const user = userRes.data;
    const avatarRes = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=420x420&format=Png&isCircular=false`);
    const avatar = avatarRes.data.data[0].imageUrl;

    res.json({
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      created: user.created,
      avatarUrl: avatar,
      profileUrl: `https://www.roblox.com/users/${user.id}/profile`
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Gagal mengambil data dari Roblox." });
  }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));