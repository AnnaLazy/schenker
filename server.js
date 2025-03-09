require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Подключаем базу данных
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 🔹 Настройки Cloudinary (API-ключи из `.env`)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Настройки Multer для Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "schenker-ads",
    format: async (req, file) => "jpeg", // Все изображения сохраняем как JPEG
    transformation: [{ width: 800, height: 600, crop: "limit" }], // Сжимаем перед загрузкой
  },
});

const upload = multer({ storage });

// 🔹 Проверка JWT-токена
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Нет доступа" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Недействительный токен" });
    req.user = user;
    next();
  });
};

// 🔹 Добавление объявления (Загрузка изображения в Cloudinary)
app.post("/ads", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, address, contacts } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (!title || !category) {
      return res.status(400).json({ error: "Название и категория обязательны" });
    }

    const newAd = await pool.query(
      "INSERT INTO ads (title, description, category, address, contacts, image, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, description, category, address, contacts, imageUrl, req.user.userId]
    );

    res.status(201).json(newAd.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 🔹 Запуск сервера
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));