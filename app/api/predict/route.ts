import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const exam = searchParams.get("exam") || "";
  const rankParam = searchParams.get("rank") || "";
  const rank = parseInt(rankParam);

  if (!exam || isNaN(rank)) {
    return NextResponse.json(
      { error: "Exam and rank are required" },
      { status: 400 }
    );
  }

  const colleges = await prisma.college.findMany({
    where: {
      examAccepted: { has: exam },
      cutoffRank: { gte: rank },
    },
    orderBy: { cutoffRank: "asc" },
  });

  return NextResponse.json({ colleges });
}