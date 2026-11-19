import type { Invoice } from "./types";
import { useNavigate } from "react-router-dom";

interface InvoiceWidgetProps {
  invoices: Invoice[];
  title: string;
  color: string;
}

export default function InvoiceWidget({
  invoices,
  title,
  color,
}: InvoiceWidgetProps) {
  const headingStyle = `text-2xl sm:text-3xl font-bold tracking-tight text-red-50 mb-2 border-b-1 border-${color}-200 pb-2`;
  const tableStyle = `w-full text-left border-collapse text-${color}-200`;
  const wrapperStyle = `bg-${color}-500 flex-1 rounded-md p-6`;

  const navigation = useNavigate();

  return (
    <>
      <div className={wrapperStyle}>
        <h1 className={headingStyle}>{title}</h1>
        <table className={tableStyle}>
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Amount Due</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice: Invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.tenant?.name}</td>
                <td>{invoice.total}</td>
                <td>
                  <button
                    onClick={() => {
                      navigation(
                        `/tenants/${invoice.tenant?.id}/invoices/${invoice.id}`,
                      );
                    }}
                  >
                    view
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
