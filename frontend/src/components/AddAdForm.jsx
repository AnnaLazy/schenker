import React, { useState } from "react";
import "./AddAdForm.css";

function AddAdForm({ onClose }) {
  const [formData, setFormData] = useState({ title: "", description: "", category: "Cosmetic", imageUrl: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Объявление добавлено:", formData);
    setFormData({ title: "", description: "", category: "Cosmetic", imageUrl: "" });
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Создание объявления</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Название" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <textarea placeholder="Описание" onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
          <select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="Cosmetic">Косметика</option>
            <option value="Clothes">Одежда</option>
            <option value="Furniture">Мебель</option>
          </select>
          <input type="text" placeholder="Ссылка на изображение" onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
          <button type="submit">Добавить</button>
        </form>
      </div>
    </div>
  );
}

export default AddAdForm;