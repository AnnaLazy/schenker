import { useState } from "react";

const AuthForm = ({ onLoginSuccess, closeModal }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const url = isRegister ? "/register" : "/login";
    const body = isRegister ? { name, email, password } : { email, password };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Ошибка входа/регистрации");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLoginSuccess(data.user);
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>{isRegister ? "Регистрация" : "Вход"}</h2>
        {isRegister && <input type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} required />}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">{isRegister ? "Зарегистрироваться" : "Войти"}</button>
        <p onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;