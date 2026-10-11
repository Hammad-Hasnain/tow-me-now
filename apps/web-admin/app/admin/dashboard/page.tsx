"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  adminApi,
  DashboardAnalytics,
  ApiServiceRequestItem,
  ApiDriverItem,
} from "@/lib/api/admin";

function StatCard({
  title,
  value,
  subLabel,
  icon,
}: {
  title: string;
  value: number;
  subLabel: string;
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
        <span className="rounded-md bg-violet-500/10 px-2 py-1 text-xs font-semibold text-violet-300">
          {subLabel}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isGood = ["ACTIVE", "COMPLETED", "ACCEPTED"].includes(status.toUpperCase());
  const isWarning = ["PENDING", "ARRIVED", "TOWING"].includes(status.toUpperCase());
  const isBad = ["DEACTIVE", "REJECTED", "CANCELLED"].includes(status.toUpperCase());

  const cls = isGood
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : isWarning
    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
    : isBad
    ? "bg-red-500/10 text-red-400 border-red-500/20"
    : "border-white/10 bg-white/5 text-slate-300";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${cls}`}
    >
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [recentRequests, setRecentRequests] = useState<ApiServiceRequestItem[]>([]);
  const [recentDrivers, setRecentDrivers] = useState<ApiDriverItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRequest, setSelectedRequest] =
    useState<ApiServiceRequestItem | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsData, requestsData, driversData] = await Promise.all([
        adminApi.getDashboardAnalytics(),
        adminApi.getServiceRequests().catch(() => []),
        adminApi.getDrivers().catch(() => []),
      ]);

      setAnalytics(analyticsData);
      setRecentRequests(Array.isArray(requestsData) ? requestsData.slice(0, 5) : []);
      setRecentDrivers(Array.isArray(driversData) ? driversData.slice(0, 4) : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard data from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalDrivers = analytics?.drivers?.total || 0;
  const totalRequests = analytics?.serviceRequests?.total || 0;
  const totalUsers = analytics?.users?.total || 0;

  const driverBreakdown = [
    { label: "Active", value: analytics?.drivers?.active || 0 },
    { label: "Pending", value: analytics?.drivers?.pending || 0 },
    { label: "Deactivated", value: analytics?.drivers?.deactivated || 0 },
  ];

  const requestBreakdown = [
    { label: "Pending", value: analytics?.serviceRequests?.pending || 0 },
    { label: "Accepted", value: analytics?.serviceRequests?.accepted || 0 },
    { label: "Arrived", value: analytics?.serviceRequests?.arrived || 0 },
    { label: "Towing", value: analytics?.serviceRequests?.towing || 0 },
    { label: "Completed", value: analytics?.serviceRequests?.completed || 0 },
    { label: "Cancelled / Rejected", value: (analytics?.serviceRequests?.cancelled || 0) + (analytics?.serviceRequests?.rejected || 0) },
  ];

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
                Real-time operational analytics and overview of Tow Me Now platform.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadDashboardData}
                disabled={loading}
                className="rounded-xl border border-white/10 bg-[#111827] px-4 py-2.5 text-sm text-[#CBD5E1] transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white disabled:opacity-50"
              >
                {loading ? "Refreshing..." : "↻ Refresh"}
              </button>

              <div className="rounded-lg border border-white/10 bg-[#111827] px-4 py-2 text-sm text-[#94A3B8]">
                Status: <span className="font-semibold text-emerald-400">Live API</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <span>{error}</span>
            <button
              onClick={loadDashboardData}
              className="font-medium underline hover:text-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Primary Stats (API 16) */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total Registered Drivers"
            value={totalDrivers}
            subLabel={`${analytics?.drivers?.active || 0} active on platform`}
            icon="🚚"
          />

          <StatCard
            title="Total Service Requests"
            value={totalRequests}
            subLabel={`${analytics?.serviceRequests?.completed || 0} completed orders`}
            icon="🛠️"
          />

          <StatCard
            title="Total App Users"
            value={totalUsers}
            subLabel={`${analytics?.users?.active || 0} active accounts`}
            icon="👥"
          />
        </div>

        {/* Status Overview (API 16 Analytics Breakdown) */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Drivers */}
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Driver Status Breakdown</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Current driver account overview from backend
              </p>
            </div>

            <div className="space-y-5">
              {driverBreakdown.map((item) => {
                const percentage =
                  totalDrivers > 0
                    ? Math.round((item.value / totalDrivers) * 100)
                    : 0;

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-[#CBD5E1]">{item.label}</span>
                      <span className="font-medium text-white">
                        {item.value} ({percentage}%)
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
              <h2 className="text-lg font-semibold">Service Request Lifecycle</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Summary of request stages in database
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {requestBreakdown.map((item) => (
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

        {/* Recent Requests Table */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827]">
          <div className="flex flex-col justify-between gap-3 border-b border-white/10 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Recent Service Requests</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Latest towing service activity from API
              </p>
            </div>

            <Link
              href="/admin/service-requests"
              className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
            >
              View all requests →
            </Link>
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
                {recentRequests.length > 0 ? (
                  recentRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4 font-mono font-medium text-violet-400">
                        {request.id?.slice(0, 8)}...
                      </td>

                      <td className="px-6 py-4 text-[#CBD5E1]">
                        {request.userName || "Customer"}
                      </td>

                      <td className="px-6 py-4 text-[#CBD5E1]">
                        {request.driverName || "Not assigned"}
                      </td>

                      <td className="px-6 py-4 text-[#CBD5E1]">
                        {request.vehicle} {request.model ? `(${request.model})` : ""}
                      </td>

                      <td className="max-w-[200px] truncate px-6 py-4 text-[#94A3B8]">
                        {request.pickupLoc?.address || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={request.status} />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-[#94A3B8]">
                        {formatDate(request.createdAt)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-[#64748B]">
                      {loading ? "Loading requests..." : "No service requests recorded yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Sections: Recent Drivers */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827]">
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <div>
              <h2 className="text-lg font-semibold">Registered Drivers</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Active & pending drivers on the system
              </p>
            </div>
            <Link
              href="/admin/drivers"
              className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
            >
              Manage all drivers →
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {recentDrivers.length > 0 ? (
              recentDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10 font-semibold text-violet-300">
                      {(driver.name || "D").charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium">{driver.name}</p>
                      <p className="truncate text-xs text-[#64748B]">
                        {driver.email || driver.phone}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-[#CBD5E1]">
                      {driver.vehicleNumber || driver.vehicleType}
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={driver.status} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-6 text-sm text-[#64748B]">
                {loading ? "Loading drivers..." : "No drivers registered yet."}
              </p>
            )}
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
                <h2 className="mt-1 font-mono text-lg font-semibold">
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
                  {selectedRequest.userName || "-"}
                </p>
                <p className="text-xs text-[#64748B]">{selectedRequest.userPhone}</p>
              </div>

              <div>
                <p className="text-xs text-[#64748B]">Driver</p>
                <p className="mt-1 text-sm font-medium">
                  {selectedRequest.driverName || "Not assigned"}
                </p>
                <p className="text-xs text-[#64748B]">{selectedRequest.driverPhone}</p>
              </div>

              <div>
                <p className="text-xs text-[#64748B]">Vehicle</p>
                <p className="mt-1 text-sm font-medium">
                  {selectedRequest.vehicle} {selectedRequest.model ? `(${selectedRequest.model})` : ""}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#64748B]">Status</p>
                <div className="mt-1">
                  <StatusBadge status={selectedRequest.status} />
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs text-[#64748B]">Pickup Location</p>
                <p className="mt-1 text-sm font-medium">
                  {selectedRequest.pickupLoc?.address || "-"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs text-[#64748B]">Drop-off Location</p>
                <p className="mt-1 text-sm font-medium">
                  {selectedRequest.dropoffLoc?.address || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#64748B]">Fare</p>
                <p className="mt-1 text-sm font-bold text-emerald-400">
                  Rs. {selectedRequest.fare || 0}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#64748B]">Request Date</p>
                <p className="mt-1 text-sm font-medium">
                  {formatDate(selectedRequest.createdAt)}
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
