import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { InvoiceFormData } from "./types";
import { useInvoicesCreate } from "./useInvoices";
import InvoiceForm from "./InvoiceForm";

const App: React.FC = () => {
  const navigate = useNavigate();
  const createInvoice = useInvoicesCreate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (payload: InvoiceFormData) => {
    setIsSubmitting(true);

    createInvoice.mutate(payload, {
      onSuccess: () => {
        setIsSubmitting(false);
        navigate(`/tenants/${payload.tenant_id}/invoices`);
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-3xl">New Invoice</h1>
      </div>

      <InvoiceForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Create"
      />
    </>
  );
};

export default App;
