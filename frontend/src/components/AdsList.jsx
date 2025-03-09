import React, { useEffect, useState } from "react";

const AdsList = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch("https://schenker-production.up.railway.app/ads") // Замени на актуальный URL
      .then((res) => res.json())
      .then((data) => {
        console.log("Данные с сервера:", data); // Проверяем, приходят ли данные
        setAds(Array.isArray(data) ? data : []); // Проверяем, массив ли это
      })
      .catch((err) => console.error("Ошибка загрузки объявлений:", err));
  }, []);

  return (
    <div className="ads-container">
      {ads.length === 0 ? (
        <p>Объявлений пока нет.</p>
      ) : (
        ads.map((ad) => (
          <div key={ad.id} className="ad-card">
            <h3>{ad.title}</h3>
            <p>{ad.description}</p>
            <p><b>Категория:</b> {ad.category}</p>
            <p><b>Адрес:</b> {ad.address}</p>
            <p><b>Контакты:</b> {ad.contacts}</p>
            {ad.image && <img src={ad.image} alt={ad.title} width="200" />}
          </div>
        ))
      )}
    </div>
  );
};

export default AdsList;