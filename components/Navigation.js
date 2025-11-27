import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex gap-6">
        <Link href="/" className="hover:text-blue-400">
          Головна
        </Link>
        <Link href="/clients" className="hover:text-blue-400">
          Клієнти
        </Link>
        <Link href="/items" className="hover:text-blue-400">
          Предмети
        </Link>
        <Link href="/deals" className="hover:text-blue-400">
          Угоди
        </Link>
      </div>
    </nav>
  );
}