"use client";

import { useState, useEffect } from 'react';
import { dealsAPI } from '@/lib/api';
import Link from 'next/link';

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const response = await dealsAPI.getAll();
      setDeals(response.data);
      setError(null);
    } catch (err) {
      setError('Помилка завантаження угод');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Видалити угоду?')) return;
    
    try {
      await dealsAPI.delete(id);
      loadDeals();
    } catch (err) {
      alert('Помилка видалення');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA');
  };

  if (loading) {
    return <div className="text-center py-8">Завантаження...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={loadDeals}
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
        <h1 className="text-3xl font-bold">Угоди</h1>
        <Link 
          href="/deals/new"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Додати угоду
        </Link>
      </div>

      {deals.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Немає угод. Додайте першу!
        </p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Клієнт
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Предмет
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Сума позики
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Комісія
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Дата видачі
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Термін повернення
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deals.map((deal) => (
                <tr key={deal._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {deal.client 
                      ? `${deal.client.surname} ${deal.client.name}` 
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    {deal.item?.name || '-'}
                  </td>
                  <td className="px-6 py-4">{deal.loanAmount} грн</td>
                  <td className="px-6 py-4">{deal.commission} грн</td>
                  <td className="px-6 py-4">{formatDate(deal.issueDate)}</td>
                  <td className="px-6 py-4">{formatDate(deal.dueDate)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      deal.isReturned 
                        ? 'bg-green-100 text-green-800' 
                        : new Date(deal.dueDate) < new Date()
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {deal.isReturned 
                        ? 'Повернено' 
                        : new Date(deal.dueDate) < new Date()
                        ? 'Прострочено'
                        : 'Активна'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(deal._id)}
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