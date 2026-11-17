import React, { useState } from "react";
import type { TenantFormData } from "./types";
import { useNavigate } from "react-router-dom";
import { useTenantsCreate } from "./useTenants";
import TenantForm from "./TenantForm";

const App: React.FC = () => {
  const navigate = useNavigate();
  const createTenant = useTenantsCreate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        <h1 className="text-3xl">New Tenant</h1>
      </div>

      <TenantForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Create"
      />
    </>
  );
};

export default App;
