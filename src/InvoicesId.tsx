import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInvoicesById } from "./useInvoices";
import { useTenantsById } from "./useTenants";
import Button from "./Button";

const App: React.FC = () => {
  const { tenantId, invoiceId } = useParams<{
    tenantId: string;
    invoiceId: string;
  }>();

  const {
    data: tenant,
    isLoading: isTenantLoading,
    isError: isTenantError,
    error: tenantError,
  } = useTenantsById(Number(tenantId));

  const {
    data: invoice,
    isLoading: isInvoiceLoading,
    isError: isInvoiceError,
    error: invoiceError,
  } = useInvoicesById(Number(invoiceId));

  const navigate = useNavigate();

  if (isInvoiceLoading) return <div>Loading...</div>;
  if (isInvoiceError) return <div>Error: {invoiceError.message}</div>;
  if (!invoice) return <div>Invoice not found.</div>;

  if (isTenantLoading) return <div>Loading...</div>;
  if (isTenantError) return <div>Error: {tenantError.message}</div>;
  if (!tenant) return <div>Tenant not found.</div>;

  return (
    <>
      <div className="flex items-center justify-between pb-3">
        <div>
          <h1 className="text-3xl">Edit</h1>
        </div>

        <Button
          onClick={() => {
            navigate(`/tenants/${tenant.id}/invoices`);
          }}
          variant="primary"
        >
          Back
        </Button>
      </div>

      <div className="w-full mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
        Hi {tenant.name}, mao ni ang bills for this month:{" "}
        {invoice.electricity_amount}(
        {invoice.curr_reading - invoice.prev_reading}kwh),{" "}
        {invoice.water_amount}(water), 6000(rent), 500(net) and total is{" "}
        {invoice.total}. Thanks.
      </div>
    </>
  );
};

export default App;
