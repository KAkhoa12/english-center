import type { ReactNode } from "react";

type AuthCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export const AuthCard = ({
  eyebrow,
  title,
  description,
  children,
}: AuthCardProps) => {
  return (
    <section className="w-full max-w-md rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-950/5 sm:p-8">
      <div className="mb-8">
        <span className="mb-4 inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-600">
          {eyebrow}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-950">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
};
