import { useState, useEffect } from "react";

const AdsList = ({ searchQuery, selectedCategory }) => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/ads`)
      .then((response) => response.json())
      .then((data) => setAds(data))
      .catch((error) => console.error("Ошибка загрузки объявлений:", error));
  }, []);

  // Фильтрация объявлений
  const filteredAds = ads.filter((ad) => {
    return (
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "All" || ad.category === selectedCategory)
    );
  });

  return (
    <div className="ads-list">
      {filteredAds.length === 0 ? <p>Объявлений пока нет.</p> : null}
      {filteredAds.map((ad) => (
        <div key={ad.id} className="ad-card">
          {ad.image && <img src={ad.image} alt={ad.title} />}
          <h3>{ad.title}</h3>
          <p>{ad.description}</p>
          <p><strong>Категория:</strong> {ad.category}</p>
          <p><strong>Адрес:</strong> {ad.address}</p>
          <p><strong>Контакты:</strong> {ad.contact}</p>
        </div>
      ))}
    </div>
  );
};

export default AdsList;