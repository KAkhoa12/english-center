import type { InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  Icon: LucideIcon;
};

export const AuthInput = ({ label, Icon, ...props }: AuthInputProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </span>
      <span className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 transition-all focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]">
        <Icon className="h-5 w-5 shrink-0 text-gray-400" />
        <input
          {...props}
          className="w-full border-none bg-transparent p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:shadow-none"
        />
      </span>
    </label>
  );
};
