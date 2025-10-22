"use client";
import { useSearchParams } from "next/navigation";
import { useSectors } from "@/lib/hooks";
import Header from '@/components/Header';
import PostForm from '@/components/PostForm';

export default function SectorsPage() {
  const params = useSearchParams();
  const galaxyId = Number(params.get("galaxyId"));
  const { data: sectors, isLoading, error } = useSectors(galaxyId);

  if (isLoading) return <div className="text-center pt-20">Loading sectors...</div>;
  if (error) return <div className="text-center pt-20 text-red-500">Failed to load sectors.</div>;

  return (
    <div className="pt-24 px-6 text-white min-h-screen">
      <Header />
      <h1 className="text-3xl font-bold mb-8 text-center">Sectors in Galaxy {galaxyId}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sectors.map((s) => (
          <div key={s.id} className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 cursor-pointer">
            <h2 className="text-2xl font-semibold mb-2">{s.name}</h2>
            <p className="text-sm text-white/70 mb-4">{s.posts.length} posts</p>
            <ul className="space-y-1 text-white/80">
              {s.posts.map((p) => (
                <li key={p.id} className="truncate">• {p.title}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

