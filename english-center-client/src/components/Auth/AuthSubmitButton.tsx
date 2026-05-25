import type { ButtonHTMLAttributes, ReactNode } from "react";

type AuthSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const AuthSubmitButton = ({
  children,
  ...props
}: AuthSubmitButtonProps) => {
  return (
    <button
      type="submit"
      {...props}
      className="course-badge flex w-full items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-brand-500/40 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {children}
    </button>
  );
};
