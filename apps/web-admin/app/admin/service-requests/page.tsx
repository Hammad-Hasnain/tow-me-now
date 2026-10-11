"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import {
  adminApi,
  ApiServiceRequestItem,
  ServiceStatus,
} from "@/lib/api/admin";

const statusFilterOptions: Array<"ALL" | ServiceStatus> = [
  "ALL",
  "PENDING",
  "ACCEPTED",
  "ARRIVED",
  "TOWING",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
];

const statusClasses: Record<ServiceStatus, string> = {
  PENDING: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  ACCEPTED: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  ARRIVED: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  TOWING: "border-violet-500/20 bg-violet-500/10 text-violet-400",
  COMPLETED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  REJECTED: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  CANCELLED: "border-red-500/20 bg-red-500/10 text-red-400",
};

function StatusBadge({ status }: { status: ServiceStatus }) {
  const badgeClass =
    statusClasses[status] ||
    "border-slate-500/20 bg-slate-500/10 text-slate-300";
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${badgeClass}`}
    >
      {status}
    </span>
  );
}

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<ApiServiceRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<ApiServiceRequestItem | null>(null);

  const [statusFilter, setStatusFilter] = useState<"ALL" | ServiceStatus>(
    "ALL"
  );
  const [search, setSearch] = useState("");

  const loadRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminApi.getServiceRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load service requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      statusFilter === "ALL" || request.status === statusFilter;

    const searchValue = search.toLowerCase();
    const matchesSearch =
      (request.id || "").toLowerCase().includes(searchValue) ||
      (request.userName || "").toLowerCase().includes(searchValue) ||
      (request.driverName || "").toLowerCase().includes(searchValue) ||
      (request.vehicle || "").toLowerCase().includes(searchValue) ||
      (request.problem || "").toLowerCase().includes(searchValue) ||
      (request.pickupLoc?.address || "").toLowerCase().includes(searchValue);

    return matchesStatus && matchesSearch;
  });

  const getStatusCount = (status: ServiceStatus) =>
    requests.filter((request) => request.status === status).length;

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Service Requests
              </h1>
              <p className="mt-2 text-[#94A3B8]">
                Monitor live towing orders, customer requests, driver
                assignments, and trip status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadRequests}
                disabled={isLoading}
                className="rounded-xl border border-white/10 bg-[#111827] px-4 py-2.5 text-sm text-[#CBD5E1] transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white disabled:opacity-50"
              >
                {isLoading ? "Refreshing..." : "↻ Refresh"}
              </button>

              <div className="rounded-lg border border-white/10 bg-[#111827] px-4 py-2 text-sm text-[#94A3B8]">
                Total Requests:{" "}
                <span className="font-semibold text-white">
                  {requests.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <span>{error}</span>
            <button
              onClick={loadRequests}
              className="font-medium underline hover:text-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Summary Filter Cards */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          {(
            [
              "PENDING",
              "ACCEPTED",
              "ARRIVED",
              "TOWING",
              "COMPLETED",
              "REJECTED",
              "CANCELLED",
            ] as ServiceStatus[]
          ).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                setStatusFilter(statusFilter === status ? "ALL" : status)
              }
              className={`rounded-2xl border p-4 text-left transition ${
                statusFilter === status
                  ? "border-violet-500/40 bg-violet-500/10"
                  : "border-white/10 bg-[#111827] hover:border-white/20"
              }`}
            >
              <p className="text-xs uppercase tracking-wider text-[#64748B]">
                {status}
              </p>
              <p className="mt-2 text-xl font-bold">
                {getStatusCount(status)}
              </p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search request ID, customer, driver, or location..."
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none placeholder:text-[#475569] focus:border-violet-500/50"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "ALL" | ServiceStatus
                )
              }
              className="rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
            >
              {statusFilterOptions.map((st) => (
                <option key={st} value={st}>
                  {st === "ALL" ? "All Statuses" : st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">
          <div className="border-b border-white/10 p-6">
            <h2 className="text-lg font-semibold">Towing Requests</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              {filteredRequests.length} request
              {filteredRequests.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02]">
                <tr>
                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Request ID
                  </th>
                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Customer
                  </th>
                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Driver
                  </th>
                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Vehicle & Issue
                  </th>
                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Locations
                  </th>
                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Fare
                  </th>
                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Status
                  </th>
                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Date
                  </th>
                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center text-[#94A3B8]">
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                        <span>Loading requests from API...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4 font-mono font-semibold text-violet-400">
                        {request.id?.slice(0, 10)}...
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">
                            {request.userName || "Customer"}
                          </p>
                          <p className="mt-1 text-xs text-[#64748B]">
                            {request.userPhone || "-"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-[#CBD5E1]">
                          {request.driverName || "Unassigned"}
                        </p>
                        {request.driverPhone && (
                          <p className="mt-1 text-xs text-[#64748B]">
                            {request.driverPhone}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-[#CBD5E1]">
                          {request.vehicle} {request.model ? `(${request.model})` : ""}
                        </p>
                        <p className="mt-1 max-w-[200px] truncate text-xs text-amber-300/80">
                          {request.problem}
                        </p>
                      </td>

                      <td className="max-w-[220px] px-6 py-4 text-xs text-[#94A3B8]">
                        <p className="truncate text-white">
                          <span className="text-violet-400">Pickup:</span>{" "}
                          {request.pickupLoc?.address || "Address unavailable"}
                        </p>
                        <p className="mt-1 truncate text-slate-400">
                          <span className="text-emerald-400">Drop:</span>{" "}
                          {request.dropoffLoc?.address || "Address unavailable"}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-semibold text-emerald-400">
                        Rs. {request.fare || 0}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={request.status} />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-[#94A3B8]">
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
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="mx-auto max-w-sm">
                        <div className="text-3xl">🔎</div>
                        <h3 className="mt-3 font-semibold">No requests found</h3>
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

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111827] shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#111827] p-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-violet-400">
                  Service Request Details
                </p>
                <h2 className="mt-1 font-mono text-lg font-semibold text-white">
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

            {/* Details */}
            <div className="space-y-6 p-6">
              {/* Customer */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-violet-300">
                  Customer Information
                </h3>
                <div className="grid gap-4 rounded-xl border border-white/5 bg-[#0F172A] p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-[#64748B]">Name</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.userName || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Phone</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.userPhone || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">User ID</p>
                    <p className="mt-1 font-mono text-xs text-slate-400">
                      {selectedRequest.userId || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Driver */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-violet-300">
                  Driver Information
                </h3>
                <div className="grid gap-4 rounded-xl border border-white/5 bg-[#0F172A] p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-[#64748B]">Assigned Driver</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.driverName || "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Driver Phone</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.driverPhone || "-"}
                    </p>
                  </div>
                  {selectedRequest.driverId && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-[#64748B]">Driver ID</p>
                      <p className="mt-1 font-mono text-xs text-slate-400">
                        {selectedRequest.driverId}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle & Issue */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-violet-300">
                  Vehicle & Issue
                </h3>
                <div className="grid gap-4 rounded-xl border border-white/5 bg-[#0F172A] p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-[#64748B]">Vehicle</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.vehicle} {selectedRequest.model ? `(${selectedRequest.model})` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Fare</p>
                    <p className="mt-1 text-sm font-bold text-emerald-400">
                      Rs. {selectedRequest.fare || 0}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[#64748B]">Problem Description</p>
                    <p className="mt-1 text-sm text-amber-200">
                      {selectedRequest.problem || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-violet-300">
                  Trip Locations
                </h3>
                <div className="space-y-3 rounded-xl border border-white/5 bg-[#0F172A] p-4">
                  <div>
                    <p className="text-xs text-[#64748B]">Pickup Address</p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {selectedRequest.pickupLoc?.address || "-"}
                    </p>
                    {selectedRequest.pickupLoc?.latitude != null && (
                      <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                        Lat: {selectedRequest.pickupLoc.latitude}, Lng: {selectedRequest.pickupLoc.longitude}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B]">Drop-off Address</p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {selectedRequest.dropoffLoc?.address || "-"}
                    </p>
                    {selectedRequest.dropoffLoc?.latitude != null && (
                      <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                        Lat: {selectedRequest.dropoffLoc.latitude}, Lng: {selectedRequest.dropoffLoc.longitude}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-violet-300">
                  Current Status
                </h3>
                <div className="flex items-center gap-3">
                  <StatusBadge status={selectedRequest.status} />
                  <span className="text-xs text-[#94A3B8]">
                    Created at {formatDate(selectedRequest.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-white/10 p-6">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-[#CBD5E1] transition hover:bg-white/5"
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
