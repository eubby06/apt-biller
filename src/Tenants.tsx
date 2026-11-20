import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useTenants, useTenantsRemove } from "./useTenants";
import type { Tenant } from "./types";
import { isAlmostDue, formatMonthDay } from "./dueDate";

const App: React.FC = () => {
  const { data: tenants, isLoading, isError, error } = useTenants();
  const navigation = useNavigate();
  const removeTenant = useTenantsRemove();
  const showInvoices = (id: number) => {
    navigation(`/tenants/${id}/invoices`);
  };

  const newTenant = () => {
    navigation("/tenants/create");
  };

  const deleteTenant = (tenantId: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Tenant #${tenantId}?`,
    );

    if (confirmed) {
      removeTenant.mutate(tenantId, {
        onSuccess: () => {
          return navigation(`/tenants`);
        },
      });
    }
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="flex items-center justify-between pb-3">
        <div>
          <h1 className="text-3xl">Tenants</h1>
        </div>

        <Button onClick={newTenant} variant="primary">
          New Tenant
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
                  Name
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Unit #
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants?.map((tenant: Tenant) => {
                const almostDue = isAlmostDue(tenant.move_in_date);
                return (
                  <tr
                    key={tenant.id}
                    className="hover:bg-slate-50/70 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {tenant.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {tenant.name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {tenant.unit}
                    </td>
                    <td
                      className={`px-6 py-4 font-semibold ${
                        almostDue ? "text-red-600" : "text-slate-900"
                      }`}
                    >
                      {almostDue === null
                        ? `Invalid due date: ${tenant.move_in_date}`
                        : formatMonthDay(tenant.move_in_date)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          if (tenant.id !== undefined) {
                            showInvoices(tenant.id);
                          }
                        }}
                        className="px-2 text-sm font-semibold text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        Invoices
                      </button>
                      <button
                        onClick={() => {
                          navigation(`/tenants/${tenant.id}/edit`);
                        }}
                        className="px-2 text-sm font-semibold text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          deleteTenant(Number(tenant.id));
                        }}
                        className="px-2 text-sm font-semibold text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default App;
