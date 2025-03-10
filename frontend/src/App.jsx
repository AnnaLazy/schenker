import React, { useState, useEffect } from "react";
import AdsList from "./components/AdsList";
import AddAdForm from "./components/AddAdForm";
import AuthForm from "./components/AuthForm";
import Header from "./components/Header"; // Используем Header
import SearchBar from "./components/SearchBar"; // Используем SearchBar
import "./App.css";

function App() {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAdModalOpen, setAdModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Храним поисковый запрос
  const [refresh, setRefresh] = useState(false); // Флаг для обновления объявлений

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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAdAdded = () => {
    setAdModalOpen(false);
    setRefresh((prev) => !prev); // Триггерим обновление списка
  };

  return (
    <div className="container">
      <Header 
        user={user} 
        onAuthClick={() => setAuthModalOpen(true)} 
        onLogout={handleLogout} 
        onAddAd={() => setAdModalOpen(true)} 
      />

      <main>
        <SearchBar onSearch={handleSearch} />
        <AdsList searchQuery={searchQuery} refresh={refresh} /> {/* Передаём поиск и обновление */}
      </main>

      {isAuthModalOpen && <AuthForm onClose={() => setAuthModalOpen(false)} onLogin={handleLogin} />}
      {isAdModalOpen && <AddAdForm onClose={() => setAdModalOpen(false)} onAdAdded={handleAdAdded} />}
    </div>
  );
}

export default App;