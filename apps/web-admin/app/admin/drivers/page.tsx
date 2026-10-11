"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  adminApi,
  ApiDriverItem,
  IdentityStatus,
} from "@/lib/api/admin";

function getStatusClasses(status: IdentityStatus) {
  switch (status) {
    case "ACTIVE":
      return "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "PENDING":
      return "border border-amber-400/20 bg-amber-400/10 text-amber-300";
    case "DEACTIVE":
    default:
      return "border border-red-400/20 bg-red-400/10 text-red-300";
  }
}

function StatusBadge({ status }: { status: IdentityStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
        status,
      )}`}
    >
      {status === "ACTIVE"
        ? "Active"
        : status === "PENDING"
        ? "Pending"
        : "Deactive"}
    </span>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
        {label}
      </p>
      <p className="break-words text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function DocumentPreview({
  label,
  image,
  onClick,
}: {
  label: string;
  image: string | null;
  onClick: () => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
        {label}
      </p>

      {image ? (
        <button
          type="button"
          onClick={onClick}
          className="group relative block h-32 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0F172A] text-left transition hover:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        >
          <img
            src={image}
            alt={label}
            className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
          />

          <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-sm font-medium text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
            Click to enlarge
          </span>
        </button>
      ) : (
        <div className="flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0F172A] p-4 text-center">
          <p className="text-xs text-[#64748B]">No {label} uploaded</p>
        </div>
      )}
    </div>
  );
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<ApiDriverItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDriver, setSelectedDriver] = useState<ApiDriverItem | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<IdentityStatus>("PENDING");
  const [saving, setSaving] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getDrivers();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const msg = err?.message || "Failed to load drivers.";
      setError(msg);
      setToast({
        type: "error",
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  const openDriverDetails = (driver: ApiDriverItem) => {
    setSelectedDriver(driver);
    setSelectedStatus(driver.status);
  };

  const closeDriverDetails = () => {
    if (saving) return;
    setSelectedDriver(null);
  };

  // 17. Update Driver Status
  const handleSaveChanges = async () => {
    if (!selectedDriver || saving) return;

    try {
      setSaving(true);

      const targetId = selectedDriver.identityId || selectedDriver.id;
      await adminApi.updateDriverStatus(targetId, selectedStatus);

      // Update local state
      setDrivers((currentDrivers) =>
        currentDrivers.map((driver) =>
          driver.id === selectedDriver.id
            ? {
                ...driver,
                status: selectedStatus,
              }
            : driver
        )
      );

      setSelectedDriver(null);
      setToast({
        type: "success",
        message: "Driver status updated successfully.",
      });
    } catch (err: any) {
      setToast({
        type: "error",
        message:
          err?.message || "Failed to update driver status. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatVehicleType = (type?: string) => {
    if (!type) return "Standard";
    return type.replace(/_/g, " ");
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white lg:pl-64">
      <AdminSidebar />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#A78BFA]">
            Admin Panel
          </p>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Drivers Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[#94A3B8]">
                Review registered towing drivers, inspect documents, and manage
                operational accounts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadDrivers}
                disabled={loading}
                className="rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-[#CBD5E1] transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white disabled:opacity-50"
              >
                {loading ? "Refreshing..." : "↻ Refresh"}
              </button>

              <div className="rounded-xl border border-white/10 bg-[#111827] px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-[#94A3B8]">
                  Total Drivers
                </p>
                <p className="mt-1 text-xl font-bold text-white">
                  {drivers.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <span>{error}</span>
            <button
              onClick={loadDrivers}
              className="font-medium underline hover:text-red-200"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-2xl shadow-black/10">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <h2 className="text-lg font-semibold text-white">
              Drivers Overview
            </h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Review registered drivers and update operational status.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center px-6">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                <p className="mt-3 text-sm text-[#94A3B8]">
                  Loading drivers from API...
                </p>
              </div>
            </div>
          ) : drivers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-lg font-semibold text-white">
                No drivers found
              </p>
              <p className="mt-2 text-sm text-[#94A3B8]">
                There are currently no drivers registered in the system.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="border-b border-white/10 bg-white/[0.02]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Driver
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Email
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Vehicle No.
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Vehicle Type
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Duty
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {drivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className="transition hover:bg-white/[0.025]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {driver.profile ? (
                            <img
                              src={driver.profile}
                              alt={driver.name}
                              className="h-10 w-10 rounded-full border border-white/10 object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10 font-bold text-violet-300">
                              {(driver.name || "D").charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-white">
                              {driver.name}
                            </p>
                            <p className="mt-0.5 text-xs text-[#64748B]">
                              ID: {driver.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-[#CBD5E1]">
                        {driver.phone}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#CBD5E1]">
                        {driver.email}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={driver.status} />
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {driver.vehicleNumber || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm capitalize text-[#CBD5E1]">
                        {formatVehicleType(driver.vehicleType)}
                      </td>

                      <td className="px-6 py-4 text-xs font-semibold text-slate-300">
                        {driver.dutyStatus || "OFFLINE"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => openDriverDetails(driver)}
                          className="inline-flex items-center rounded-lg border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-300 transition hover:border-violet-400/40 hover:bg-violet-400/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Success / Error Toast */}
      {toast && (
        <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm">
          <div
            className={`rounded-xl border px-4 py-4 shadow-2xl backdrop-blur ${
              toast.type === "success"
                ? "border-emerald-400/20 bg-[#064E3B]/95"
                : "border-red-400/20 bg-[#450A0A]/95"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  toast.type === "success"
                    ? "bg-emerald-400/20 text-emerald-300"
                    : "bg-red-400/20 text-red-300"
                }`}
              >
                {toast.type === "success" ? "✓" : "!"}
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {toast.type === "success" ? "Success" : "Error"}
                </p>
                <p className="mt-1 text-sm text-white/70">{toast.message}</p>
              </div>

              <button
                type="button"
                onClick={() => setToast(null)}
                className="ml-auto text-lg leading-none text-white/50 transition hover:text-white"
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Details Modal */}
      {selectedDriver && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="driver-details-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              closeDriverDetails();
            }
          }}
        >
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#A78BFA]">
                  Driver Management
                </p>
                <h2
                  id="driver-details-title"
                  className="mt-1 text-xl font-bold text-white"
                >
                  {selectedDriver.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeDriverDetails}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-[#94A3B8] transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto px-5 py-6 sm:px-6">
              <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
                {/* Profile */}
                <div className="flex flex-col items-center">
                  {selectedDriver.profile ? (
                    <img
                      src={selectedDriver.profile}
                      alt={selectedDriver.name}
                      className="h-32 w-32 rounded-2xl border border-white/10 object-cover shadow-lg"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-white/10 bg-violet-500/10 text-4xl font-bold text-violet-300">
                      {(selectedDriver.name || "D").charAt(0).toUpperCase()}
                    </div>
                  )}

                  <p className="mt-3 text-sm font-semibold text-white">
                    {selectedDriver.name}
                  </p>
                  <p className="mt-1 break-all text-center font-mono text-[11px] text-[#64748B]">
                    ID: {selectedDriver.id}
                  </p>
                </div>

                {/* Driver Information */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <DetailField
                    label="Full Name"
                    value={selectedDriver.name || "-"}
                  />
                  <DetailField
                    label="Email Address"
                    value={selectedDriver.email || "-"}
                  />
                  <DetailField
                    label="Phone Number"
                    value={selectedDriver.phone || "-"}
                  />
                  <DetailField
                    label="Identity ID"
                    value={selectedDriver.identityId || "-"}
                  />
                  <DetailField
                    label="Vehicle Type"
                    value={formatVehicleType(selectedDriver.vehicleType)}
                  />
                  <DetailField
                    label="Vehicle Number"
                    value={selectedDriver.vehicleNumber || "-"}
                  />
                  <DetailField
                    label="Duty Status"
                    value={selectedDriver.dutyStatus || "OFFLINE"}
                  />
                  <DetailField
                    label="Earnings"
                    value={`Rs. ${selectedDriver.earnings || 0}`}
                  />
                  <DetailField
                    label="Accepted Requests"
                    value={String(selectedDriver.serviceReqAcc || 0)}
                  />
                  <DetailField
                    label="Rejected Requests"
                    value={String(selectedDriver.serviceReqRej || 0)}
                  />
                </div>
              </div>

              {/* Account Status Update (API 17) */}
              <div className="mt-8 rounded-xl border border-violet-500/20 bg-[#0F172A] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Update Account Status (API 17)
                    </h3>
                    <p className="mt-1 text-xs text-[#94A3B8]">
                      Change the driver&apos;s identity status in the system.
                    </p>
                  </div>

                  <div className="w-full sm:w-56">
                    <select
                      value={selectedStatus}
                      onChange={(event) =>
                        setSelectedStatus(
                          event.target.value as IdentityStatus
                        )
                      }
                      disabled={saving}
                      className="w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2.5 text-sm font-medium text-white outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="PENDING">Pending (PENDING)</option>
                      <option value="ACTIVE">Active / Approve (ACTIVE)</option>
                      <option value="DEACTIVE">Deactivate (DEACTIVE)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="mt-8">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white">
                    Driver Documents
                  </h3>
                  <p className="mt-1 text-xs text-[#64748B]">
                    Click any document to inspect it in full resolution.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <DocumentPreview
                    label="CNIC"
                    image={selectedDriver.cnic}
                    onClick={() => {
                      if (selectedDriver.cnic) setLightboxImage(selectedDriver.cnic);
                    }}
                  />

                  <DocumentPreview
                    label="Driving License"
                    image={selectedDriver.license}
                    onClick={() => {
                      if (selectedDriver.license)
                        setLightboxImage(selectedDriver.license);
                    }}
                  />

                  <DocumentPreview
                    label="Vehicle Papers"
                    image={selectedDriver.vehiclePaper}
                    onClick={() => {
                      if (selectedDriver.vehiclePaper)
                        setLightboxImage(selectedDriver.vehiclePaper);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-[#0F172A]/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closeDriverDetails}
                disabled={saving}
                className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-semibold text-[#CBD5E1] transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving changes...
                  </>
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            aria-label="Close image preview"
          >
            ×
          </button>

          <img
            src={lightboxImage}
            alt="Document preview"
            className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
