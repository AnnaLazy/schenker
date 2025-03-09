import React, { useState, useEffect } from "react";
import AdsList from "./components/AdsList";
import AddAdForm from "./components/AddAdForm";
import AuthForm from "./components/AuthForm";
import "./App.css";

function App() {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAdModalOpen, setAdModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="container">
      <header>
        <h1>Schenker Club</h1>
        <div className="header-buttons">
          {user ? (
            <>
              <span>Привет, {user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <button className="auth-btn" onClick={() => setAuthModalOpen(true)}>Войти / Регистрация</button>
          )}
          {user && <button className="add-btn" onClick={() => setAdModalOpen(true)}>+ Добавить объявление</button>}
        </div>
      </header>

      <main>
        <div className="search-bar">
          <input type="text" placeholder="Поиск..." />
          <button>🔍</button>
        </div>
        <AdsList />  {/* Обязательно должен быть здесь! */}
      </main>

      {isAuthModalOpen && <AuthForm onClose={() => setAuthModalOpen(false)} onLogin={handleLogin} />}
      {isAdModalOpen && <AddAdForm onClose={() => setAdModalOpen(false)} />}
    </div>
  );
}

export default App;