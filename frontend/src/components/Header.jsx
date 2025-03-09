import React from "react";
import "./Header.css";

const Header = ({ onAuthClick, user, onLogout, onAddAd }) => {
  return (
    <header className="header">
      <div className="logo">Schenker Club</div>
      <div className="header-buttons">
        {user ? (
          <>
            <span>Привет, {user.name}</span>
            <button className="logout-btn" onClick={onLogout}>Выйти</button>
            <button className="add-btn" onClick={onAddAd}>+ Добавить объявление</button>
          </>
        ) : (
          <button className="auth-btn" onClick={onAuthClick}>Войти / Регистрация</button>
        )}
      </div>
    </header>
  );
};

export default Header;