import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DashboardDateInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

const toDisplayDate = (value: string) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
};

const toApiDate = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return "";
  const [, day, month, year] = match;
  const next = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const parsed = new Date(`${next}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  const valid =
    parsed.getFullYear() === Number(year) &&
    parsed.getMonth() + 1 === Number(month) &&
    parsed.getDate() === Number(day);
  return valid ? next : "";
};

export function DashboardDateInput({
  value,
  onChange,
  placeholder = "dd/mm/yyyy",
  className,
  disabled,
}: DashboardDateInputProps) {
  const [displayValue, setDisplayValue] = useState(toDisplayDate(value));

  useEffect(() => {
    setDisplayValue(toDisplayDate(value));
  }, [value]);

  return (
    <Input
      value={displayValue}
      disabled={disabled}
      placeholder={placeholder}
      className={cn("font-mono", className)}
      onChange={(event) => {
        const next = event.target.value;
        setDisplayValue(next);
        if (!next.trim()) onChange("");
        const apiDate = toApiDate(next);
        if (apiDate) onChange(apiDate);
      }}
      onBlur={() => setDisplayValue(toDisplayDate(value))}
    />
  );
}
