import React, { useState } from "react";
import "./AuthForm.css";

function AuthForm({ onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister && !formData.name) {
      alert("Введите имя!");
      return;
    }
    onLogin({ name: formData.name, email: formData.email });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>{isRegister ? "Регистрация" : "Вход"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input type="text" placeholder="Имя" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          )}
          <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" placeholder="Пароль" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <button type="submit">{isRegister ? "Зарегистрироваться" : "Войти"}</button>
        </form>
        <p onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Регистрация"}
        </p>
      </div>
    </div>
  );
}

export default AuthForm;