import { useEffect, useState } from "react";
import { API_URL } from "../config";

const AdsList = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/ads`)
      .then((res) => res.json())
      .then((data) => setAds(data))
      .catch((err) => console.error("Ошибка загрузки объявлений:", err));
  }, []);

  return (
    <div>
      <h2>Объявления</h2>
      <ul>
        {ads.length > 0 ? (
          ads.map((ad) => (
            <li key={ad.id}>
              <strong>{ad.title}</strong> - {ad.description}
            </li>
          ))
        ) : (
          <p>Объявлений пока нет.</p>
        )}
      </ul>
    </div>
  );
};

export default AdsList;