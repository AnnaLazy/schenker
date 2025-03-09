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

app.post("/ads", async (req, res) => {
  try {
    const { title, description, category, address, contacts, image } = req.body;
    const result = await pool.query(
      "INSERT INTO ads (title, description, category, address, contacts, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, description, category, address, contacts, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при добавлении объявления:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

const bcrypt = require("bcryptjs");

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 📌 Хэшируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

const jwt = require("jsonwebtoken");

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 📌 Ищем пользователя по email
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Неверные данные" });
    }

    // 📌 Сравниваем введённый пароль с хэшированным паролем из базы
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ error: "Неверные данные" });
    }

    // 📌 Создаём JWT-токен
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (error) {
    console.error("Ошибка входа:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Нет токена" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Неверный токен" });
  }
};

// 📌 Меняем `POST /ads`, добавляя `verifyToken`
app.post("/ads", verifyToken, async (req, res) => {
  try {
    const { title, description, category, address, contacts, image } = req.body;
    const result = await pool.query(
      "INSERT INTO ads (title, description, category, address, contacts, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, description, category, address, contacts, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при добавлении объявления:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.delete("/ads/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM ads WHERE id = $1", [id]);
    res.json({ message: "Объявление удалено" });
  } catch (error) {
    console.error("Ошибка удаления объявления:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.get("/ads", async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = "SELECT * FROM ads WHERE 1=1";
    let params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при фильтрации объявлений:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});



const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));