import type { ButtonHTMLAttributes, ReactNode } from "react";

type SocialAuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  children: ReactNode;
};

export const SocialAuthButton = ({
  icon,
  children,
  ...props
}: SocialAuthButtonProps) => {
  return (
    <button
      type="button"
      {...props}
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
    >
      {icon}
      {children}
    </button>
  );
};
