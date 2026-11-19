import React from "react";
import { useInvoicesByStatus } from "./useInvoices";
import InvoiceWidget from "./InvoiceWidget";

const App: React.FC = () => {
  const {
    data: paidInvoices,
    isLoading: isPaidLoading,
    isError: isPaidError,
    error: paidError,
  } = useInvoicesByStatus({ params: { status: "unpaid" } });
  const {
    data: dueSoonInvoices,
    isLoading: isDueSoonLoading,
    isError: isDueSoonError,
    error: dueSoonError,
  } = useInvoicesByStatus({ params: { status: "unpaid" } });
  const {
    data: unpaidInvoices,
    isLoading: isUnpaidLoading,
    isError: isUnpaidError,
    error: unpaidError,
  } = useInvoicesByStatus({ params: { status: "unpaid" } });

  const isLoading = isPaidLoading || isDueSoonLoading || isUnpaidLoading;
  const isError = isPaidError || isDueSoonError || isUnpaidError;
  const error = paidError || dueSoonError || unpaidError;

  if (isLoading) return <div>Loading invoices...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!paidInvoices && !dueSoonInvoices && !unpaidInvoices)
    return <div>No invoices found.</div>;
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <InvoiceWidget
          title="Paid Invoice"
          color="green"
          invoices={paidInvoices ?? []}
        />
        <InvoiceWidget
          title="Due Soon"
          color="orange"
          invoices={dueSoonInvoices ?? []}
        />
        <InvoiceWidget
          title="Waiting for Payment"
          color="red"
          invoices={unpaidInvoices ?? []}
        />
      </div>
    </>
  );
};

export default App;
