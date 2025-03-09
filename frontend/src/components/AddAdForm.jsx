import { useState } from "react";
import imageCompression from "browser-image-compression";

const AddAdForm = ({ onAdAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  // Функция для обработки загрузки изображения
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Опции сжатия
    const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };
    
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
        setPreview(reader.result);
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Ошибка при сжатии изображения:", error);
    }
  };

  // Отправка объявления на сервер
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Вы должны войти в систему, чтобы добавить объявление.");
      return;
    }

    const newAd = { title, description, category, address, contact, image };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Добавлен токен
        },
        body: JSON.stringify(newAd),
      });

      if (response.ok) {
        const addedAd = await response.json();
        onAdAdded(addedAd);
        setTitle("");
        setDescription("");
        setCategory("");
        setAddress("");
        setContact("");
        setImage(null);
        setPreview(null);
        setError("");
      } else {
        const data = await response.json();
        setError(data.error || "Ошибка при добавлении объявления");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Ошибка сервера, попробуйте позже.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-ad-form">
      <h2>Создание объявления</h2>
      {error && <p className="error">{error}</p>}
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание" required />
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Адрес" />
      <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Контактные данные" />
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Выберите категорию</option>
        <option value="Cosmetic">Cosmetic</option>
        <option value="Clothes">Clothes</option>
        <option value="Furniture">Furniture</option>
        <option value="Kid stuff">Kid stuff</option>
        <option value="Electric">Electric</option>
      </select>

      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {preview && <img src={preview} alt="Preview" className="preview-image" />}

      <button type="submit">Добавить</button>
    </form>
  );
};

export default AddAdForm;