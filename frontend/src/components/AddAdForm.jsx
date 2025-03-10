import React, { useState } from "react";

function AddAdForm({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Cosmetic");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsLoading(true);

    try {
      const uploadedPhotos = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("photo", file);

          const response = await fetch("https://schenker-production.up.railway.app/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Ошибка загрузки фото");

          const data = await response.json();
          if (!data.url) throw new Error("Не получена ссылка на фото");

          return data.url;
        })
      );

      setPhotos((prev) => [...prev, ...uploadedPhotos]);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("address", address);
      formData.append("contact", contact);

      photos.forEach((photo, index) => {
        formData.append(`image_${index + 1}`, photo);
      });

      const response = await fetch("https://schenker-production.up.railway.app/ads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка сервера: ${errorText}`);
      }

      const result = await response.json();
      console.log("Объявление создано:", result);

      // Очищаем форму и закрываем окно после успешной отправки
      setTitle("");
      setDescription("");
      setCategory("Cosmetic");
      setAddress("");
      setContact("");
      setPhotos([]);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal">
      <h2>Создание объявления</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание" required />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Адрес" required />
        <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Контакт" required />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Cosmetic">Cosmetic</option>
          <option value="Clothes">Clothes</option>
          <option value="Furniture">Furniture</option>
        </select>
        <input type="file" multiple onChange={handleFileUpload} disabled={isLoading} />

        {/* Отображение загруженных фото */}
        <div className="photos-preview">
          {photos.map((photo, index) => (
            <img key={index} src={photo} alt={`Фото ${index + 1}`} className="photo-thumbnail" />
          ))}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Загрузка..." : "Опубликовать"}
        </button>
      </form>
    </div>
  );
}

export default AddAdForm;