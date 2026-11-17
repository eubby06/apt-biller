import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import type { TenantFormData, Tenant } from "./types";

export function useTenants() {
  return useQuery({
    // 1. The unique cache key for this specific API data
    queryKey: ["tenants"],

    // 2. The network request function (returns a Promise)
    queryFn: async () => {
      const response = await api.get("/tenants");
      return response.data.data;
    },

    // 3. Keep data "fresh" in cache for 5 minutes
    staleTime: 1000 * 60 * 5,
  });
}

export function useTenantsById(id: number) {
  return useQuery({
    // 1. Add the id to the queryKey array so TanStack tracks it uniquely per user
    queryKey: ["tenantId", id],

    // 2. Pass the id into your Axios URL
    queryFn: async (): Promise<Tenant> => {
      const response = await api.get(`/tenants/${id}`);
      return response.data.data;
    },

    staleTime: 1000 * 60 * 5, // Cache individual profiles for 5 minutes

    // 3. Optional: Prevent the query from running if the id is missing/undefined
    enabled: !!id,
  });
}

export function useTenantsCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tenant: TenantFormData): Promise<void> => {
      await api.post("/tenants", tenant);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
}
