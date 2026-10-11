"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useEffect, useState, useTransition } from "react";
import { adminApi, ApiUserItem, IdentityStatus } from "@/lib/api/admin";

export default function UsersPage() {
  const [users, setUsers] = useState<ApiUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<ApiUserItem | null>(null);

  const [statusFilter, setStatusFilter] = useState<"ALL" | IdentityStatus>("ALL");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminApi.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load users from server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesStatus =
      statusFilter === "ALL" || user.status === statusFilter;

    const searchValue = search.toLowerCase();
    const matchesSearch =
      (user.id || "").toLowerCase().includes(searchValue) ||
      (user.name || "").toLowerCase().includes(searchValue) ||
      (user.email || "").toLowerCase().includes(searchValue) ||
      (user.phone || "").toLowerCase().includes(searchValue);

    return matchesStatus && matchesSearch;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "ACTIVE").length;
  const pendingUsers = users.filter((u) => u.status === "PENDING").length;
  const deactivatedUsers = users.filter((u) => u.status === "DEACTIVE").length;

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return String(dateStr);
    }
  };

  const getStatusBadge = (status: IdentityStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
            Active
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
            Pending
          </span>
        );
      case "DEACTIVE":
      default:
        return (
          <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
            Deactive
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white lg:pl-64">
      <AdminSidebar />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#A78BFA]">
            Admin Panel
          </p>

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Users</h1>
              <p className="mt-2 text-[#94A3B8]">
                Manage registered users and monitor their system accounts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadUsers}
                disabled={isLoading}
                className="rounded-lg border border-white/10 bg-[#111827] px-3.5 py-2 text-sm text-[#CBD5E1] transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white disabled:opacity-50"
              >
                {isLoading ? "Refreshing..." : "↻ Refresh"}
              </button>
              <div className="rounded-lg border border-white/10 bg-[#111827] px-4 py-2 text-sm text-[#94A3B8]">
                Total Users:{" "}
                <span className="font-semibold text-white">{totalUsers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <span>{error}</span>
            <button
              onClick={loadUsers}
              className="font-medium underline hover:text-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid gap-5 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
            <p className="text-sm text-[#64748B]">Total Users</p>
            <p className="mt-2 text-2xl font-bold">{totalUsers}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
            <p className="text-sm text-[#64748B]">Active</p>
            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {activeUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
            <p className="text-sm text-[#64748B]">Pending</p>
            <p className="mt-2 text-2xl font-bold text-amber-400">
              {pendingUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
            <p className="text-sm text-[#64748B]">Deactive</p>
            <p className="mt-2 text-2xl font-bold text-red-400">
              {deactivatedUsers}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-md">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by ID, name, email or phone..."
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none placeholder:text-[#475569] focus:border-violet-500/50"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "ALL" | IdentityStatus)
              }
              className="rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="DEACTIVE">Deactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">
          <div className="border-b border-white/10 p-6">
            <h2 className="text-lg font-semibold">Registered Users</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              {filteredUsers.length} user
              {filteredUsers.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-4 font-medium text-[#64748B]">User</th>
                  <th className="px-6 py-4 font-medium text-[#64748B]">Phone</th>
                  <th className="px-6 py-4 font-medium text-[#64748B]">Role</th>
                  <th className="px-6 py-4 font-medium text-[#64748B]">Status</th>
                  <th className="px-6 py-4 font-medium text-[#64748B]">Joined</th>
                  <th className="px-6 py-4 font-medium text-[#64748B]">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-[#94A3B8]">
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                        <span>Loading users from API...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10 font-semibold text-violet-300">
                            {(user.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="mt-1 text-xs text-[#64748B]">
                              {user.email}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[#475569]">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-[#CBD5E1]">{user.phone}</td>

                      {/* Role */}
                      <td className="px-6 py-4 text-xs font-semibold text-[#A78BFA]">
                        {user.role}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">{getStatusBadge(user.status)}</td>

                      {/* Joined */}
                      <td className="px-6 py-4 text-[#94A3B8]">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-[#CBD5E1] transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="mx-auto max-w-sm">
                        <div className="text-3xl">🔎</div>
                        <h3 className="mt-3 font-semibold">No users found</h3>
                        <p className="mt-1 text-sm text-[#64748B]">
                          Try changing your search or status filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[440px] rounded-2xl border border-white/10 bg-[#111827] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/10 text-base font-bold text-violet-300">
                  {(selectedUser.name || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-violet-400">
                    User Details
                  </p>
                  <h2 className="mt-0.5 text-lg font-semibold">
                    {selectedUser.name}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 px-5 py-4">
              <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[#64748B]">User ID</p>
                  <p className="mt-1 break-all text-xs font-mono font-medium text-slate-300">
                    {selectedUser.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B]">Account Status</p>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>

                <div>
                  <p className="text-xs text-[#64748B]">Identity ID</p>
                  <p className="mt-1 break-all text-xs font-mono font-medium text-slate-300">
                    {selectedUser.identityId || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B]">Role</p>
                  <p className="mt-1 text-sm font-medium text-violet-300">
                    {selectedUser.role}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B]">Phone</p>
                  <p className="mt-1 text-sm font-medium">{selectedUser.phone}</p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B]">Joined Date</p>
                  <p className="mt-1 text-sm font-medium">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-[#64748B]">Email Address</p>
                  <p className="mt-1 truncate text-sm font-medium text-slate-200">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-white/10 px-5 py-4">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-[#CBD5E1] transition hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] rounded-xl border border-emerald-500/20 bg-[#111827] px-5 py-4 text-sm font-medium text-emerald-400 shadow-2xl">
          ✓ {toast}
        </div>
      )}
    </main>
  );
}
