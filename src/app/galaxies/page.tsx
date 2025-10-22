"use client";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { useGalaxies } from "@/lib/hooks";

export default function GalaxiesPage() {
  const router = useRouter();
  const { data: galaxies, isLoading, error } = useGalaxies();

  if (isLoading) return <div className="text-center pt-20">Loading galaxies...</div>;
  if (error) return <div className="text-center pt-20 text-red-500">Failed to load galaxies.</div>;

  return (
    <div className="pt-24 relative min-h-screen overflow-hidden">
      <Header />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:50px_50px]" />
      {galaxies.map((g) => (
        <div
          key={g.id}
          className="absolute group cursor-pointer transition-transform hover:scale-110"
          style={{
            left: `${g.positionX}%`,
            top: `${g.positionY}%`,
            width: `${g.size}px`,
            height: `${g.size}px`,
          }}
          onClick={() => router.push(`/sectors?galaxyId=${g.id}`)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-30 blur-3xl" />
          <div className="absolute inset-0 border-4 border-white/40 rounded-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl mb-2">{g.icon}</div>
            <div className="text-white font-bold text-xl text-center">{g.name}</div>
            <div className="text-sm text-white/70">{g.communities} communities</div>
          </div>
        </div>
      ))}
    </div>
  );
}
