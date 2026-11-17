import React from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "./useAuth";

interface LayoutProps {
  children: ReactNode;
}

const Sidebar: React.FC = () => {
  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-300 md:fixed md:top-16 md:bottom-0 md:left-0 overflow-y-auto border-r border-slate-800">
      <div className="p-4 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </p>
        <nav className="flex flex-col gap-1">
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition"
          >
            Dashboard
          </Link>
          <Link
            to="/tenants"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white transition"
          >
            Tenants
          </Link>
        </nav>
      </div>
    </aside>
  );
};

const Header: React.FC = () => {
  const logout = useLogout();

  return (
    <header className="bg-white border-b border-slate-200 h-16 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
          A
        </div>
        <span className="font-bold text-lg text-slate-900">
          APT Billing App
        </span>
      </div>
      <div className="flex items-center gap-4">
        {logout.isError && (
          <span role="alert" className="text-sm text-red-600">
            Unable to log out. Please try again.
          </span>
        )}
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="cursor-pointer text-sm font-medium text-slate-600 hover:text-indigo-600 disabled:opacity-50"
        >
          {logout.isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
      <p>&copy; {new Date().getFullYear()} AppShell. All rights reserved.</p>
    </footer>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <Header />

      {/* Wrapper for Sidebar + Main Area */}
      <div className="flex flex-col md:flex-row flex-grow pt-16">
        <Sidebar />

        {/* Main content adjusts left margin on desktop to clear the fixed sidebar */}
        <div className="flex flex-col flex-grow md:pl-64">
          <main className="flex-grow p-6 max-w-7xl w-full mx-auto">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
