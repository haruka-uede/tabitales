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
import type { SearchEntry } from "@/lib/search";

const NAV_LINKS = [
  { href: "/articles", label: "Guides" },
  { href: "/authors", label: "Authors" },
  { href: "/destinations", label: "Destinations" },
];

export default function SiteHeader({ searchIndex }: { searchIndex: SearchEntry[] }) {
  return (
    <header className="border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="font-semibold text-lg">
          Tabi Tales
        </Link>

        <div className="hidden sm:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              {NAV_LINKS.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink render={<Link href={link.href} />}>
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <SearchBox index={searchIndex} />
        </div>

        <div className="flex sm:hidden items-center gap-2">
          <SearchBox index={searchIndex} />
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" />}>
              <Menu />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
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
