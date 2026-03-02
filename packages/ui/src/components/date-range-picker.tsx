"use client";

import * as React from "react";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";
import { Calendar as CalendarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";

export type DateRange = {
  from: Date;
  to: Date;
};

export type DateRangePreset =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "custom";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
}

const presets: {
  label: string;
  value: DateRangePreset;
  getRangeOrNull: () => DateRange | null;
}[] = [
  {
    label: "Today",
    value: "today",
    getRangeOrNull: () => {
      const today = new Date();
      return {
        from: startOfDay(today),
        to: endOfDay(today),
      };
    },
  },
  {
    label: "Yesterday",
    value: "yesterday",
    getRangeOrNull: () => {
      const yesterday = subDays(new Date(), 1);
      return {
        from: startOfDay(yesterday),
        to: endOfDay(yesterday),
      };
    },
  },
  {
    label: "Last 7 Days",
    value: "last7days",
    getRangeOrNull: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 30 Days",
    value: "last30days",
    getRangeOrNull: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "This Month",
    value: "thisMonth",
    getRangeOrNull: () => ({
      from: startOfMonth(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last Month",
    value: "lastMonth",
    getRangeOrNull: () => {
      const lastMonth = subDays(startOfMonth(new Date()), 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      };
    },
  },
  {
    label: "Custom Range",
    value: "custom",
    getRangeOrNull: () => null,
  },
];

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedPreset, setSelectedPreset] =
    React.useState<DateRangePreset>("last7days");
  const [customRange, setCustomRange] = React.useState<{
    from?: Date;
    to?: Date;
  }>({});

  // Initialize with Last 7 Days if no value
  React.useEffect(() => {
    if (!value) {
      const last7Days = presets
        .find((p) => p.value === "last7days")
        ?.getRangeOrNull();
      if (last7Days) {
        onChange?.(last7Days);
      }
    }
  }, []);

  const handlePresetClick = (preset: (typeof presets)[0]) => {
    setSelectedPreset(preset.value);

    if (preset.value === "custom") {
      // Don't close popover, let user select dates
      return;
    }

    const range = preset.getRangeOrNull();
    if (range) {
      onChange?.(range);
      setOpen(false);
    }
  };

  const handleCustomRangeSelect = (
    range: { from?: Date; to?: Date } | undefined,
  ) => {
    if (range?.from && range?.to) {
      setCustomRange(range);
    } else if (range?.from) {
      setCustomRange({ from: range.from });
    } else {
      setCustomRange({});
    }
  };

  const handleApplyCustomRange = () => {
    if (customRange.from && customRange.to) {
      onChange?.({
        from: startOfDay(customRange.from),
        to: endOfDay(customRange.to),
      });
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setCustomRange({});
    setSelectedPreset("last7days");
    setOpen(false);
  };

  const displayText = React.useMemo(() => {
    if (!value) return "Select date range";

    return `${format(value.from, "MM/dd/yyyy")} - ${format(value.to, "MM/dd/yyyy")}`;
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <HugeiconsIcon icon={CalendarIcon} className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex">
          {/* Presets sidebar */}
          <div className="border-r border-border min-w-35">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetClick(preset)}
                className={cn(
                  "w-full px-4 py-2.5 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                  selectedPreset === preset.value &&
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calendar (only show for custom range) */}
          {selectedPreset === "custom" && (
            <div className="p-4">
              <Calendar
                mode="range"
                selected={
                  customRange.from && customRange.to
                    ? { from: customRange.from, to: customRange.to }
                    : undefined
                }
                onSelect={handleCustomRangeSelect}
                numberOfMonths={1}
                defaultMonth={customRange.from}
              />
              <div className="flex items-center justify-between gap-2 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {customRange.from && customRange.to
                    ? `${format(customRange.from, "MM/dd/yyyy")} - ${format(customRange.to, "MM/dd/yyyy")}`
                    : "Select date range"}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApplyCustomRange}
                    disabled={!customRange.from || !customRange.to}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
