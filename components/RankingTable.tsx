'use client';
import { useEffect, useState } from 'react';
import { getAllRuns } from '../lib/indexeddb';

type Run = { id?: number; player: string; time: number; matches: number; date: string };

export default function RankingTable() {
  const [runs, setRuns] = useState<Run[]>([]);

  useEffect(() => {
    getAllRuns()
      .then((data) => {
        if (data && data.length) setRuns(data);
        else {
          const cached = JSON.parse(localStorage.getItem('memoryRanking') || '[]');
          setRuns(cached);
        }
      })
      .catch(() => {
        const cached = JSON.parse(localStorage.getItem('memoryRanking') || '[]');
        setRuns(cached);
      });
  }, []);

  const sorted = [...runs].sort((a, b) => a.time - b.time).slice(0, 50);

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-2">Pos</th>
            <th className="p-2">Jogador</th>
            <th className="p-2">Tempo (s)</th>
            <th className="p-2">Acertos</th>
            <th className="p-2">Data</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{i + 1}</td>
              <td className="p-2">{r.player}</td>
              <td className="p-2">{r.time}</td>
              <td className="p-2">{r.matches ?? '-'}</td>
              <td className="p-2">{new Date(r.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
