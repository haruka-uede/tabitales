"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SearchBox from "@/components/SearchBox";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { SearchEntry } from "@/lib/search";
import { dictionary, href, type Locale } from "@/lib/i18n";

export default function SiteHeader({
  searchIndex,
  locale = "en" as Locale,
}: {
  searchIndex?: SearchEntry[];
  locale?: Locale;
}) {
  const t = dictionary[locale].nav;
  const menu = dictionary[locale].menu;
  const navLinks = [
    { href: href(locale, "/articles"), label: t.guides },
    { href: href(locale, "/authors"), label: t.authors },
    { href: href(locale, "/destinations"), label: t.destinations },
  ];
  // Search results currently only cover EN content and link into EN-only
  // pages - hide it on JA until a JA search index exists, rather than send a
  // JA reader into English pages.
  const showSearch = locale === "en" && searchIndex;

  return (
    <header className="sticky top-0 z-30 bg-background border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href={href(locale, "/")} className="font-semibold text-lg">
          Tabi Tales
        </Link>

        <div className="hidden sm:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink render={<Link href={link.href} />}>
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          {showSearch && <SearchBox index={searchIndex} />}
          <LanguageSwitcher locale={locale} />
        </div>

        <div className="flex sm:hidden items-center gap-2">
          {showSearch && <SearchBox index={searchIndex} />}
          <LanguageSwitcher locale={locale} />
          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" aria-label={menu.open} />}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{menu.title}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    nativeButton={false}
                    render={<Link href={link.href} />}
                    className="rounded-lg px-2 py-2 text-sm hover:bg-muted"
                  >
                    {link.label}
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
