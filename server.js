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

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));