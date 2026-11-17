import React, { useState } from "react";
import type { TenantFormData } from "./types";
import { useNavigate, useParams } from "react-router-dom";
import { useTenantsCreate, useTenantsById } from "./useTenants";
import TenantForm from "./TenantForm";

const App: React.FC = () => {
  const navigate = useNavigate();
  const { tenantId } = useParams<{ tenantId: string }>();
  const createTenant = useTenantsCreate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parsedTenantId = Number(tenantId);
  const {
    data: tenant,
    isLoading,
    isError,
    error,
  } = useTenantsById(parsedTenantId);

  if (!Number.isInteger(parsedTenantId) || parsedTenantId <= 0) {
    return <div role="alert">Invalid tenant ID.</div>;
  }
  if (isLoading) return <div>Loading tenant...</div>;
  if (isError)
    return <div role="alert">Error loading tenant: {error.message}</div>;
  if (!tenant) return <div role="alert">Tenant not found.</div>;

  const initialData: TenantFormData = {
    id: tenant.id,
    name: tenant.name,
    unit: Number(tenant.unit),
    move_in_date: tenant.move_in_date?.slice(0, 10) ?? "",
    total_heads: tenant.total_heads,
    rent_amount: tenant.rent_amount,
    internet_plan: tenant.internet_plan,
  };

  const handleSubmit = (payload: TenantFormData) => {
    setIsSubmitting(true);
    createTenant.mutate(payload, {
      onSuccess: () => {
        setIsSubmitting(false);
        navigate(`/tenants`);
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-3xl">Edit Tenant</h1>
      </div>

      <TenantForm
        key={parsedTenantId}
        initialData={initialData}
        isSubmitting={isSubmitting}
        submitLabel="Update"
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default App;
