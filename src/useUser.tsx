import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useUser() {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["user", token],
    queryFn: async () => {
      const res = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
    retry: false, // Don't retry if it fails (401)
    staleTime: 1000 * 60 * 10, // Cache for 10 mins
  });
}
