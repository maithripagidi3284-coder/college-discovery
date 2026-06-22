"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type College = {
  id: string;
  name: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  type: string;
  placementAvg: number | null;
  placementHighest: number | null;
};

function formatMoney(n: number | null) {
  if (n === null) return "N/A";
  return "₹" + n.toLocaleString("en-IN");
}

const rows = [
  { label: "Location", get: (c: College) => c.city + ", " + c.state },
  { label: "Fees (per year)", get: (c: College) => formatMoney(c.fees) },
  { label: "Rating", get: (c: College) => "★ " + c.rating },
  { label: "Type", get: (c: College) => c.type },
  { label: "Avg Placement", get: (c: College) => formatMoney(c.placementAvg) },
  { label: "Highest Placement", get: (c: College) => formatMoney(c.placementHighest) },
];

function CompareContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids") || "";
  const [colleges, setColleges] = useState<College[]>([]);

  useEffect(() => {
    if (!ids) return;
    fetch("/api/compare?ids=" + ids)
      .then((res) => res.json())
      .then((data) => setColleges(data.colleges));
  }, [ids]);

  if (!ids) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-gray-500">
          No colleges selected. Go back to the homepage and select colleges to compare.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Compare Colleges</h1>
      {colleges.length === 0 ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 border-b"></th>
                {colleges.map((c) => (
                  <th key={c.id} className="text-left p-3 border-b font-semibold text-gray-900">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b">
                  <td className="p-3 font-medium text-gray-500">{row.label}</td>
                  {colleges.map((c) => (
                    <td key={c.id} className="p-3 text-gray-800">
                      {row.get(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400">Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}