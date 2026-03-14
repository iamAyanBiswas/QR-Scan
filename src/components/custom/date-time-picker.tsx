"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
    /** ISO string value or empty string */
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    /** Earliest selectable date */
    fromDate?: Date;
    id?: string;
}

function parseValue(value?: string): { date: Date | undefined; time: string } {
    if (!value) return { date: undefined, time: "00:00" };
    const d = new Date(value);
    if (isNaN(d.getTime())) return { date: undefined, time: "00:00" };
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return { date: d, time: `${hh}:${mm}` };
}

export function DateTimePicker({
    value,
    onChange,
    placeholder = "Pick a date & time",
    disabled = false,
    fromDate,
    id,
}: DateTimePickerProps) {
    const [open, setOpen] = React.useState(false);

    // Internal state for immediate UI response
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
        () => parseValue(value).date
    );
    const [timeStr, setTimeStr] = React.useState<string>(
        () => parseValue(value).time
    );

    // Sync internal state when external `value` changes (e.g. form reset)
    React.useEffect(() => {
        const { date, time } = parseValue(value);
        setSelectedDate(date);
        setTimeStr(time);
    }, [value]);

    // Emit an ISO string to the parent whenever date/time changes
    const emit = (date: Date | undefined, time: string) => {
        if (!date) {
            onChange?.("");
            return;
        }
        const [hh, mm] = time.split(":").map(Number);
        const merged = new Date(date);
        merged.setHours(hh, mm, 0, 0);
        onChange?.(merged.toISOString());
    };

    const handleDaySelect = (day: Date | undefined) => {
        if (!day) return;
        setSelectedDate(day);
        emit(day, timeStr);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setTimeStr(newTime);
        emit(selectedDate, newTime);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedDate(undefined);
        setTimeStr("00:00");
        onChange?.("");
    };

    const displayLabel =
        selectedDate && !isNaN(selectedDate.getTime())
            ? format(selectedDate, "PPP, HH:mm")
            : null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal pr-2",
                        !displayLabel && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">
                        {displayLabel ?? placeholder}
                    </span>
                    {displayLabel && (
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={handleClear}
                            onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleClear(e as unknown as React.MouseEvent)
                            }
                            className="ml-1 rounded-sm p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Clear date"
                        >
                            <X className="h-3.5 w-3.5" />
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDaySelect}
                    disabled={fromDate ? { before: fromDate } : undefined}
                    autoFocus
                />

                {/* Time picker */}
                <div className="border-t px-3 py-3 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground shrink-0">
                        Time
                    </span>
                    <input
                        type="time"
                        value={timeStr}
                        onChange={handleTimeChange}
                        disabled={!selectedDate}
                        className={cn(
                            "flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "transition-colors"
                        )}
                    />
                    <Button
                        size="sm"
                        variant="default"
                        onClick={() => setOpen(false)}
                        disabled={!selectedDate}
                    >
                        Done
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
