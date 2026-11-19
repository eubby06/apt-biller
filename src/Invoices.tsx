import React from "react";
import Button from "./Button";
import { useNavigate, useParams } from "react-router-dom";
import { useInvoicesByTenantId } from "./useInvoices";
import type { Invoice } from "./types";
import FormatTimestamp from "./FormatTimestamp";

const App: React.FC = () => {
  const navigate = useNavigate();

  const { tenantId } = useParams<{ tenantId: string }>();
  const newInvoice = () => {
    navigate(`/tenants/${tenantId}/invoices/create`);
  };

  const editInvoice = (invoiceId: number) => {
    navigate(`/tenants/${tenantId}/invoices/${invoiceId}`);
  };

  const {
    data: invoices,
    isLoading,
    isError,
    error,
  } = useInvoicesByTenantId(Number(tenantId));

  if (isLoading) return <div>Loading invoices...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!invoices) return <div>No invoices found.</div>;
  return (
    <>
      <div className="flex items-center justify-between pb-3">
        <div>
          <h1 className="text-3xl">Invoices</h1>
        </div>

        <Button onClick={newInvoice} variant="primary">
          New Invoice
        </Button>
      </div>

      <div className="w-full mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
        {/* 1. Responsive Scroll Container */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse bg-white text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  ID
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Prev Date
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Prev Reading
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Curr Date
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Curr Reading
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices?.map((invoice: Invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-slate-50/70 transition-colors duration-150 cursor-pointer"
                >
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    <FormatTimestamp timestamp={invoice.prev_date} />
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {invoice.prev_reading}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    <FormatTimestamp timestamp={invoice.curr_date} />
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {invoice.curr_reading}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {invoice.status}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => editInvoice(invoice.id)}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-900 transition-colors"
                    >
                      Send SMS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default App;
