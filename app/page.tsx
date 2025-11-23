'use client';
import { useEffect, useState } from 'react';
import NameModal from '../components/NameModal';
import Link from 'next/link';

export default function Home() {
  const [player, setPlayer] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('memoryPlayerName');
    if (name) setPlayer(name);
    else setShowModal(true);
  }, []);

  function handleSaved(name: string) {
    setPlayer(name);
    setShowModal(false);
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Jogo da Memória - Cardápio</h1>
      <p className="mb-4">Treine para memorizar o cardápio do restaurante. Informe seu nome para registrar no ranking.</p>
      <div className="flex gap-3">
        <Link href="/game" className="px-4 py-2 bg-blue-600 text-white rounded">
          Iniciar Jogo
        </Link>
        <Link href="/ranking" className="px-4 py-2 border rounded">
          Ranking
        </Link>
      </div>

      {showModal && <NameModal onSave={handleSaved} />}
    </main>
  );
}
