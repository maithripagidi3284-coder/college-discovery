"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type College = {
  id: string;
  name: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  type: string;
};

export default function Home() {
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/colleges?search=${search}&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setColleges(data.colleges);
        setHasMore(data.hasMore);
        setLoading(false);
      });
  }, [search, page]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, id];
    });
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">
        Find Your Perfect College
      </h1>
      <p className="text-gray-500 mb-6">
        Search, compare, and explore colleges across India.
      </p>

      <input
        type="text"
        placeholder="Search college name..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      {selected.length > 0 && (
        <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 mb-6">
          <span className="text-teal-800 text-sm font-medium">
            {selected.length} college{selected.length > 1 ? "s" : ""} selected (max 3)
          </span>
          <button
            disabled={selected.length < 2}
            onClick={() => router.push(`/compare?ids=${selected.join(",")}`)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-40"
          >
            Compare Now
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading colleges...</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {colleges.map((college) => (
            <div
              key={college.id}
              className="relative border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow bg-white"
            >
              <input
                type="checkbox"
                checked={selected.includes(college.id)}
                onChange={() => toggleSelect(college.id)}
                className="absolute top-4 right-4 w-4 h-4"
              />
              <Link href={`/colleges/${college.id}`} className="block pr-8">
                <h2 className="font-semibold text-lg text-gray-900 mb-1">
                  {college.name}
                </h2>
                <p className="text-gray-500 text-sm mb-3">
                  {college.city}, {college.state}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">
                    ₹{college.fees.toLocaleString("en-IN")}/yr
                  </span>
                  <span className="bg-teal-50 text-teal-700 text-sm font-medium px-2 py-1 rounded">
                    ★ {college.rating}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-40"
        >
          Previous
        </button>
        <button
          disabled={!hasMore}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </main>
  );
}
