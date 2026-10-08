"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 12l9-9 9 9M5 10v10h14V10M9 20v-6h6v6"
        />
      </svg>
    ),
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        />
      </svg>
    ),
  },
  {
    label: "Drivers",
    href: "/admin/drivers",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M5 17h14l-1.5-7h-11L5 17zM7 17v2M17 17v2M6 10l1.5-4h9L18 10M8 14h.01M16 14h.01"
        />
      </svg>
    ),
  },
  {
    label: "Service Requests",
    href: "/admin/service-requests",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 016 0M9 5h6M9 12h6M9 16h4"
        />
      </svg>
    ),
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-[#111827] lg:block">
      <div className="flex h-full flex-col">
        {/* Branding */}
        <div className="border-b border-white/10 px-6 py-6">
          <Link
            href="/admin/dashboard"
            className="block transition-opacity hover:opacity-90"
          >
            <h2 className="text-xl font-bold tracking-tight text-white">
              Tow Me Now
            </h2>

            <p className="mt-1 text-xs font-medium text-[#94A3B8]">
              Admin Panel
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          <p className="mb-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            Management
          </p>

          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#8B5CF6] text-white shadow-lg shadow-violet-500/20"
                    : "text-[#CBD5E1] hover:bg-white/10 hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center transition-colors",
                    isActive ? "text-white" : "text-[#94A3B8]",
                  )}
                >
                  {item.icon}
                </span>

                <span className="ml-3">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-5">
          <div className="rounded-xl bg-white/5 px-4 py-3">
            <p className="text-xs font-medium text-white">
              Admin Dashboard
            </p>

            <p className="mt-1 text-[11px] text-[#64748B]">
              Tow Me Now Management
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}