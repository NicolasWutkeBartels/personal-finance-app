"use client";

import * as React from "react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  name?: string;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({
  src,
  name,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const initials = React.useMemo(() => {
    if (!name) return "";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [name]);

  return (
    <Avatar className={cn("h-10 w-10", className)}>
      {src && <AvatarImage src={src} alt={name || "User Avatar"} />}
      <AvatarFallback
        className={cn(
          "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 font-medium",
          fallbackClassName
        )}
      >
        {initials || <User className="h-5 w-5" />}
      </AvatarFallback>
    </Avatar>
  );
}
