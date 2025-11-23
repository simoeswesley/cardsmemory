'use client';
import { useState } from 'react';

export default function NameModal({ onSave }: { onSave: (name: string) => void }) {
  const [name, setName] = useState('');

  function handleSave() {
    if (!name) return;
    localStorage.setItem('memoryPlayerName', name);
    onSave(name);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h3 className="text-lg font-semibold mb-3">Informe seu nome</h3>
        <input
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
        />
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
