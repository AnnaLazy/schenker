import { useState } from "react";
import AdsList from "./components/AdsList";
import AddAdForm from "./components/AddAdForm";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="app">
      <header>
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="All">Все категории</option>
          <option value="Cosmetic">Cosmetic</option>
          <option value="Clothes">Clothes</option>
          <option value="Furniture">Furniture</option>
          <option value="Kid stuff">Kid stuff</option>
          <option value="Electric">Electric</option>
        </select>
      </header>

      <AddAdForm onAdAdded={(ad) => console.log("Объявление добавлено:", ad)} />
      <AdsList searchQuery={searchQuery} selectedCategory={selectedCategory} />
    </div>
  );
}

export default App;