import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef } from "react";

import { Checkbox } from "~/components/ui/checkbox";
import type { TodoItem } from "~/core/types";
import { cn } from "~/lib/utils";

export function TodoList({
  className,
  items,
}: {
  className?: string;
  items: TodoItem[];
}) {
  const containerRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        autoAnimate(containerRef.current);
      }
    }, 0);
  }, []);
  return (
    <ul
      ref={containerRef}
      className={cn(
        "border-input dark:bg-input/30 flex flex-col overflow-auto rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={index + item.title} className="flex items-center gap-2">
          <Checkbox checked={item.is_done} disabled={item.is_done} />
          <div className={cn(item.is_done && "line-through opacity-50")}>
            {item.title}
          </div>
        </li>
      ))}
    </ul>
  );
}
