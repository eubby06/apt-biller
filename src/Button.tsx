import React from "react";

// 1. Define your base classes and variants in clean, centralized objects
const BASE_STYLES =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 transition-all";

const VARIANTS = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600",
  secondary:
    "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:outline-indigo-600",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline-rose-600",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${BASE_STYLES} ${VARIANTS[variant]} ${className}`}
      {...props} // Automatically passes onClick, type, disabled, etc.
    >
      {children}
    </button>
  );
}
