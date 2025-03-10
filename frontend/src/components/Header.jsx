import React from "react";
import "./Header.css";

const Header = ({ onAuthClick, user, onLogout, onAddAd, onMyAds }) => {
  return (
    <header className="header">
      <div className="logo">Schenker Club</div>
      <div className="header-buttons">
        {user ? (
          <>
            <span>Привет, {user?.name || "Пользователь"}</span>
            <button className="my-ads-btn" onClick={onMyAds}>Мои объявления</button>
            <button className="add-btn" onClick={onAddAd}>+ Добавить объявление</button>
            <button className="logout-btn" onClick={onLogout}>Выйти</button>
          </>
        ) : (
          <button className="auth-btn" onClick={onAuthClick}>Войти / Регистрация</button>
        )}
      </div>
    </header>
  );
};

export default Header;