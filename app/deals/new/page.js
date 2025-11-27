"use client";

import { useState, useEffect } from 'react';
import { dealsAPI, clientsAPI, itemsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewDealPage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    client: '',
    item: '',
    loanAmount: '',
    commission: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientsRes, itemsRes] = await Promise.all([
        clientsAPI.getAll(),
        itemsAPI.getAll()
      ]);
      setClients(clientsRes.data);
      setItems(itemsRes.data);
    } catch (err) {
      console.error('Помилка завантаження даних:', err);
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
    
    if (!formData.client || !formData.item || !formData.loanAmount || !formData.dueDate) {
      setError('Заповніть всі обов\'язкові поля');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await dealsAPI.create({
        ...formData,
        loanAmount: Number(formData.loanAmount),
        commission: Number(formData.commission)
      });
      router.push('/deals');
    } catch (err) {
      setError('Помилка створення угоди');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link 
          href="/deals"
          className="text-blue-500 hover:text-blue-700 mr-4"
        >
          ← Назад
        </Link>
        <h1 className="text-3xl font-bold">Нова угода</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Клієнт *
          </label>
          <select
            name="client"
            value={formData.client}
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

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Предмет *
          </label>
          <select
            name="item"
            value={formData.item}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Оберіть предмет</option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} - {item.estimatedPrice} грн
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Сума позики (грн) *
          </label>
          <input
            type="number"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            min="0"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Комісія (грн) *
          </label>
          <input
            type="number"
            name="commission"
            value={formData.commission}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            min="0"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Дата видачі *
          </label>
          <input
            type="date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Термін повернення *
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Збереження...' : 'Створити угоду'}
          </button>
          <Link
            href="/deals"
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Скасувати
          </Link>
        </div>
      </form>
    </div>
  );
}