import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";

interface AlertDrawerSectionProps {
  title: string;
  count: number;
  isLoading: boolean;
  countColorClass?: string;
  emptyMessage?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AlertDrawerSection({
  title,
  count,
  isLoading,
  countColorClass = "bg-gray-100 text-gray-700",
  emptyMessage = "Nothing to show",
  children,
  defaultOpen = true,
}: AlertDrawerSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-md mb-3 last:mb-0 flex flex-col shrink-0">
      {/* Header / Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown size={15} aria-hidden="true" />
          ) : (
            <ChevronRight size={15} aria-hidden="true" />
          )}
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </div>

        {isLoading ? (
          <Loader2
            size={14}
            className="animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        ) : (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${countColorClass}`}
            aria-label={`${count} items`}
          >
            {count}
          </span>
        )}
      </button>

      {/* Body */}

      {isOpen && (
        <div className="px-3 py-3 overflow-hidden">
          {isLoading ? (
            <div
              className="flex items-center justify-center py-8"
              role="status"
              aria-busy="true"
            >
              <Loader2
                className="h-5 w-5 animate-spin text-primary mr-2"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : count === 0 ? (
            <div
              className="flex items-center justify-center py-6"
              role="status"
            >
              <p className="text-sm text-muted-foreground italic">
                {emptyMessage}
              </p>
            </div>
          ) : (
            <div role="list">{children}</div>
          )}
        </div>
      )}
    </div>
  );
}
