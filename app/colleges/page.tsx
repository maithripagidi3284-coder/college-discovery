"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, Search, TrendingUp } from "lucide-react";

interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  type: string;
  examAccepted: string[];
  placementAvg: number | null;
  imageUrl: string | null;
  overview: string;
}

function CollegesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    async function fetchColleges() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        params.set("page", String(page));
        const res = await fetch(`/api/colleges?${params}`);
        const data = await res.json();
        setColleges(data.colleges || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchColleges();
  }, [search, page]);

  function updateSearch(value: string) {
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    router.push(`/colleges?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-xl font-bold text-indigo-600 shrink-0">
            CollegeDiscovery
          </Link>
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search colleges, cities..."
              defaultValue={search}
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Link href="/auth" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shrink-0">
            Login
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {loading ? (
              <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
            ) : (
              <><span className="font-semibold text-gray-900">{total}</span> colleges found</>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                  <div className="flex gap-3 mb-3">
                    <div className="w-11 h-11 bg-gray-200 rounded-xl" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((j) => <div key={j} className="h-12 bg-gray-100 rounded-xl" />)}
                  </div>
                </div>
              ))
            : colleges.map((college) => (
                <Link key={college.id} href={`/colleges/${college.id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all p-5 cursor-pointer h-full flex flex-col">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-lg font-bold text-indigo-500 flex-shrink-0">
                        {college.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                          {college.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-gray-400">
                          <MapPin size={11} />
                          <span className="text-xs truncate">{college.city}, {college.state}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                        {college.type}
                      </span>
                      {college.examAccepted?.[0] && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {college.examAccepted[0]}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-auto">
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-sm font-bold text-gray-900">{college.rating}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">Rating</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="text-sm font-bold text-gray-900">
                          ₹{(college.fees / 100000).toFixed(1)}L
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Fees/yr</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2 text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          <TrendingUp size={11} className="text-green-500" />
                          <span className="text-sm font-bold text-gray-900">
                            {college.placementAvg ? `₹${(college.placementAvg / 100000).toFixed(1)}L` : "—"}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">Avg Pkg</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {!loading && colleges.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No colleges found</h3>
            <p className="text-gray-500 text-sm">Try a different search term</p>
          </div>
        )}

        {!loading && total > 12 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => router.push(`/colleges?page=${page - 1}${search ? `&search=${search}` : ""}`)}
              className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
            >Previous</button>
            <span className="px-4 py-2 text-sm text-gray-600">Page {page}</span>
            <button
              onClick={() => router.push(`/colleges?page=${page + 1}${search ? `&search=${search}` : ""}`)}
              className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
            >Next</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400">Loading...</div>}>
      <CollegesContent />
    </Suspense>
  );
}