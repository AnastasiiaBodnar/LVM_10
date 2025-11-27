"use client";

import { useState, useEffect } from 'react';
import { clientsAPI } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    surname: '',
    name: '',
    patronymic: '',
    passport: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClient();
  }, []);

  const loadClient = async () => {
    try {
      setLoading(true);
      const response = await clientsAPI.getById(params.id);
      setFormData(response.data);
      setError(null);
    } catch (err) {
      setError('Помилка завантаження клієнта');
      console.error(err);
    } finally {
      setLoading(false);
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
    
    // Валідація
    if (!formData.surname || !formData.name || !formData.passport) {
      setError('Заповніть всі обов\'язкові поля');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await clientsAPI.update(params.id, formData);
      router.push('/clients');
    } catch (err) {
      setError('Помилка збереження клієнта');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Завантаження...</div>;
  }

  if (error && !formData.surname) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Link 
          href="/clients"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Назад до списку
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link 
          href="/clients"
          className="text-blue-500 hover:text-blue-700 mr-4"
        >
          ← Назад
        </Link>
        <h1 className="text-3xl font-bold">Редагувати клієнта</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Прізвище *
          </label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Ім'я *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            По батькові
          </label>
          <input
            type="text"
            name="patronymic"
            value={formData.patronymic}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Паспорт *
          </label>
          <input
            type="text"
            name="passport"
            value={formData.passport}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="AA123456"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {saving ? 'Збереження...' : 'Зберегти'}
          </button>
          <Link
            href="/clients"
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Скасувати
          </Link>
        </div>
      </form>
    </div>
  );
}