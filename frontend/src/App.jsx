import { useState, useEffect } from "react";
import AdsList from "./components/AdsList";
import AddAdForm from "./components/AddAdForm";
import AuthForm from "./components/AuthForm";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="app">
      <header>
        <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="All">Все категории</option>
          <option value="Cosmetic">Cosmetic</option>
          <option value="Clothes">Clothes</option>
          <option value="Furniture">Furniture</option>
          <option value="Kid stuff">Kid stuff</option>
          <option value="Electric">Electric</option>
        </select>
        {user ? (
          <div>
            <span>Вы вошли как {user.name}</span>
            <button onClick={handleLogout}>Выйти</button>
          </div>
        ) : (
          <button onClick={() => setShowAuthModal(true)}>Войти</button>
        )}
      </header>

      {user && <AddAdForm />}
      <AdsList searchQuery={searchQuery} selectedCategory={selectedCategory} />

      {showAuthModal && <AuthForm onLoginSuccess={setUser} closeModal={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default App;