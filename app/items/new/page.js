"use client";

import { useState, useEffect } from 'react';
import { itemsAPI, clientsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewItemPage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    estimatedPrice: '',
    loanAmount: '',
    commission: '',
    owner: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await clientsAPI.getAll();
      setClients(response.data);
    } catch (err) {
      console.error('Помилка завантаження клієнтів:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.estimatedPrice || !formData.owner) {
      setError('Заповніть всі обов\'язкові поля');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await itemsAPI.create({
        ...formData,
        estimatedPrice: Number(formData.estimatedPrice),
        loanAmount: Number(formData.loanAmount),
        commission: Number(formData.commission)
      });
      router.push('/items');
    } catch (err) {
      setError('Помилка створення предмета');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link 
          href="/items"
          className="text-blue-500 hover:text-blue-700 mr-4"
        >
          ← Назад
        </Link>
        <h1 className="text-3xl font-bold">Новий предмет</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Назва предмета *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Наприклад: Ноутбук, Телефон, Прикраса"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Оціночна вартість (грн) *
          </label>
          <input
            type="number"
            name="estimatedPrice"
            value={formData.estimatedPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            min="0"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Сума позики (грн)
          </label>
          <input
            type="number"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            min="0"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Комісія (грн)
          </label>
          <input
            type="number"
            name="commission"
            value={formData.commission}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            min="0"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Власник *
          </label>
          <select
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Оберіть клієнта</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.surname} {client.name} {client.patronymic}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Збереження...' : 'Зберегти'}
          </button>
          <Link
            href="/items"
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Скасувати
          </Link>
        </div>
      </form>
    </div>
  );
}