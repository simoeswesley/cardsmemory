'use client';
import { useEffect, useState } from 'react';
import Board from '../../components/Board';
import NameModal from '../../components/NameModal';
import Link from 'next/link';

export default function GamePage() {
  const [player, setPlayer] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('memoryPlayerName');
    if (name) setPlayer(name);
    else setShowModal(true);
  }, []);

  function handleSave(name: string) {
    setPlayer(name);
    setShowModal(false);
  }

  return (
    <main className="p-8">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Jogo</h2>
        <Link href="/" className="text-sm underline">
          Voltar
        </Link>
      </div>

      {showModal || !player ? <NameModal onSave={handleSave} /> : <Board player={player} />}
    </main>
  );
}
