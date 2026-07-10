import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CourseTitleCtaProps {
  title: string;
  name: string;
  description: string;
  titleLink: string;
  link: string;
}

export default function CourseTitleCta({ title, name, description, titleLink, link }: CourseTitleCtaProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-line pb-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{name}</p>
        <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{description}</p>
      </div>
      <Link
        to={link}
        className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-hover-line hover:bg-surface-soft"
      >
        {titleLink}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
