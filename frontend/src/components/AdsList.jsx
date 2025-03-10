import React, { useEffect, useState } from "react";

const AdsList = ({ refresh }) => {
  const [ads, setAds] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Индикатор загрузки

  useEffect(() => {
    console.log("Отправляем запрос на сервер...");
    setIsLoading(true); // Устанавливаем флаг загрузки перед запросом

    fetch("https://schenker-production.up.railway.app/ads")
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Данные с сервера:", data);
        if (Array.isArray(data)) {
          setAds(data);
          setError(null); // Сбрасываем ошибку, если запрос успешен
        } else {
          throw new Error("Ошибка: сервер вернул некорректный формат данных");
        }
      })
      .catch((err) => {
        console.error("Ошибка загрузки объявлений:", err);
        setError("Не удалось загрузить объявления");
        setAds([]); // Очищаем список объявлений при ошибке
      })
      .finally(() => setIsLoading(false)); // Отключаем флаг загрузки
  }, [refresh]); // При изменении refresh список обновится

  return (
    <div className="ads-container">
      {isLoading ? (
        <p>Загрузка объявлений...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : ads.length === 0 ? (
        <p>Объявлений пока нет.</p>
      ) : (
        ads.map((ad) => (
          <div key={ad.id} className="ad-card">
            <h3>{ad.title}</h3>
            <p>{ad.description}</p>
            <p><b>Категория:</b> {ad.category}</p>
            <p><b>Адрес:</b> {ad.address}</p>
            <p><b>Контакты:</b> {ad.contact ? ad.contact : "Не указано"}</p>
            {ad.image && <img src={ad.image} alt={ad.title} width="200" />}
          </div>
        ))
      )}
    </div>
  );
};

export default AdsList;