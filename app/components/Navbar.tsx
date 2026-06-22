"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, BookOpen, GitCompare, TrendingUp, LogIn } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/colleges", label: "Colleges", icon: BookOpen },
    { href: "/compare", label: "Compare", icon: GitCompare },
    { href: "/predictor", label: "Predictor", icon: TrendingUp },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white" size={18} />
            </div>
            <span className="font-bold text-gray-900 text-lg">
              College<span className="text-indigo-600">Discovery</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Auth Button */}
          <Link
            href="/auth"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <LogIn size={16} />
            Sign In
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="sm:hidden flex gap-1 pb-3">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === href
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}