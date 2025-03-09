require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { Pool } = require("pg");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Увеличиваем лимит на JSON (изображения могут быть большими)
app.use(fileUpload()); // Подключаем middleware для загрузки файлов

app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

// Подключение к базе данных
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Получение всех объявлений
app.get("/ads", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ads ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении объявлений:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Добавление объявления
app.post("/ads", async (req, res) => {
  try {
    const { title, description, category, address, contact, image } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: "Заполните все обязательные поля" });
    }

    // Сохраняем объявление в базе
    const result = await pool.query(
      "INSERT INTO ads (title, description, category, address, contact, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, description, category, address, contact, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при добавлении объявления:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.post("/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Файл не загружен" });
  }
  const fileUrl = `https://schenker-production.up.railway.app/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Запуск сервера
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));