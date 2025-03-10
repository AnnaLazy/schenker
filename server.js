require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Настройка Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Настройка хранилища в Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "schenker_ads", // Название папки в Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// Подключение к базе данных PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Проверка работы сервера
app.get("/", (req, res) => {
  res.send("Сервер работает!");
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

    const result = await pool.query(
      "INSERT INTO ads (title, description, category, address, contact, image, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *",
      [title, description, category, address, contact, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при добавлении объявления:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Маршрут для загрузки изображений в Cloudinary
app.post("/upload", upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Файл не загружен" });
  }

  try {
    const fileUrl = req.file.path; // Cloudinary автоматически даёт ссылку на загруженное изображение
    res.json({ url: fileUrl });
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
    res.status(500).json({ error: "Ошибка при загрузке файла" });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));