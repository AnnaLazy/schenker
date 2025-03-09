import React, { useState, useEffect } from "react";
import AdsList from "./components/AdsList";
import AddAdForm from "./components/AddAdForm";
import AuthForm from "./components/AuthForm";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAdModalOpen, setAdModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      {/* Шапка с логотипом и кнопками */}
      <Header onAuthClick={() => setAuthModalOpen(true)} user={user} onLogout={handleLogout} onAddAd={() => setAdModalOpen(true)} />

      {/* Поле поиска */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Список объявлений */}
      <AdsList searchQuery={searchQuery} />

      {/* Модальные окна */}
      {isAuthModalOpen && <AuthForm onClose={() => setAuthModalOpen(false)} onLogin={handleLogin} />}
      {isAdModalOpen && <AddAdForm onClose={() => setAdModalOpen(false)} />}
    </div>
  );
}

export default App;