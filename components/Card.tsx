'use client';
import React from 'react';

export type CardType = {
  uniqueId: string;
  id: number;
  name: string;
  image: string;
  ingredients: string[];
  price: string;
  flipped?: boolean;
  matched?: boolean;
};

export default function Card({ card, onFlip }: { card: CardType; onFlip: (c: CardType) => void }) {
  // When a card is not flipped we shrink it to 20% (scaleY(0.2)). When flipped or matched it uses normal scale.
  // For matched cards we render a simplified view (only the name) and disable interaction.
  const isInteractive = !card.matched;
  // Matched cards should keep 80% of the original size
  const scale = card.matched ? 0.8 : card.flipped ? 1 : 0.2;
  const rotation = card.flipped ? 180 : 0; // degrees

  return (
    <div
      onClick={() => isInteractive && onFlip(card)}
      className={`relative w-100 h-32 perspective cursor-pointer transition-all duration-500`}
      style={{ pointerEvents: isInteractive ? 'auto' : 'none' }}
    >
      <div
        className="relative w-full h-full duration-500 transform-style-preserve-3d"
        style={{
          transform: `rotateY(${rotation}deg) scale(${scale})`,
          transformOrigin: 'center',
          transition: 'transform 500ms'
        }}
      >
        {/*
          1. FACE DE TRÁS (OCULTA) - A ser exibida quando o cartão NÃO está virado.
             Ela é a cor verde que você pediu.
        */}
        <div
          className="absolute inset-0 backface-hidden flex items-center justify-center p-2 border-2 border-green-800 rounded-lg bg-green-500 text-white text-2xl font-bold shadow-lg"
        >
          <span className="select-none">?</span>
        </div>

        {/*
          2. FACE DA FRENTE (CONTEÚDO) - A ser exibida quando o cartão ESTÁ virado.
             Ela deve ser inicialmente rotacionada em 180 graus (rotate-y-180).
        */}
        <div
          className="absolute inset-0 backface-hidden border-2 border-gray-400 rounded-lg bg-white overflow-hidden shadow-lg flex items-center justify-center"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {card.matched ? (
            <div className="text-center font-semibold text-sm">{card.name}</div>
          ) : (
            <div className="flex flex-col items-center h-full w-full">
              <div
                className="w-full flex-1 bg-top bg-cover rounded"
                style={{ backgroundImage: `url(${card.image})` }}
                role="img"
                aria-label={card.name}
              />
              <div className="text-center font-semibold text-xs">{card.name}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}