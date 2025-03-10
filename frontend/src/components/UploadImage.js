import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

const UploadImage = ({ onImageUpload }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Настройки сжатия
    const options = {
      maxSizeMB: 0.5, // Максимальный размер 500KB
      maxWidthOrHeight: 800, // Максимальная ширина/высота
      useWebWorker: true,
    };

    try {
      setError(null);
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setImage(reader.result);
        onImageUpload(reader.result); // Передаём в форму
      };
    } catch (error) {
      console.error("Ошибка сжатия изображения:", error);
      setError("Не удалось загрузить изображение. Попробуйте другой файл.");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {error && <p className="error">{error}</p>}
      {image && <img src={image} alt="Preview" style={{ width: "100px" }} onError={() => setError("Ошибка загрузки изображения")} />}
    </div>
  );
};

export default UploadImage;