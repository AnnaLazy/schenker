import React, { useState, useCallback } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  // Debounce для уменьшения количества запросов
  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  // Отправка запроса при клике или нажатии Enter
  const handleSearch = useCallback(() => {
    if (query.trim() !== "") {
      onSearch(query);
    }
  }, [query, onSearch]);

  // Обновление состояния с задержкой
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Запуск поиска при нажатии Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Запуск debounce при вводе текста
  const debouncedSearch = useCallback(debounce(onSearch, 500), []);

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-bar"
        placeholder="Поиск..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button className="search-button" onClick={handleSearch}>
        🔍
      </button>
    </div>
  );
};

export default SearchBar;