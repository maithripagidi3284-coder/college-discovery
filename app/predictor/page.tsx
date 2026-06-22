"use client";

import { useState } from "react";
import Link from "next/link";

type College = {
  id: string;
  name: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  cutoffRank: number | null;
};

export default function PredictorPage() {
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState("");
  const [results, setResults] = useState<College[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handlePredict(e: React.FormEvent) {
    e.preventDefault();
    if (!rank) return;
    setLoading(true);
    setSearched(true);
    const res = await fetch("/api/predict?exam=" + encodeURIComponent(exam) + "&rank=" + rank);
    const data = await res.json();
    setResults(data.colleges || []);
    setLoading(false);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">College Predictor</h1>
      <p className="text-gray-500 mb-8">
        Enter your exam and rank to see colleges you may be eligible for.
      </p>

      <form onSubmit={handlePredict} className="flex flex-col sm:flex-row gap-3 mb-10">
        <select
          value={exam}
          onChange={(e) => setExam(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="JEE Main">JEE Main</option>
          <option value="JEE Advanced">JEE Advanced</option>
          <option value="VITEEE">VITEEE</option>
          <option value="MET">MET</option>
        </select>

        <input
          type="number"
          placeholder="Enter your rank"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />

        <button
          type="submit"
          className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700"
        >
          Predict Colleges
        </button>
      </form>

      {loading && <p className="text-gray-400">Searching...</p>}

      {!loading && searched && results.length === 0 && (
        <p className="text-gray-400">
          No matching colleges found for this exam and rank. Try a different rank or exam.
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Found {results.length} college{results.length > 1 ? "s" : ""} you may be eligible for:
          </p>
          {results.map((c) => (
            <Link
              key={c.id}
              href={"/colleges/" + c.id}
              className="block border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex justify-between items-start mb-1">
                <h2 className="font-semibold text-lg text-gray-900">{c.name}</h2>
                <span className="bg-teal-50 text-teal-700 text-sm font-medium px-2 py-1 rounded">
                  ★ {c.rating}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-2">{c.city}, {c.state}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">₹{c.fees.toLocaleString("en-IN")}/yr</span>
                <span className="text-gray-500">Cutoff Rank: {c.cutoffRank}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}