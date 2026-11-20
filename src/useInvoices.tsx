import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import type { InvoiceFormData, Invoice } from "./types";

export function useInvoicesByTenantId(id: number) {
  return useQuery({
    // 1. Add the id to the queryKey array so TanStack tracks it uniquely per user
    queryKey: ["invoicesByTenant", id],

    // 2. Pass the id into your Axios URL
    queryFn: async (): Promise<Invoice[]> => {
      const response = await api.get("/invoices", {
        params: { tenant_id: id },
      });
      return response.data.data;
    },

    staleTime: 1000 * 60 * 5, // Cache individual profiles for 5 minutes

    // 3. Optional: Prevent the query from running if the id is missing/undefined
    enabled: !!id,
  });
}

export function useInvoicesById(id: number) {
  return useQuery({
    // 1. Add the id to the queryKey array so TanStack tracks it uniquely per user
    queryKey: ["invoicesId", id],

    // 2. Pass the id into your Axios URL
    queryFn: async (): Promise<Invoice> => {
      const response = await api.get(`/invoices/${id}`);
      return response.data.data;
    },

    staleTime: 1000 * 60 * 5, // Cache individual profiles for 5 minutes

    // 3. Optional: Prevent the query from running if the id is missing/undefined
    enabled: !!id,
  });
}

export function useInvoicesRemove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceId: number): Promise<void> => {
      await api.delete(`/invoices/${invoiceId}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invoicesByTenant"] });
      void queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useInvoicesCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoice: InvoiceFormData): Promise<void> => {
      await api.post("/invoices", invoice);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invoicesByTenant"] });
    },
  });
}

export function useInvoicesUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoice: InvoiceFormData): Promise<void> => {
      await api.put(`/invoices/${invoice.id}`, invoice);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invoicesByTenant"] });
    },
  });
}

export function useInvoicesByStatus({
  params,
}: {
  params: { status: string };
}) {
  return useQuery({
    queryKey: ["unpaidInvoices"],
    queryFn: async (): Promise<Invoice[]> => {
      const response = await api.get("/invoices", {
        params: params,
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
