import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { InvoiceFormData } from "./types";
import { useInvoicesCreate } from "./useInvoices";
import InvoiceForm from "./InvoiceForm";

export default function InvoicesId() {
  const navigate = useNavigate();
  const createInvoice = useInvoicesCreate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (payload: InvoiceFormData) => {
    setIsSubmitting(true);

    createInvoice.mutate(payload, {
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
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Update"
      />
    </>
  );
}
