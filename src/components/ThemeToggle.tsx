"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { dictionary, type Locale } from "@/lib/i18n";

export default function ThemeToggle({ locale }: { locale: Locale }) {
  const { theme, setTheme } = useTheme();
  const t = dictionary[locale].theme;
  // Avoid rendering theme-dependent state before the client has resolved
  // the actual theme (matches the resolvedTheme-undefined-on-server case).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const options = [
    { value: "light", label: t.light, icon: Sun },
    { value: "dark", label: t.dark, icon: Moon },
    { value: "system", label: t.system, icon: Monitor },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={t.toggle} />}>
        {mounted && theme === "dark" ? <Moon /> : mounted && theme === "light" ? <Sun /> : <Monitor />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            <Icon className="mr-2 size-3.5" />
            {label}
            {mounted && theme === value && <Check className="ml-auto size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
