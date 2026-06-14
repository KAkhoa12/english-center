import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ClassSession } from "@/services/classSessions/classSessions.type";

const hourHeight = 56;
const dayMs = 24 * 60 * 60 * 1000;

const startOfWeek = (date: Date) => {
  const next = new Date(date);
  const day = next.getDay() || 7;
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() - day + 1);
  return next;
};

export const getWeekRange = (date: Date) => {
  const start = startOfWeek(date);
  const end = new Date(start.getTime() + 6 * dayMs);
  return { start, end };
};

export const formatDateParam = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseMinutes = (time: string) => {
  const [hour = "0", minute = "0"] = time.split(":");
  return Number(hour) * 60 + Number(minute);
};

const formatDayLabel = (date: Date) => date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });

const statusClass: Record<string, string> = {
  scheduled: "border-sky-300 bg-sky-50 text-sky-800",
  completed: "border-emerald-300 bg-emerald-50 text-emerald-800",
  cancelled: "border-rose-300 bg-rose-50 text-rose-800",
};

type PositionedSession = ClassSession & {
  overlapIndex: number;
  overlapCount: number;
};

const overlap = (left: ClassSession, right: ClassSession) =>
  parseMinutes(left.start_time) < parseMinutes(right.end_time) && parseMinutes(left.end_time) > parseMinutes(right.start_time);

const withOverlap = (items: ClassSession[]): PositionedSession[] =>
  items.map((item) => {
    const overlaps = items.filter((other) => overlap(item, other)).sort((a, b) => parseMinutes(a.start_time) - parseMinutes(b.start_time));
    return { ...item, overlapIndex: Math.max(0, overlaps.findIndex((other) => other.id === item.id)), overlapCount: Math.max(1, overlaps.length) };
  });

type WeeklyScheduleProps = {
  sessions: ClassSession[];
  weekDate: Date;
  loading?: boolean;
  onWeekChange: (date: Date) => void;
  onSessionClick: (session: ClassSession) => void;
};

export function WeeklySchedule({ sessions, weekDate, loading = false, onWeekChange, onSessionClick }: WeeklyScheduleProps) {
  const { start, end } = getWeekRange(weekDate);
  const days = Array.from({ length: 7 }, (_, index) => new Date(start.getTime() + index * dayMs));
  const hours = Array.from({ length: 24 }, (_, hour) => hour);

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-950">Lịch tuần</h2>
          <p className="text-sm text-gray-500">{formatDateParam(start)} - {formatDateParam(end)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onWeekChange(new Date(start.getTime() - 7 * dayMs))}><ChevronLeft className="h-4 w-4" /> Tuần trước</Button>
          <Button variant="outline" onClick={() => onWeekChange(new Date(start.getTime() + 7 * dayMs))}>Tuần sau <ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
      {loading && <div className="mb-3 rounded-2xl bg-gray-50 px-4 py-2 text-sm text-gray-500">Đang tải lịch...</div>}
      <div className="overflow-x-auto">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[72px_repeat(7,minmax(120px,1fr))] border-b border-gray-100">
            <div />
            {days.map((day) => <div key={day.toISOString()} className="px-3 py-2 text-center text-sm font-semibold text-gray-700">{formatDayLabel(day)}</div>)}
          </div>
          <div className="grid grid-cols-[72px_repeat(7,minmax(120px,1fr))]">
            <div className="relative" style={{ height: hourHeight * 24 }}>
              {hours.map((hour) => <div key={hour} className="absolute left-0 right-2 -translate-y-2 text-right text-xs text-gray-400" style={{ top: hour * hourHeight }}>{hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}</div>)}
            </div>
            {days.map((day) => {
              const dateKey = formatDateParam(day);
              const daySessions = withOverlap(sessions.filter((session) => session.session_date === dateKey));
              return (
                <div key={dateKey} className="relative border-l border-gray-100" style={{ height: hourHeight * 24 }}>
                  {hours.map((hour) => <div key={hour} className="absolute left-0 right-0 border-t border-gray-100" style={{ top: hour * hourHeight }} />)}
                  {daySessions.map((session) => {
                    const top = (parseMinutes(session.start_time) / 60) * hourHeight;
                    const height = Math.max(36, ((parseMinutes(session.end_time) - parseMinutes(session.start_time)) / 60) * hourHeight);
                    const width = 100 / session.overlapCount;
                    const left = width * session.overlapIndex;
                    const title = `Lớp: ${session.class?.name ?? "-"}\nGV: ${session.teacher?.full_name ?? "-"}\n${session.title}\n${session.start_time?.slice(0, 5)} - ${session.end_time?.slice(0, 5)}\n${session.room?.name ?? ""}`;
                    return (
                      <button
                        key={session.id}
                        type="button"
                        title={title}
                        onClick={() => onSessionClick(session)}
                        className={`absolute overflow-hidden rounded-xl border px-2 py-1 text-left text-xs shadow-sm transition hover:z-10 hover:scale-[1.02] ${statusClass[session.status] ?? "border-gray-300 bg-gray-50 text-gray-700"}`}
                        style={{ top, height, left: `calc(${left}% + 3px)`, width: `calc(${width}% - 6px)` }}
                      >
                        <div className="font-semibold">Lớp: {session.class?.name ?? "-"}</div>
                        <div>GV: {session.teacher?.full_name ?? "-"}</div>
                        <div className="truncate">{session.title}</div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
