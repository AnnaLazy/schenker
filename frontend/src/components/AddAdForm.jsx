import React, { useState } from "react";

function AddAdForm({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Cosmetic");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [photos, setPhotos] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("https://schenker-production.up.railway.app/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Загруженное фото:", data.url);
      setPhotos([...photos, data.url]); // добавляем ссылку на фото
    } catch (error) {
      console.error("Ошибка загрузки фото:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newAd = {
      title,
      description,
      category,
      address,
      contact,
      photos,
    };

    try {
      const response = await fetch("https://schenker-production.up.railway.app/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAd),
      });

      const result = await response.json();
      console.log("Объявление создано:", result);
      onClose();
    } catch (error) {
      console.error("Ошибка добавления объявления:", error);
    }
  };

  return (
    <div className="modal">
      <h2>Создание объявления</h2>
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
        <input type="file" onChange={handleFileUpload} />
        <button type="submit">Опубликовать</button>
      </form>
    </div>
  );
}

export default AddAdForm;