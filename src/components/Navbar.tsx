"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const leftNavLinks = [
    { href: "/resume", label: "Resume Scanner" },
    { href: "/interview/behavioral", label: "Behavioral" },
    { href: "/technical", label: "Technical" },
    { href: "/history", label: "History" },
  ];

  const rightNavLinks = [
    { href: "/signup", label: "Sign Up" },
    { href: "/login", label: "Login" },
  ];

  return (
    <nav className="bg-white shadow-md mb-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Side - Logo and Nav Links */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/landing/skill-skift-card.png"
                alt="SkillSift Logo"
                width={100}
                height={40}
                className="object-contain"
              />
            </Link>
            <div className="hidden space-x-4 md:flex">
              {leftNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded px-3 py-2 transition-colors ${
                    pathname === link.href
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - Auth Links */}
          <div className="flex items-center space-x-4">
            {rightNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded px-4 py-2 transition-colors ${
                  pathname === link.href
                    ? "bg-orange-500 text-white"
                    : link.label === "Sign Up"
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
