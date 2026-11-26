import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import type { Settings } from "./types";
import { AxiosError } from "axios";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async (): Promise<Settings | null> => {
      const response = await api.get<{ data: Settings | null }>("/settings?tenant_id=0", {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
      });
      return response.status === 404 ? null : response.data.data;
    },
    retry: (failureCount, error: AxiosError) => {
      // Do not retry if the server returns 404 Not Found
      if (error.response?.status === 404) {
        return false;
      }
      // Otherwise, retry up to 3 times
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5, // Cache individual profiles for 5 minutes
  });
}

export function useSettingsCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Settings): Promise<void> => {
      const response = await api.post("/settings", payload);
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
