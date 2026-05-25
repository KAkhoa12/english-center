type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  highlight: string;
  suffix?: string;
  description?: string;
  badgeClassName?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  suffix,
  description,
  badgeClassName = "bg-brand-50",
}: SectionHeadingProps) {
  return (
    <div className="fade-up mx-auto mb-16 max-w-3xl text-center">
      <span
        className={`mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-500 ${badgeClassName}`}
      >
        {eyebrow}
      </span>
      <h2 className="text-3xl font-bold leading-[0.95] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
        {title}{" "}
        <span className="gradient-text font-serif-display font-normal italic">
          {highlight}
        </span>
        {suffix ? ` ${suffix}` : null}
      </h2>
      {description ? (
        <p className="mt-6 text-lg leading-relaxed text-gray-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}
