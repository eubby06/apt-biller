import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { InvoiceFormData } from "./types";
import { useInvoicesUpdate, useInvoicesById } from "./useInvoices";
import InvoiceForm from "./InvoiceForm";

export default function InvoicesId() {
  const navigate = useNavigate();
  const updateInvoice = useInvoicesUpdate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const {
    data: invoice,
    isLoading,
    isError,
    error,
  } = useInvoicesById(Number(invoiceId));

  if (isLoading) return <div>Loading invoice...</div>;
  if (isError)
    return <div role="alert">Error loading tenant: {error.message}</div>;
  if (!invoice) return <div role="alert">Tenant not found.</div>;

  const initialData: InvoiceFormData = {
    id: invoice.id,
    tenant_id: invoice.tenant_id,
    prev_date: invoice.prev_date,
    prev_reading: invoice.prev_reading,
    curr_date: invoice.curr_date,
    curr_reading: invoice.curr_reading,
    status: invoice.status,
  };

  const handleSubmit = (payload: InvoiceFormData) => {
    setIsSubmitting(true);

    updateInvoice.mutate(payload, {
      onSuccess: () => {
        navigate(`/tenants/${payload.tenant_id}/invoices`);
        setIsSubmitting(false);
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-3xl">Updating Invoice</h1>
      </div>

      <InvoiceForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Update"
      />
    </>
  );
}
