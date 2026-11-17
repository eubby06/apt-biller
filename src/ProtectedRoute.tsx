import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useUser } from "./useUser";

export function ProtectedRoute() {
  const { data: user, isLoading, isError, error, refetch } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (isError && !(axios.isAxiosError(error) && error.response?.status === 401)) {
    return (
      <div role="alert">
        Unable to verify your session.{" "}
        <button type="button" onClick={() => void refetch()}>
          Try again
        </button>
      </div>
    );
  }
  if (isError) return <Navigate to="/login" replace />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
