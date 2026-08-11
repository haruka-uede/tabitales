"use client";

import Link from "next/link";
import { Cookie, Ellipsis, FileText, Info, Mail, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { openCookiePreferences } from "@/lib/consent";
import { dictionary, href, type Locale } from "@/lib/i18n";

export default function FooterMoreMenu({ locale = "en" as Locale }: { locale?: Locale }) {
  const t = dictionary[locale].footer;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          />
        }
      >
        {t.more}
        <Ellipsis className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="min-w-44">
        <DropdownMenuItem render={<Link href={href(locale, "/about")} />}>
          <Info className="size-4" />
          {t.about}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={href(locale, "/contact")} />}>
          <Mail className="size-4" />
          {t.contact}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={href(locale, "/disclosure")} />}>
          <FileText className="size-4" />
          {t.disclosure}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={href(locale, "/privacy-policy")} />}>
          <Shield className="size-4" />
          {t.privacyPolicy}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openCookiePreferences}>
          <Cookie className="size-4" />
          {t.cookiePreferences}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
