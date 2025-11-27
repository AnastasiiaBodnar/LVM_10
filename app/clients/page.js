"use client";

import { useState, useEffect } from 'react';
import { clientsAPI } from '@/lib/api';
import Link from 'next/link';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientsAPI.getAll();
      setClients(response.data);
      setError(null);
    } catch (err) {
      setError('Помилка завантаження клієнтів');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Видалити клієнта?')) return;
    
    try {
      await clientsAPI.delete(id);
      loadClients();
    } catch (err) {
      alert('Помилка видалення');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Завантаження...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={loadClients}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Клієнти</h1>
        <Link 
          href="/clients/new"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Додати клієнта
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Немає клієнтів. Додайте першого!
        </p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Прізвище
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Ім'я
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  По батькові
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Паспорт
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{client.surname}</td>
                  <td className="px-6 py-4">{client.name}</td>
                  <td className="px-6 py-4">{client.patronymic}</td>
                  <td className="px-6 py-4">{client.passport}</td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/clients/${client._id}`}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                    >
                      Редагувати
                    </Link>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}