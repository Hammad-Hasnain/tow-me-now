"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useState } from "react";

type UserStatus = "Active" | "Suspended";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  joinedDate: string;
  totalRequests: number;
  completedRequests: number;
};

const initialUsers: User[] = [
  {
    id: "USR-1001",
    name: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    phone: "+92 300 1234567",
    status: "Active",
    joinedDate: "Sep 12, 2026",
    totalRequests: 18,
    completedRequests: 15,
  },
  {
    id: "USR-1002",
    name: "Usman Tariq",
    email: "usman.tariq@example.com",
    phone: "+92 302 2345678",
    status: "Active",
    joinedDate: "Aug 28, 2026",
    totalRequests: 11,
    completedRequests: 9,
  },
  {
    id: "USR-1003",
    name: "Bilal Ahmed",
    email: "bilal.ahmed@example.com",
    phone: "+92 304 3456789",
    status: "Active",
    joinedDate: "Aug 15, 2026",
    totalRequests: 7,
    completedRequests: 6,
  },
  {
    id: "USR-1004",
    name: "Hassan Ali",
    email: "hassan.ali@example.com",
    phone: "+92 305 4567890",
    status: "Suspended",
    joinedDate: "Jul 30, 2026",
    totalRequests: 14,
    completedRequests: 8,
  },
  {
    id: "USR-1005",
    name: "Saad Mahmood",
    email: "saad.mahmood@example.com",
    phone: "+92 307 5678901",
    status: "Active",
    joinedDate: "Jul 18, 2026",
    totalRequests: 23,
    completedRequests: 21,
  },
  {
    id: "USR-1006",
    name: "Kamran Iqbal",
    email: "kamran.iqbal@example.com",
    phone: "+92 309 6789012",
    status: "Active",
    joinedDate: "Jun 25, 2026",
    totalRequests: 5,
    completedRequests: 4,
  },
];

const statusOptions: Array<"All" | UserStatus> = [
  "All",
  "Active",
  "Suspended",
];

const statusClasses: Record<UserStatus, string> = {
  Active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  Suspended: "border-red-500/20 bg-red-500/10 text-red-400",
};

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<"All" | UserStatus>("All");

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    const searchValue = search.toLowerCase();

    const matchesSearch =
      user.id.toLowerCase().includes(searchValue) ||
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue) ||
      user.phone.toLowerCase().includes(searchValue);

    return matchesStatus && matchesSearch;
  });

  const activeUsers = users.filter(
    (user) => user.status === "Active",
  ).length;

  const suspendedUsers = users.filter(
    (user) => user.status === "Suspended",
  ).length;

  const showToast = (message: string) => {
    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const updateUserStatus = async () => {
    if (!selectedUser) return;

    setSaving(true);

    try {
      /*
       * Future API:
       * PATCH /api/v1/users/:id/status
       *
       * Backend integration will replace this mock logic.
       */

      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                status: selectedUser.status,
              }
            : user,
        ),
      );

      setSelectedUser(null);

      showToast("User status updated successfully.");
    } catch {
      showToast("Failed to update user status.");
    } finally {
      setSaving(false);
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
              <h1 className="text-3xl font-bold tracking-tight">
                Users
              </h1>

              <p className="mt-2 text-[#94A3B8]">
                Manage registered users and monitor their activity.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#111827] px-4 py-2 text-sm text-[#94A3B8]">
              Total Users:{" "}
              <span className="font-semibold text-white">
                {users.length}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
            <p className="text-sm text-[#64748B]">Total Users</p>

            <p className="mt-2 text-2xl font-bold">
              {users.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
            <p className="text-sm text-[#64748B]">Active Users</p>

            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {activeUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
            <p className="text-sm text-[#64748B]">Suspended Users</p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              {suspendedUsers}
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
                setStatusFilter(
                  event.target.value as "All" | UserStatus,
                )
              }
              className="rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Statuses" : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">
          <div className="border-b border-white/10 p-6">
            <h2 className="text-lg font-semibold">
              All Users
            </h2>

            <p className="mt-1 text-sm text-[#64748B]">
              {filteredUsers.length} user
              {filteredUsers.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    User
                  </th>

                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Phone
                  </th>

                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Status
                  </th>

                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Joined
                  </th>

                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Requests
                  </th>

                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Completed
                  </th>

                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10 font-semibold text-violet-300">
                            {user.name.charAt(0)}
                          </div>

                          <div>
                            <p className="font-medium text-white">
                              {user.name}
                            </p>

                            <p className="mt-1 text-xs text-[#64748B]">
                              {user.email}
                            </p>

                            <p className="mt-1 text-xs text-[#475569]">
                              {user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-[#CBD5E1]">
                        {user.phone}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={user.status} />
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4 text-[#94A3B8]">
                        {user.joinedDate}
                      </td>

                      {/* Requests */}
                      <td className="px-6 py-4 font-medium">
                        {user.totalRequests}
                      </td>

                      {/* Completed */}
                      <td className="px-6 py-4 text-emerald-400">
                        {user.completedRequests}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-[#CBD5E1] transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto max-w-sm">
                        <div className="text-3xl">🔎</div>

                        <h3 className="mt-3 font-semibold">
                          No users found
                        </h3>

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
          <div className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#111827] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/10 text-base font-bold text-violet-300">
                  {selectedUser.name.charAt(0)}
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
                  <p className="text-xs text-[#64748B]">
                    User ID
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {selectedUser.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B]">
                    Account Status
                  </p>

                  <div className="mt-1">
                    <StatusBadge status={selectedUser.status} />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#64748B]">
                    Full Name
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {selectedUser.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B]">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {selectedUser.phone}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-[#64748B]">
                    Email
                  </p>

                  <p className="mt-1 truncate text-sm font-medium">
                    {selectedUser.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B]">
                    Joined Date
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {selectedUser.joinedDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B]">
                    Total Requests
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {selectedUser.totalRequests}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B]">
                    Completed Requests
                  </p>

                  <p className="mt-1 text-sm font-medium text-emerald-400">
                    {selectedUser.completedRequests}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div className="rounded-xl border border-white/5 bg-[#0F172A] p-4">
                <label className="text-xs font-medium text-[#64748B]">
                  Update Account Status
                </label>

                <select
                  value={selectedUser.status}
                  onChange={(event) =>
                    setSelectedUser({
                      ...selectedUser,
                      status: event.target.value as UserStatus,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-white/10 px-5 py-4">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                disabled={saving}
                className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-[#CBD5E1] transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateUserStatus}
                disabled={saving}
                className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
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
