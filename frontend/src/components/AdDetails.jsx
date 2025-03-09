import React from "react";

function AdDetails({ ad }) {
  return (
    <div className="ad-details">
      <h2>{ad.title}</h2>
      <p>{ad.description}</p>
      <p>Категория: {ad.category}</p>
      <p>Контакты: {ad.contact}</p>

      <div className="ad-photos">
        {ad.photos.map((photo, index) => (
          <img key={index} src={photo} alt={`Фото ${index + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default AdDetails;