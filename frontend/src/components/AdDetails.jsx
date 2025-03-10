import React from "react";

function AdDetails({ ad }) {
  if (!ad) return <p>Ошибка: данные объявления не загружены.</p>;

  return (
    <div className="ad-details">
      <h2>{ad.title}</h2>
      <p>{ad.description}</p>
      <p><b>Категория:</b> {ad.category}</p>
      <p><b>Контакты:</b> {ad.contact || "Не указаны"}</p>

      <div className="ad-photos">
        {Array.isArray(ad.photos) && ad.photos.length > 0 ? (
          ad.photos.map((photo, index) => (
            <img key={index} src={photo} alt={`Фото ${index + 1}`} />
          ))
        ) : ad.image ? (
          <img src={ad.image} alt="Главное фото" />
        ) : (
          <p>Фото отсутствуют</p>
        )}
      </div>
    </div>
  );
}

export default AdDetails;