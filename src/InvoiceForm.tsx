import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { InvoiceFormData, Tenant } from "./types";
import { useTenants } from "./useTenants";
import { useInvoicesByTenantId } from "./useInvoices";
import Button from "./Button";

const INPUT_CLASSES =
  "block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm";
const LABEL_CLASSES = "block text-sm font-medium text-slate-700 mb-1";

interface InvoiceFormProps {
  initialData?: InvoiceFormData;
  onSubmit: (data: InvoiceFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export default function InvoiceForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = "save",
}: InvoiceFormProps) {
  const { data: tenants, isLoading, isError, error } = useTenants();
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigation = useNavigate();
  const {
    data: invoices,
    isLoading: isInvoicesLoading,
    isError: isInvoicesError,
    error: invoicesError,
  } = useInvoicesByTenantId(Number(tenantId));

  const lastInvoice = invoices?.at(-1);
  const prevDateInput =
    initialData?.prev_date ?? lastInvoice?.curr_date?.slice(0, 10) ?? "";
  const prevReadingInput =
    initialData?.prev_reading ??
    (lastInvoice ? String(lastInvoice.curr_reading) : "");
  const invoiceId = initialData?.id ?? null;
  const [stateTenantId, setStateTenantId] = useState(tenantId);
  const [status, setStatus] = useState("unpaid");
  const [prevDate, setPrevDate] = useState(prevDateInput);
  const [prevReading, setPrevReading] = useState(prevReadingInput);
  const [currDate, setCurrDate] = useState(initialData?.curr_date ?? null);
  const [currReading, setCurrReading] = useState(
    initialData?.curr_reading ?? 0,
  );

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      id: Number(invoiceId),
      tenant_id: Number(stateTenantId),
      prev_date: prevDate,
      prev_reading: Number(prevReading),
      curr_date: currDate,
      curr_reading: Number(currReading),
      status: status,
    });
  };

  if (isLoading || isInvoicesLoading || isSubmitting)
    return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (isInvoicesError) return <div>Error: {invoicesError.message}</div>;
  return (
    <>
      <div className="w-full mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <div>
            <label htmlFor="tenant" className={LABEL_CLASSES}>
              Tenant
            </label>
            <select
              id="tenant"
              required
              value={stateTenantId}
              onChange={(e) => {
                setStateTenantId(e.target.value);
                setPrevDate("");
                setPrevReading(0);
              }}
              disabled={isSubmitting || !!initialData?.tenant_id}
              className={INPUT_CLASSES}
            >
              <option value="" disabled>
                Select a tenant
              </option>
              {tenants.map((tenant: Tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} (Unit {tenant.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="prev_date" className={LABEL_CLASSES}>
              Previous Date
            </label>
            <input
              id="prev_date"
              type="date"
              required
              value={prevDate ?? ""}
              onChange={(e) => setPrevDate(e.target.value)}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label htmlFor="prev_reading" className={LABEL_CLASSES}>
              Previous Reading
            </label>
            <input
              id="prev_reading"
              type="number"
              min="0"
              required
              value={prevReading}
              onChange={(e) => setPrevReading(Number(e.target.value))}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label htmlFor="curr_date" className={LABEL_CLASSES}>
              Current Date
            </label>
            <input
              id="curr_date"
              type="date"
              required
              min={prevDate || undefined}
              value={currDate ?? ""}
              onChange={(e) => setCurrDate(e.target.value)}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label htmlFor="curr_reading" className={LABEL_CLASSES}>
              Current Reading
            </label>
            <input
              id="curr_reading"
              type="number"
              min={prevReading || "0"}
              required
              value={currReading}
              onChange={(e) => setCurrReading(Number(e.target.value))}
              className={INPUT_CLASSES}
            />
          </div>

          <div>
            <label htmlFor="tenant" className={LABEL_CLASSES}>
              Status
            </label>
            <select
              id="tenant"
              required
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              disabled={isSubmitting}
              className={INPUT_CLASSES}
            >
              <option value="" disabled>
                Select a tenant
              </option>
              {["paid", "unpaid"].map((status: string) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-row gap-4">
            <Button
              type="button"
              onClick={() => {
                navigation(`/tenants/${stateTenantId}/invoices`);
              }}
              className="w-full"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
