"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useState } from "react";

type RequestStatus =
  | "Pending"
  | "Accepted"
  | "In Progress"
  | "Completed"
  | "Cancelled";

const dashboardStats = {
  totalDrivers: 124,
  totalServiceRequests: 486,
  totalUsers: 1284,
};

const driverStatus = [
  { label: "Active", value: 82 },
  { label: "Pending", value: 18 },
  { label: "Suspended", value: 12 },
  { label: "Rejected", value: 12 },
];

const requestStatus = [
  { label: "Pending", value: 42 },
  { label: "Accepted", value: 31 },
  { label: "In Progress", value: 18 },
  { label: "Completed", value: 362 },
  { label: "Cancelled", value: 33 },
];

const recentRequests: {
  id: string;
  customer: string;
  driver: string;
  vehicle: string;
  location: string;
  status: RequestStatus;
  date: string;
}[] = [
  {
    id: "REQ-1048",
    customer: "Ahmed Khan",
    driver: "Ali Raza",
    vehicle: "Toyota Hilux",
    location: "Gulshan-e-Iqbal",
    status: "Completed",
    date: "Oct 07, 2026",
  },
  {
    id: "REQ-1047",
    customer: "Usman Tariq",
    driver: "Hamza Ahmed",
    vehicle: "Isuzu D-Max",
    location: "DHA Phase 6",
    status: "In Progress",
    date: "Oct 07, 2026",
  },
  {
    id: "REQ-1046",
    customer: "Bilal Ahmed",
    driver: "Pending",
    vehicle: "Suzuki Ravi",
    location: "North Nazimabad",
    status: "Pending",
    date: "Oct 06, 2026",
  },
  {
    id: "REQ-1045",
    customer: "Hassan Ali",
    driver: "Farhan Khan",
    vehicle: "Toyota Revo",
    location: "Clifton",
    status: "Accepted",
    date: "Oct 06, 2026",
  },
  {
    id: "REQ-1044",
    customer: "Saad Mahmood",
    driver: "Adeel Shah",
    vehicle: "Nissan Pickup",
    location: "PECHS",
    status: "Completed",
    date: "Oct 05, 2026",
  },
];

const recentDrivers = [
  {
    name: "Ali Raza",
    email: "ali.raza@example.com",
    vehicle: "Toyota Hilux",
    status: "Active",
  },
  {
    name: "Hamza Ahmed",
    email: "hamza.ahmed@example.com",
    vehicle: "Isuzu D-Max",
    status: "Active",
  },
  {
    name: "Farhan Khan",
    email: "farhan.khan@example.com",
    vehicle: "Toyota Revo",
    status: "Pending",
  },
  {
    name: "Adeel Shah",
    email: "adeel.shah@example.com",
    vehicle: "Nissan Pickup",
    status: "Active",
  },
];

const activities = [
  {
    title: "New driver registration",
    description: "Farhan Khan submitted a driver application.",
    time: "15 minutes ago",
  },
  {
    title: "Service request completed",
    description: "REQ-1048 was marked as completed.",
    time: "32 minutes ago",
  },
  {
    title: "Driver account activated",
    description: "Adeel Shah's account was activated.",
    time: "1 hour ago",
  },
  {
    title: "New service request",
    description: "REQ-1047 was created by Usman Tariq.",
    time: "2 hours ago",
  },
];

const statusClasses: Record<RequestStatus | string, string> = {
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Accepted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "In Progress": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

function StatCard({
  title,
  value,
  growth,
  icon,
}: {
  title: string;
  value: number;
  growth: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 transition hover:border-violet-500/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#94A3B8]">{title}</p>
          <h2 className="mt-3 text-3xl font-bold text-white">
            {value.toLocaleString()}
          </h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-xl">
          {icon}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400">
          +{growth}%
        </span>
        <span className="text-xs text-[#64748B]">vs last month</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
        statusClasses[status] || "border-white/10 bg-white/5 text-slate-300"
      }`}
    >
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const [selectedRequest, setSelectedRequest] = useState<
    (typeof recentRequests)[number] | null
  >(null);

  return (
    <main className="min-h-screen bg-[#0F172A] text-white lg:pl-64">
      <AdminSidebar />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#A78BFA]">
            Admin Panel
          </p>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="mt-2 text-[#94A3B8]">
                Monitor your towing platform and manage daily operations.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#111827] px-4 py-2 text-sm text-[#94A3B8]">
              Last updated: <span className="text-white">Just now</span>
            </div>
          </div>
        </div>

        {/* Primary Stats */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total Drivers"
            value={dashboardStats.totalDrivers}
            growth={8.2}
            icon="🚚"
          />

          <StatCard
            title="Total Service Requests"
            value={dashboardStats.totalServiceRequests}
            growth={12.5}
            icon="🛠️"
          />

          <StatCard
            title="Total Users"
            value={dashboardStats.totalUsers}
            growth={6.4}
            icon="👥"
          />
        </div>

        {/* Status Overview */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Drivers */}
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Driver Status</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Current driver account overview
              </p>
            </div>

            <div className="space-y-5">
              {driverStatus.map((item) => {
                const percentage = Math.round(
                  (item.value / dashboardStats.totalDrivers) * 100,
                );

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-[#CBD5E1]">{item.label}</span>
                      <span className="font-medium text-white">
                        {item.value}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-violet-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Requests */}
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Service Requests</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Current request status overview
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {requestStatus.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/5 bg-[#0F172A] p-4"
                >
                  <p className="text-xs text-[#64748B]">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827]">
          <div className="flex flex-col justify-between gap-3 border-b border-white/10 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Recent Service Requests</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Latest towing service activity
              </p>
            </div>

            <button
              type="button"
              className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
            >
              View all requests →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02]">
                <tr>
                  {[
                    "Request ID",
                    "Customer",
                    "Driver",
                    "Vehicle",
                    "Location",
                    "Status",
                    "Date",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 font-medium text-[#64748B]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {recentRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-medium text-violet-400">
                      {request.id}
                    </td>

                    <td className="px-6 py-4 text-[#CBD5E1]">
                      {request.customer}
                    </td>

                    <td className="px-6 py-4 text-[#CBD5E1]">
                      {request.driver}
                    </td>

                    <td className="px-6 py-4 text-[#CBD5E1]">
                      {request.vehicle}
                    </td>

                    <td className="px-6 py-4 text-[#94A3B8]">
                      {request.location}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={request.status} />
                    </td>

                    <td className="px-6 py-4 text-[#94A3B8]">
                      {request.date}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(request)}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-[#CBD5E1] transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Recent Drivers */}
          <div className="rounded-2xl border border-white/10 bg-[#111827]">
            <div className="border-b border-white/10 p-6">
              <h2 className="text-lg font-semibold">Recent Drivers</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Latest registered drivers
              </p>
            </div>

            <div className="divide-y divide-white/5">
              {recentDrivers.map((driver) => (
                <div
                  key={driver.email}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10 font-semibold text-violet-300">
                      {driver.name.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium">{driver.name}</p>
                      <p className="truncate text-xs text-[#64748B]">
                        {driver.email}
                      </p>
                    </div>
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="text-sm text-[#CBD5E1]">{driver.vehicle}</p>
                    <div className="mt-1">
                      <StatusBadge status={driver.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-2xl border border-white/10 bg-[#111827]">
            <div className="border-b border-white/10 p-6">
              <h2 className="text-lg font-semibold">Platform Activity</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Recent platform events
              </p>
            </div>

            <div className="divide-y divide-white/5">
              {activities.map((activity) => (
                <div key={activity.title} className="flex gap-4 p-5">
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-violet-500" />

                  <div>
                    <p className="text-sm font-medium text-white">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#64748B]">
                      {activity.description}
                    </p>
                    <p className="mt-2 text-xs text-[#475569]">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111827] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-violet-400">
                  Service Request
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  {selectedRequest.id}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#64748B]">Customer</p>
                <p className="mt-1 text-sm font-medium">
                  {selectedRequest.customer}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#64748B]">Driver</p>
                <p className="mt-1 text-sm font-medium">
                  {selectedRequest.driver}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#64748B]">Vehicle</p>
                <p className="mt-1 text-sm font-medium">
                  {selectedRequest.vehicle}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#64748B]">Status</p>
                <div className="mt-1">
                  <StatusBadge status={selectedRequest.status} />
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs text-[#64748B]">Location</p>
                <p className="mt-1 text-sm font-medium">
                  {selectedRequest.location}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#64748B]">Request Date</p>
                <p className="mt-1 text-sm font-medium">
                  {selectedRequest.date}
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-white/10 p-6">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium transition hover:bg-violet-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
