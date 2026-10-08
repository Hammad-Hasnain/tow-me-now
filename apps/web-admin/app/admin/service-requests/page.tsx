"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useState } from "react";

type RequestStatus =
  | "Pending"
  | "Accepted"
  | "In Progress"
  | "Completed"
  | "Cancelled";

type ServiceRequest = {
  id: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  driver: string;
  driverPhone: string;
  vehicleType: string;
  vehicleNo: string;
  pickupLocation: string;
  destination: string;
  requestDate: string;
  status: RequestStatus;
  notes: string;
};

const initialRequests: ServiceRequest[] = [
  {
    id: "REQ-1048",
    customer: "Ahmed Khan",
    customerEmail: "ahmed.khan@example.com",
    customerPhone: "+92 300 1234567",
    driver: "Ali Raza",
    driverPhone: "+92 301 9876543",
    vehicleType: "Toyota Hilux",
    vehicleNo: "KHI-4582",
    pickupLocation: "Gulshan-e-Iqbal, Karachi",
    destination: "Clifton, Karachi",
    requestDate: "Oct 07, 2026 - 10:30 AM",
    status: "Completed",
    notes: "Vehicle broke down near the main road.",
  },
  {
    id: "REQ-1047",
    customer: "Usman Tariq",
    customerEmail: "usman.tariq@example.com",
    customerPhone: "+92 302 2345678",
    driver: "Hamza Ahmed",
    driverPhone: "+92 303 8765432",
    vehicleType: "Isuzu D-Max",
    vehicleNo: "KHI-7214",
    pickupLocation: "DHA Phase 6, Karachi",
    destination: "PECHS, Karachi",
    requestDate: "Oct 07, 2026 - 09:45 AM",
    status: "In Progress",
    notes: "Customer requested roadside towing assistance.",
  },
  {
    id: "REQ-1046",
    customer: "Bilal Ahmed",
    customerEmail: "bilal.ahmed@example.com",
    customerPhone: "+92 304 3456789",
    driver: "Not Assigned",
    driverPhone: "-",
    vehicleType: "Suzuki Ravi",
    vehicleNo: "KHI-9321",
    pickupLocation: "North Nazimabad, Karachi",
    destination: "Nazimabad, Karachi",
    requestDate: "Oct 06, 2026 - 06:20 PM",
    status: "Pending",
    notes: "Waiting for a nearby driver.",
  },
  {
    id: "REQ-1045",
    customer: "Hassan Ali",
    customerEmail: "hassan.ali@example.com",
    customerPhone: "+92 305 4567890",
    driver: "Farhan Khan",
    driverPhone: "+92 306 7654321",
    vehicleType: "Toyota Revo",
    vehicleNo: "KHI-6147",
    pickupLocation: "Clifton, Karachi",
    destination: "DHA Phase 2, Karachi",
    requestDate: "Oct 06, 2026 - 03:15 PM",
    status: "Accepted",
    notes: "Driver accepted the request and is heading to pickup.",
  },
  {
    id: "REQ-1044",
    customer: "Saad Mahmood",
    customerEmail: "saad.mahmood@example.com",
    customerPhone: "+92 307 5678901",
    driver: "Adeel Shah",
    driverPhone: "+92 308 6543210",
    vehicleType: "Nissan Pickup",
    vehicleNo: "KHI-3856",
    pickupLocation: "PECHS, Karachi",
    destination: "Gulshan-e-Iqbal, Karachi",
    requestDate: "Oct 05, 2026 - 11:40 AM",
    status: "Completed",
    notes: "Towing service completed successfully.",
  },
  {
    id: "REQ-1043",
    customer: "Kamran Iqbal",
    customerEmail: "kamran.iqbal@example.com",
    customerPhone: "+92 309 6789012",
    driver: "Not Assigned",
    driverPhone: "-",
    vehicleType: "Toyota Corolla",
    vehicleNo: "KHI-8294",
    pickupLocation: "Saddar, Karachi",
    destination: "Korangi, Karachi",
    requestDate: "Oct 05, 2026 - 08:25 AM",
    status: "Cancelled",
    notes: "Customer cancelled the request.",
  },
];

const statusOptions: RequestStatus[] = [
  "Pending",
  "Accepted",
  "In Progress",
  "Completed",
  "Cancelled",
];

const statusClasses: Record<RequestStatus, string> = {
  Pending: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  Accepted: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  "In Progress": "border-violet-500/20 bg-violet-500/10 text-violet-400",
  Completed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  Cancelled: "border-red-500/20 bg-red-500/10 text-red-400",
};

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] =
    useState<ServiceRequest | null>(null);

  const [statusFilter, setStatusFilter] = useState<"All" | RequestStatus>(
    "All",
  );

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      statusFilter === "All" || request.status === statusFilter;

    const searchValue = search.toLowerCase();

    const matchesSearch =
      request.id.toLowerCase().includes(searchValue) ||
      request.customer.toLowerCase().includes(searchValue) ||
      request.driver.toLowerCase().includes(searchValue) ||
      request.vehicleNo.toLowerCase().includes(searchValue) ||
      request.pickupLocation.toLowerCase().includes(searchValue);

    return matchesStatus && matchesSearch;
  });

  const showToast = (message: string) => {
    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const updateRequestStatus = async () => {
    if (!selectedRequest) return;

    setSaving(true);

    try {
      /*
       * Future API:
       * PATCH /api/v1/service-requests/:id/status
       *
       * Backend integration will replace this mock logic.
       */

      await new Promise((resolve) => setTimeout(resolve, 500));

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === selectedRequest.id
            ? {
                ...request,
                status: selectedRequest.status,
              }
            : request,
        ),
      );

      setSelectedRequest(null);
      showToast("Service request status updated successfully.");
    } catch {
      showToast("Failed to update service request.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusCount = (status: RequestStatus) =>
    requests.filter((request) => request.status === status).length;

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
                Monitor and manage towing service requests.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#111827] px-4 py-2 text-sm text-[#94A3B8]">
              Total Requests:{" "}
              <span className="font-semibold text-white">
                {requests.length}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                setStatusFilter(
                  statusFilter === status ? "All" : status,
                )
              }
              className={`rounded-2xl border p-5 text-left transition ${
                statusFilter === status
                  ? "border-violet-500/40 bg-violet-500/10"
                  : "border-white/10 bg-[#111827] hover:border-white/20"
              }`}
            >
              <p className="text-sm text-[#64748B]">{status}</p>

              <p className="mt-2 text-2xl font-bold">
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
                placeholder="Search request, customer, driver..."
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none placeholder:text-[#475569] focus:border-violet-500/50"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "All" | RequestStatus,
                )
              }
              className="rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
            >
              <option value="All">All Statuses</option>

              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">
          <div className="border-b border-white/10 p-6">
            <h2 className="text-lg font-semibold">All Service Requests</h2>

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
                    Vehicle
                  </th>

                  <th className="px-6 py-4 font-medium text-[#64748B]">
                    Location
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
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4 font-semibold text-violet-400">
                        {request.id}
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">
                            {request.customer}
                          </p>

                          <p className="mt-1 text-xs text-[#64748B]">
                            {request.customerPhone}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-[#CBD5E1]">{request.driver}</p>

                        {request.driverPhone !== "-" && (
                          <p className="mt-1 text-xs text-[#64748B]">
                            {request.driverPhone}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-[#CBD5E1]">
                          {request.vehicleType}
                        </p>

                        <p className="mt-1 text-xs text-[#64748B]">
                          {request.vehicleNo}
                        </p>
                      </td>

                      <td className="max-w-[180px] px-6 py-4 text-[#94A3B8]">
                        <p className="truncate">{request.pickupLocation}</p>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={request.status} />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-[#94A3B8]">
                        {request.requestDate}
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
                    <td
                      colSpan={8}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto max-w-sm">
                        <div className="text-3xl">🔎</div>

                        <h3 className="mt-3 font-semibold">
                          No requests found
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

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111827] shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#111827] p-6">
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

            {/* Details */}
            <div className="space-y-7 p-6">
              {/* Customer */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-violet-300">
                  Customer Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-[#64748B]">Name</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.customer}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#64748B]">Phone</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.customerPhone}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs text-[#64748B]">Email</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.customerEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Driver */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-violet-300">
                  Driver Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-[#64748B]">Driver</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.driver}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#64748B]">Phone</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.driverPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-violet-300">
                  Vehicle Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-[#64748B]">Vehicle Type</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.vehicleType}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#64748B]">Vehicle Number</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.vehicleNo}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-violet-300">
                  Service Details
                </h3>

                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-[#64748B]">Pickup Location</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.pickupLocation}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#64748B]">Destination</p>
                    <p className="mt-1 text-sm font-medium">
                      {selectedRequest.destination}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#64748B]">Notes</p>
                    <p className="mt-1 rounded-xl border border-white/5 bg-[#0F172A] p-4 text-sm leading-6 text-[#CBD5E1]">
                      {selectedRequest.notes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-violet-300">
                  Request Status
                </h3>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <select
                    value={selectedRequest.status}
                    onChange={(event) =>
                      setSelectedRequest({
                        ...selectedRequest,
                        status: event.target.value as RequestStatus,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50 sm:max-w-xs"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <StatusBadge status={selectedRequest.status} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-white/10 p-6">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                disabled={saving}
                className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-[#CBD5E1] transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateRequestStatus}
                disabled={saving}
                className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
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
