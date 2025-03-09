import { useState } from "react";
import { API_URL } from "../config";

const AuthForm = ({ type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      alert(`${type === "register" ? "Регистрация" : "Вход"} успешен!`);
    } else {
      alert("Ошибка: " + data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{type === "register" ? "Регистрация" : "Вход"}</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">{type === "register" ? "Зарегистрироваться" : "Войти"}</button>
    </form>
  );
};

export default AuthForm;