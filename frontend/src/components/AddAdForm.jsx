import { useState } from "react";
import { API_URL } from "../config";

const AddAdForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
    contacts: "",
    image: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/ads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Объявление добавлено!");
    } else {
      alert("Ошибка при добавлении объявления");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Добавить объявление</h2>
      <input type="text" name="title" placeholder="Название" onChange={handleChange} required />
      <input type="text" name="description" placeholder="Описание" onChange={handleChange} required />
      <input type="text" name="category" placeholder="Категория" onChange={handleChange} required />
      <input type="text" name="address" placeholder="Адрес" onChange={handleChange} required />
      <input type="text" name="contacts" placeholder="Контакты" onChange={handleChange} required />
      <input type="text" name="image" placeholder="Ссылка на изображение" onChange={handleChange} />
      <button type="submit">Добавить</button>
    </form>
  );
};

export default AddAdForm;