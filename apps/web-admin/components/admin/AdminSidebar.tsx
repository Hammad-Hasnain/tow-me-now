"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Drivers", href: "/admin/drivers" },
  { label: "Service Requests", href: "/admin/service-requests" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-[#111827] lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 px-6 py-6">
          <Link href="/admin/dashboard">
            <h2 className="text-xl font-bold text-white">Tow Me Now</h2>
            <p className="mt-1 text-xs text-[#94A3B8]">Admin Panel</p>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#8B5CF6] text-white shadow-lg shadow-violet-500/20"
                    : "text-[#CBD5E1] hover:bg-white/10 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}