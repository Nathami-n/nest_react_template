
import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

import { cn } from "@repo/ui/lib/utils";
import { Button } from "./button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Spinner } from "./spinner";

function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export interface AsyncSelectOption {
    label: string;
    value: string;
    description?: string;
}

export interface AsyncSelectProps {
    /** The currently selected value */
    value?: string;
    /** Callback fired when a new value is selected */
    onValueChange: (value: string) => void;
    /** Callback fired when the user types in the search input */
    onSearchChange: (search: string) => void;
    /** Array of options to display */
    options: AsyncSelectOption[];
    /** Whether the async request is currently loading */
    loading?: boolean;
    /** Text to show when no options are found */
    emptyText?: string;
    /** Placeholder text for the trigger button */
    placeholder?: string;
    /** Placeholder text for the search input */
    searchPlaceholder?: string;
    /** Disable the select */
    disabled?: boolean;
    /** Additional class names for the trigger button */
    className?: string;
    /** Debounce delay in milliseconds for the search input */
    debounceMs?: number;
}

export function AsyncSelect({
    value,
    onValueChange,
    onSearchChange,
    options,
    loading = false,
    emptyText = "No results found.",
    placeholder = "Select an option...",
    searchPlaceholder = "Search...",
    disabled = false,
    className,
    debounceMs = 300,
}: AsyncSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const debouncedSearchTerm = useDebounceValue(searchTerm, debounceMs);

    // Trigger the search callback when the debounced search term changes
    React.useEffect(() => {
        onSearchChange(debouncedSearchTerm);
    }, [debouncedSearchTerm, onSearchChange]);

    const selectedOption = React.useMemo(() => {
        return options.find((opt) => opt.value === value);
    }, [value, options]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between font-normal shadow-xs",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <HugeiconsIcon icon={ArrowDown01Icon} className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        className="border-none focus:ring-0"
                    />
                    <CommandList>
                        {loading && (
                            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                                <Spinner className="mr-2 size-4" />
                                Loading...
                            </div>
                        )}
                        {!loading && options.length === 0 && (
                            <CommandEmpty>{emptyText}</CommandEmpty>
                        )}
                        {!loading && options.length > 0 && (
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => {
                                            onValueChange(option.value);
                                            setOpen(false);
                                        }}
                                        className="flex flex-col items-start gap-1 py-2"
                                    >
                                        <div className="flex w-full items-center">
                                            <span className="font-medium truncate">{option.label}</span>
                                            <HugeiconsIcon
                                                icon={Tick02Icon}
                                                className={cn(
                                                    "ml-auto size-4 shrink-0",
                                                    value === option.value ? "opacity-100 text-primary" : "opacity-0"
                                                )}
                                            />
                                        </div>
                                        {option.description && (
                                            <span className="text-xs text-muted-foreground truncate w-full">
                                                {option.description}
                                            </span>
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
