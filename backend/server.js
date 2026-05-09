const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- DATABASE ---------------- */

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/* ---------------- HTTP SERVER ---------------- */

const server = http.createServer(app);

/* ---------------- SOCKET.IO ---------------- */

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* ---------------- SOCKET EVENTS ---------------- */

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("chat-message", async (data) => {

    try {

      const { username, text } = data;

      // Save message into PostgreSQL
      await pool.query(
        "INSERT INTO messages(username, text) VALUES($1, $2)",
        [username, text]
      );

      // Broadcast message to ALL users
      io.emit("chat-message", {
        username,
        text,
      });

    } catch (err) {
      console.error("Socket error:", err);
    }

  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

/* ---------------- REST APIs ---------------- */

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/api/messages", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM messages ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).send("Database error");

  }

});

/* ---------------- START SERVER ---------------- */

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});