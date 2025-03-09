require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

// 📌 Новый маршрут для получения всех объявлений
app.get("/ads", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ads");
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении объявлений:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));