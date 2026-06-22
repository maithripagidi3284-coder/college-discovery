import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);  // ← "password" not "passwordHash"
    if (!valid)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const token = await signToken({ userId: user.id, email: user.email!, name: user.name! });

    sendWelcomeEmail({ to: user.email!, userName: user.name!, isNewUser: false });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}