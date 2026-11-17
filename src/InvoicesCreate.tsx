import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "./Button";
import type { CreateInvoiceInput } from "./types";
import { useInvoicesByTenantId, useInvoicesCreate } from "./useInvoices";
import { useTenants } from "./useTenants";

const INPUT_CLASSES =
  "block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm";
const LABEL_CLASSES = "block text-sm font-medium text-slate-700 mb-1";

type Tenant = {
  id: number;
  name: string;
  unit: number;
};

const App: React.FC = () => {
  const { data: tenants, isLoading, isError, error } = useTenants();
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();

  const [stateTenantId, setStateTenantId] = useState(tenantId ?? "");
  // null means "not edited yet", so the last invoice supplies the default
  const [prevDateInput, setPrevDate] = useState<string | null>(null);
  const [prevReadingInput, setPrevReading] = useState<string | null>(null);
  const [currDate, setCurrDate] = useState("");
  const [currReading, setCurrReading] = useState("");
  const createInvoice = useInvoicesCreate();

  const {
    data: invoices,
    isLoading: isInvoicesLoading,
    isError: isInvoicesError,
    error: invoicesError,
  } = useInvoicesByTenantId(Number(stateTenantId));

  if (isLoading || isInvoicesLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (isInvoicesError) return <div>Error: {invoicesError.message}</div>;

  const lastInvoice = invoices?.at(-1);
  const prevDate = prevDateInput ?? lastInvoice?.curr_date?.slice(0, 10) ?? "";
  const prevReading =
    prevReadingInput ?? (lastInvoice ? String(lastInvoice.curr_reading) : "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: CreateInvoiceInput = {
      tenant_id: Number(stateTenantId),
      prev_date: prevDate,
      prev_reading: Number(prevReading),
      curr_date: currDate,
      curr_reading: Number(currReading),
    };

    createInvoice.mutate(payload, {
      onSuccess: () => navigate(`/tenants/${payload.tenant_id}/invoices`),
    });
  };

  return (
    <>
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-3xl">New Invoice</h1>
      </div>

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
                setPrevDate(null);
                setPrevReading(null);
              }}
              disabled={createInvoice.isPending}
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
              value={prevDate}
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
              onChange={(e) => setPrevReading(e.target.value)}
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
              value={currDate}
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
              onChange={(e) => setCurrReading(e.target.value)}
              className={INPUT_CLASSES}
            />
          </div>

          {createInvoice.isError && (
            <p role="alert" className="text-sm text-red-600">
              Could not create invoice: {createInvoice.error.message}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={createInvoice.isPending}
          >
            {createInvoice.isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default App;
