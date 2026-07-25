import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function AffiliateDisclosureNoteJa() {
  return (
    <div className="pt-4 mt-8 not-prose">
      <Separator className="mb-4" />
      <p className="text-sm text-muted-foreground">
        Tabi Talesは、このページ内のホテル・ツアー・書籍のリンク経由の予約や購入によって、読者に追加費用なく手数料を得る場合があります。詳細は
        <Link href="/ja/disclosure" className="underline">
          アフィリエイト開示
        </Link>
        をご覧ください。
      </p>
    </div>
  );
}
