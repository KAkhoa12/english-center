
import { cn } from "@/lib/utils";

// ───────── Shared pulse block ─────────

function Pulse({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-line-soft", className)}
    />
  );
}

// ───────── 1. Breadcrumb ─────────

export function SkeletonBreadcrumb() {
  return (
    <div className="pt-16">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-4 md:px-8">
        <div className="flex items-center gap-2">
          <Pulse className="h-3.5 w-12" />
          <Pulse className="h-3 w-3.5 rounded-full" />
          <Pulse className="h-3.5 w-16" />
          <Pulse className="h-3 w-3.5 rounded-full" />
          <Pulse className="h-3.5 w-20" />
          <Pulse className="h-3 w-3.5 rounded-full" />
          <Pulse className="h-3.5 w-28" />
        </div>
      </div>
    </div>
  );
}

// ───────── 2. Thumbnail ─────────

export function SkeletonCourseThumbnail() {
  return (
    <div className="relative overflow-hidden rounded-card">
      <Pulse className="w-full aspect-[16/10]" />
      {/* Badge placeholder */}
      <div className="absolute top-4 left-4">
        <Pulse className="h-6 w-24 rounded-pill" />
      </div>
    </div>
  );
}

// ───────── 3. Title block ─────────

export function SkeletonCourseTitle() {
  return (
    <div className="mb-4 space-y-3">
      <Pulse className="h-3.5 w-20" />
      <Pulse className="h-9 w-3/4" />
      <Pulse className="h-9 w-1/2" />
      <div className="space-y-2 pt-1">
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-5/6" />
        <Pulse className="h-4 w-2/3" />
      </div>
    </div>
  );
}

// ───────── 4. Metadata row ─────────

export function SkeletonCourseMeta() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-line py-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Pulse className="h-4 w-4 rounded-full" />
          <Pulse className={cn("h-3.5", i % 2 === 0 ? "w-24" : "w-28")} />
        </div>
      ))}
    </div>
  );
}

// ───────── 5. Tags ─────────

export function SkeletonCourseTags() {
  return (
    <div className="flex items-center gap-2 mb-8">
      <Pulse className="h-6 w-16 rounded-full" />
      <Pulse className="h-6 w-14 rounded-full" />
      <Pulse className="h-6 w-20 rounded-full" />
    </div>
  );
}

// ───────── 6. Tabs ─────────

export function SkeletonCourseTabs() {
  return (
    <div className="mb-8 border-b border-line">
      <div className="flex gap-6">
        <Pulse className="h-4 w-20 pb-3" />
        <Pulse className="h-4 w-28 pb-3" />
        <Pulse className="h-4 w-32 pb-3" />
      </div>
    </div>
  );
}

// ───────── 7. Tab content: Overview ─────────

export function SkeletonTabOverview() {
  return (
    <div className="space-y-8">
      {/* Section heading */}
      <div className="space-y-3">
        <Pulse className="h-6 w-40" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-4/5" />
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        <Pulse className="h-6 w-36" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Pulse className="h-5 w-5 shrink-0 rounded-full mt-0.5" />
            <Pulse className={cn("h-4 flex-1", i === 0 ? "w-full" : i === 1 ? "w-5/6" : i === 2 ? "w-4/5" : "w-3/4")} />
          </div>
        ))}
      </div>

      {/* Requirement box */}
      <div className="space-y-3">
        <Pulse className="h-6 w-32" />
        <Pulse className="h-20 w-full rounded-card" />
      </div>
    </div>
  );
}

// ───────── 8. Tab content: Curriculum ─────────

export function SkeletonTabCurriculum() {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Pulse className="h-6 w-48" />
        <Pulse className="h-3.5 w-32" />
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-card border border-line">
          {/* Section header */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Pulse className="h-3.5 w-14" />
              <Pulse className={cn("h-5 w-", i === 0 ? "36" : i === 1 ? "40" : "44")} />
            </div>
            <div className="flex items-center gap-3">
              <Pulse className="h-3 w-16" />
              <Pulse className="h-4 w-4 rounded-full" />
            </div>
          </div>
          {/* Lesson rows */}
          <div className="border-t border-line-soft">
            {Array.from({ length: i === 0 ? 4 : 5 }).map((_, j) => (
              <div
                key={j}
                className="flex items-center gap-3 border-b border-line-soft px-5 py-3.5 last:border-b-0"
              >
                <Pulse className="h-4 w-4 shrink-0 rounded-full" />
                <Pulse className={cn("h-4 flex-1", j % 2 === 0 ? "w-full" : "w-4/5")} />
                <Pulse className="h-3 w-10" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ───────── 9. Tab content: Outcomes ─────────

export function SkeletonTabOutcomes() {
  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <Pulse className="h-6 w-52" />
      </div>

      {/* Outcome grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-card bg-surface p-4">
            <Pulse className="h-5 w-5 shrink-0 rounded-full mt-0.5" />
            <div className="flex-1 space-y-2">
              <Pulse className={cn("h-4 w-", i === 0 ? "28" : i === 1 ? "32" : i === 2 ? "24" : "28")} />
              <Pulse className="h-3.5 w-full" />
              <Pulse className="h-3.5 w-4/5" />
            </div>
          </div>
        ))}
      </div>


      <div className="space-y-3">
        <Pulse className="h-6 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Pulse className="h-6 w-6 shrink-0 rounded-full mt-0.5" />
            <Pulse className={cn("h-4 flex-1", i === 0 ? "w-full" : i === 1 ? "w-5/6" : "w-3/4")} />
          </div>
        ))}
      </div>
    </div>
  );
}

type SkeletonSidebarProps = {
  mode?: "template" | "center";
};

export function SkeletonCourseSidebar({ mode = "template" }: SkeletonSidebarProps) {
  const isCenter = mode === "center";

  return (
    <div className="lg:sticky lg:top-24 space-y-4">
      <div className="rounded-card border border-line bg-white p-5 md:p-6">
        <div className="mb-5 space-y-1.5">
          <Pulse className="h-8 w-36" />
          <Pulse className="h-3.5 w-44" />
        </div>

        <Pulse
          className={cn(
            "mb-3 h-12 w-full rounded-pill",
            isCenter ? "bg-line-soft" : "bg-mint/20",
          )}
        />

        <Pulse className="mb-5 h-11 w-full rounded-pill" />

        <div className="space-y-3.5 border-t border-line pt-5">
          {Array.from({ length: isCenter ? 6 : 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Pulse className={cn("h-3.5 w-", i === 0 ? "16" : i === 1 ? "16" : i === 2 ? "20" : i === 3 ? "16" : i === 4 ? "14" : "16")} />
              <Pulse className={cn("h-3.5 w-", i === 0 ? "16" : i === 1 ? "8" : i === 2 ? "16" : i === 3 ? "16" : i === 4 ? "28" : "32")} />
            </div>
          ))}
        </div>
      </div>

      {isCenter ? (
        <div className="space-y-3">
          <div className="rounded-card bg-surface p-4">
            <div className="flex items-start gap-3">
              <Pulse className="h-5 w-5 shrink-0 rounded-full mt-0.5" />
              <div className="flex-1 space-y-1.5">
                <Pulse className="h-3.5 w-32" />
                <Pulse className="h-3 w-full" />
                <Pulse className="h-3 w-4/5" />
              </div>
            </div>
          </div>
          <div className="rounded-card bg-surface p-4">
            <div className="flex items-start gap-3">
              <Pulse className="h-5 w-5 shrink-0 rounded-full mt-0.5" />
              <div className="flex-1 space-y-1.5">
                <Pulse className="h-3.5 w-24" />
                <Pulse className="h-3 w-full" />
                <Pulse className="h-3 w-3/5" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-card bg-surface p-4">
          <div className="flex items-start gap-3">
            <Pulse className="h-5 w-5 shrink-0 rounded-full mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <Pulse className="h-3.5 w-28" />
              <Pulse className="h-3 w-full" />
              <Pulse className="h-3 w-4/5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type SkeletonMobileCTAProps = {
  mode?: "template" | "center";
};

export function SkeletonMobileCTA({ mode = "template" }: SkeletonMobileCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-white/95 p-4 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-[1280px] items-center gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <Pulse className="h-5 w-28" />
          <Pulse className="h-3 w-24" />
        </div>
        <Pulse
          className={cn(
            "h-12 w-36 shrink-0 rounded-pill",
            mode === "center" ? "bg-line-soft" : "bg-mint/20",
          )}
        />
      </div>
    </div>
  );
}

export function SkeletonRelatedCard() {
  return (
    <div className="overflow-hidden rounded-card border border-line">
      <Pulse className="w-full aspect-[16/10]" />
      <div className="space-y-2.5 p-4">
        <Pulse className="h-3 w-16" />
        <Pulse className="h-5 w-3/4" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-5/6" />
        <div className="flex items-center gap-3">
          <Pulse className="h-3 w-10" />
          <Pulse className="h-3 w-20" />
        </div>
        <Pulse className="h-5 w-28" />
      </div>
    </div>
  );
}

export function SkeletonRelatedCourses() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 pb-16 pt-4 md:px-8">
      <Pulse className="mb-6 h-6 w-40" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        <SkeletonRelatedCard />
        <SkeletonRelatedCard />
        <div className="hidden md:block">
          <SkeletonRelatedCard />
        </div>
      </div>
    </section>
  );
}

type SkeletonCourseDetailProps = {
  mode?: "template" | "center" | null;
};

export default function SkeletonCourseDetail({
  mode = null,
}: SkeletonCourseDetailProps) {
  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <SkeletonBreadcrumb />
      <section className="mx-auto w-full max-w-[1280px] px-5 pb-8 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3 space-y-0">
            <SkeletonCourseThumbnail />
            <SkeletonCourseTitle />
            <SkeletonCourseMeta />
            <SkeletonCourseTags />
            <SkeletonCourseTabs />
            <SkeletonTabOverview />
          </div>
          <div className="lg:col-span-2">
            <SkeletonCourseSidebar mode={mode ?? "template"} />
          </div>
        </div>
      </section>
      <SkeletonMobileCTA mode={mode ?? "template"} />
      <SkeletonRelatedCourses />
    </div>
  );
}
