import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post<unknown>("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      const data = response.data;
      if (
        typeof data !== "object" ||
        data === null ||
        !("token" in data) ||
        typeof data.token !== "string" ||
        data.token.length === 0
      ) {
        throw new Error("Login response did not contain a valid token.");
      }

      localStorage.setItem("token", data.token);
    },
    onSuccess: () => {
      queryClient.removeQueries();
      navigate("/", { replace: true });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded bg-white p-6 shadow"
        >
          <h2 className="mb-4 text-xl font-bold">Sign In</h2>

          {/* Error Message */}
          {loginMutation.isError && (
            <div role="alert" className="mb-4 rounded bg-red-100 p-2 text-sm text-red-700">
              {axios.isAxiosError(loginMutation.error)
                ? loginMutation.error.response?.status === 401
                  ? "Invalid email or password."
                  : "Unable to sign in. Please try again."
                : loginMutation.error.message}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loginMutation.isPending ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
}
