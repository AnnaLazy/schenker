import React, { useState, useEffect } from "react";
import "./AdsList.css";

const AdsList = ({ searchQuery }) => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch("/api/ads")
      .then((res) => res.json())
      .then((data) => setAds(data));
  }, []);

  const filteredAds = ads.filter(ad =>
    ad.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ads-container">
      {filteredAds.length > 0 ? (
        filteredAds.map((ad) => (
          <div key={ad.id} className="ad-card">
            <h3>{ad.title}</h3>
            <p>{ad.description}</p>
          </div>
        ))
      ) : (
        <p className="no-ads">Объявлений пока нет.</p>
      )}
    </div>
  );
};

export default AdsList;