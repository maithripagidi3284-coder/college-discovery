import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Course = {
  id: string;
  name: string;
  duration: string;
  fees: number;
};

type Review = {
  id: string;
  rating: number;
  comment: string;
  author: string;
  createdAt: Date;
};

export default async function CollegeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const college = await prisma.college.findUnique({
    where: { id },
    include: { courses: true, reviews: true },
  });

  if (!college) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-start mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{college.name}</h1>
        <span className="bg-teal-50 text-teal-700 font-medium px-3 py-1 rounded">
          ★ {college.rating}
        </span>
      </div>
      <p className="text-gray-500 mb-8">
        {college.city}, {college.state} · {college.type}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">Overview</h2>
        <p className="text-gray-700 leading-relaxed">{college.overview}</p>
      </section>

      <section className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Annual Fees</p>
          <p className="text-lg font-semibold">
            ₹{college.fees.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Avg Placement</p>
          <p className="text-lg font-semibold">
            ₹{college.placementAvg?.toLocaleString("en-IN") ?? "N/A"}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Highest Placement</p>
          <p className="text-lg font-semibold">
            ₹{college.placementHighest?.toLocaleString("en-IN") ?? "N/A"}
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">Courses</h2>
        {college.courses.length === 0 ? (
          <p className="text-gray-400">No courses listed yet.</p>
        ) : (
          <ul className="space-y-2">
            {college.courses.map((c: Course) => (
              <li key={c.id} className="border rounded-lg p-3 flex justify-between">
                <span>{c.name} · {c.duration}</span>
                <span className="font-medium">₹{c.fees.toLocaleString("en-IN")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-900">Reviews</h2>
        {college.reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {college.reviews.map((r: Review) => (
              <div key={r.id} className="border rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{r.author}</span>
                  <span className="text-teal-700">★ {r.rating}</span>
                </div>
                <p className="text-gray-600 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}