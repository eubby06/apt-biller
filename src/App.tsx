import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import Tenants from "./Tenants";
import TenantsCreate from "./TenantsCreate";
import TenantsEdit from "./TenantsEdit";
import Invoices from "./Invoices";
import InvoicesCreate from "./InvoicesCreate";
import InvoicesId from "./InvoicesId";
import Login from "./Login";
import Dashboard from "./Dashboard";

import { ProtectedRoute } from "./ProtectedRoute";

// 1. Define your routing tree structure
const router = createBrowserRouter([
  // Public route (accessible without login)
  {
    path: "/login",
    element: <Login />,
  },

  // Protected routes wrapper
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: (
          <Layout>
            <Outlet />
          </Layout>
        ), // Layout is nested INSIDE the router frame here
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "tenants",
            element: <Tenants />,
          },
          {
            path: "tenants/create",
            element: <TenantsCreate />,
          },
          {
            path: "tenants/:tenantId/edit",
            element: <TenantsEdit />,
          },
          {
            path: "tenants/:tenantId/invoices",
            element: <Invoices />,
          },
          {
            path: "tenants/:tenantId/invoices/create",
            element: <InvoicesCreate />,
          },
          {
            path: "tenants/:tenantId/invoices/:invoiceId",
            element: <InvoicesId />,
          },
        ],
      },
    ],
  },
]);

// 2. Deliver the application bounded inside the provider wrapper
const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
