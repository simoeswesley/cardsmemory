'use client';
import { useEffect, useState } from 'react';
import Card, { CardType } from './Card';
import menuData from '../data/menu.json';
import { addRun } from '../lib/indexeddb';

function duplicateAndShuffle(items: any[]): CardType[] {
  const duplicated = items.flatMap((item) => [
    { ...item, uniqueId: `${item.id}-a`, flipped: false, matched: false },
    { ...item, uniqueId: `${item.id}-b`, flipped: false, matched: false }
  ]);
  return duplicated.sort(() => Math.random() - 0.5);
}

export default function Board({ player }: { player: string }) {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [first, setFirst] = useState<CardType | null>(null);
  const [second, setSecond] = useState<CardType | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [modalCard, setModalCard] = useState<CardType | null>(null);
  const [start, setStart] = useState<number | null>(null);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    reset();
  }, []);

function reset() {
  const LIMITED_ITEMS = menuData.slice(0, 6);
  
  setDeck(duplicateAndShuffle(LIMITED_ITEMS));
  setFirst(null);
  setSecond(null);
  setDisabled(false);
  setMatches(0);
  setStart(Date.now());
}


  function flip(card: CardType) {
    if (disabled || card.flipped || card.matched) return;
    setDeck((prev) => prev.map((c) => (c.uniqueId === card.uniqueId ? { ...c, flipped: true } : c)));
    if (!first) setFirst(card);
    else if (!second) setSecond(card);
  }

  useEffect(() => {
    if (!first || !second) return;
    setDisabled(true);
    const isMatch = first.id === second.id;
    if (isMatch) {
      // Pause the game and show the matched card in a modal. User must click "Continuar" to proceed.
      setModalCard(first);
      return;
    } else {
      setTimeout(() => {
        setDeck((prev) =>
          prev.map((c) => (c.uniqueId === first.uniqueId || c.uniqueId === second.uniqueId ? { ...c, flipped: false } : c))
        );
        setFirst(null);
        setSecond(null);
        setDisabled(false);
      }, 900);
    }
  }, [second]);

  function closeMatchModal() {
    if (!modalCard) return;
    setDeck((prev) => prev.map((c) => (c.id === modalCard.id ? { ...c, matched: true } : c)));
    setMatches((m) => m + 1);
    setFirst(null);
    setSecond(null);
    setDisabled(false);
    setModalCard(null);
  }

  useEffect(() => {
    if (deck.length > 0 && deck.every((c) => c.matched)) {
      const totalTime = start ? Math.floor((Date.now() - start) / 1000) : 0;
      const run = { player, date: new Date().toISOString(), time: totalTime, matches };
      addRun(run).catch(console.error);
      const cached = JSON.parse(localStorage.getItem('memoryRanking') || '[]');
      cached.push(run);
      localStorage.setItem('memoryRanking', JSON.stringify(cached));
    }
  }, [deck]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={reset}>
          Reiniciar
        </button>
        <div>
          Jogador: <strong>{player}</strong>
        </div>
        <div>
          Acertos: <strong>{matches}</strong>
        </div>
      </div>

      <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(150px,150px))] justify-center">
        {deck.map((card) => (
          <Card key={card.uniqueId} card={card} onFlip={flip} />
        ))}
      </div>
      {modalCard && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl w-5/6 h-5/6 flex flex-col items-center justify-center">
            <div className="flex-1 w-full flex items-center justify-center">
              <div className="max-w-[90%] flex flex-col items-center">
                <div className="mt-4 text-center font-bold text-lg">{modalCard.name}</div>
                <img src={modalCard.image} alt={modalCard.name} className="object-contain rounded" />
                <div className="mt-2 text-sm text-gray-700 text-center">
                  <ul className="list-disc list-inside">
                  {(modalCard.ingredients || []).map((ing, i) => (
                    <li key={i} className="truncate">
                      {ing}
                    </li>
                  ))}
                </ul>
                </div>
              </div>
            </div>
            <button
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={closeMatchModal}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
