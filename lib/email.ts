import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function formatFee(fee: number) {
  if (fee >= 100000) return `₹${(fee / 100000).toFixed(1)}L/yr`;
  return `₹${(fee / 1000).toFixed(0)}K/yr`;
}

function formatPackage(lpa: number) {
  return `₹${lpa.toFixed(1)} LPA`;
}

function starRating(rating: number) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

type CollegePreview = {
  name: string;
  city: string;
  state: string;
  type: string;
  rating: number;
  fees: number;
  placementAvg: number | null;
};

async function getRandomColleges(count = 3) {
  const colleges = await prisma.college.findMany({
    take: 20,
    orderBy: { rating: "desc" },
    select: {
      name: true,
      city: true,
      state: true,
      type: true,
      rating: true,
      fees: true,
      placementAvg: true,
    },
  });
  return colleges.sort(() => Math.random() - 0.5).slice(0, count);
}



function collegeCardHTML(college: CollegePreview) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `
    <div style="background:#ffffff;border:1px solid #e8eaf0;border-radius:16px;padding:20px;margin-bottom:16px;">
      <div style="margin-bottom:10px;">
        <p style="margin:0;font-size:15px;font-weight:700;color:#111827;">${college.name}</p>
        <p style="margin:4px 0 0;font-size:12px;color:#6B7280;">📍 ${college.city}, ${college.state}</p>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
        <tr>
          <td width="33%" style="text-align:center;background:#F9FAFB;border-radius:10px;padding:10px;">
            <p style="margin:0;font-size:13px;color:#F59E0B;">${starRating(college.rating)}</p>
            <p style="margin:4px 0 0;font-size:10px;color:#9CA3AF;">${college.rating.toFixed(1)} Rating</p>
          </td>
          <td width="4%"></td>
          <td width="30%" style="text-align:center;background:#F9FAFB;border-radius:10px;padding:10px;">
            <p style="margin:0;font-size:13px;font-weight:700;color:#111827;">₹${(college.fees / 100000).toFixed(1)}L/yr</p>
            <p style="margin:4px 0 0;font-size:10px;color:#9CA3AF;">Fees</p>
          </td>
          <td width="4%"></td>
          <td width="29%" style="text-align:center;background:#F9FAFB;border-radius:10px;padding:10px;">
            <p style="margin:0;font-size:13px;font-weight:700;color:#111827;">${college.placementAvg ? `₹${college.placementAvg / 100000}L` : "—"}</p>
            <p style="margin:4px 0 0;font-size:10px;color:#9CA3AF;">Avg Package</p>
          </td>
        </tr>
      </table>
      <a href="${appUrl}/colleges" style="display:block;text-align:center;background:#4F46E5;color:#ffffff;text-decoration:none;padding:11px;border-radius:10px;font-size:13px;font-weight:600;">
        View Colleges →
      </a>
    </div>
  `;
}

function buildEmailHTML({
  userName,
  isNewUser,
  colleges,
}: {
  userName: string;
  isNewUser: boolean;
  colleges: CollegePreview[];
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const greeting = isNewUser
    ? `Welcome to CollegeDiscovery, ${userName}! 🎉`
    : `Welcome back, ${userName}! 👋`;
  const subheading = isNewUser
    ? "Your account is ready. Here are some top colleges to kickstart your journey:"
    : "Great to see you again! Here are some colleges we picked for you today:";

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:540px;" cellpadding="0" cellspacing="0">

        <!-- Brand -->
        <tr><td style="padding-bottom:20px;text-align:center;">
          <p style="margin:0;font-size:22px;font-weight:800;color:#111827;">
            College<span style="color:#4F46E5;">Discovery</span>
          </p>
        </td></tr>

        <!-- Hero -->
        <tr><td style="background:#4F46E5;border-radius:20px 20px 0 0;padding:32px 28px 24px;text-align:center;">
          <p style="margin:0 0 8px;font-size:24px;font-weight:800;color:#ffffff;line-height:1.3;">${greeting}</p>
          <p style="margin:0;font-size:14px;color:#C7D2FE;line-height:1.6;">${subheading}</p>
        </td></tr>

        <!-- Colleges -->
        <tr><td style="background:#ffffff;border-radius:0 0 20px 20px;padding:24px 24px 8px;">
          <p style="margin:0 0 16px;font-size:12px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.06em;">
            🏫 Recommended Colleges
          </p>
          ${colleges.map(collegeCardHTML).join("")}
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:24px 0;text-align:center;">
          <a href="${appUrl}/colleges"
            style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:700;">
            Explore All Colleges
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="text-align:center;padding-bottom:24px;">
          <p style="margin:0;font-size:11px;color:#9CA3AF;">
            You received this because you ${isNewUser ? "created an account" : "logged in"} on CollegeDiscovery.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendWelcomeEmail({
  to,
  userName,
  isNewUser,
}: {
  to: string;
  userName: string;
  isNewUser: boolean;
}) {
  try {
    const colleges = await getRandomColleges(3);
    const html = buildEmailHTML({ userName, isNewUser, colleges });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"CollegeDiscovery" <${process.env.EMAIL_USER}>`,
      to,
      subject: isNewUser
        ? `Welcome to CollegeDiscovery, ${userName}! 🎓`
        : `Welcome back, ${userName}! Here are today's top picks 🎓`,
      html,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email send failed:", err);
  }
}