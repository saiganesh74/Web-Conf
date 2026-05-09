const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});