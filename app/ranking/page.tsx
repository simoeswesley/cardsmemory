'use client';
import RankingTable from '../../components/RankingTable';
import Link from 'next/link';

export default function RankingPage() {
  return (
    <main className="p-8">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ranking</h2>
        <Link href="/" className="text-sm underline">
          Voltar
        </Link>
      </div>
      <RankingTable />
    </main>
  );
}
