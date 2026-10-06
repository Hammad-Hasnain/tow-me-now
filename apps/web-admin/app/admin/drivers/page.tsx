import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function DriversPage() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-white lg:pl-64">
      <AdminSidebar />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-[#1E1B4B]/60 p-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#A78BFA]">
            Admin Panel
          </p>

          <h1 className="text-3xl font-bold">Drivers</h1>

          <p className="mt-3 text-[#CBD5E1]">
            Driver management features will be available here.
          </p>
        </div>
      </section>
    </main>
  );
}