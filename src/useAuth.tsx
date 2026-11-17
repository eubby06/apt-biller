import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/logout");
    },
    onSuccess: async () => {
      await queryClient.cancelQueries();
      localStorage.removeItem("token");
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
}
