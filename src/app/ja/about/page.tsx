import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tabi Talesについて",
  description: "Tabi Talesを始めた理由と、独立運営についてのご案内。",
};

export default function JaAboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 prose prose-neutral dark:prose-invert">
      <h1>Tabi Talesについて</h1>
      <p>
        Tabi Talesは、日本の小説とその舞台となった実在の場所を結びつける文学
        トラベルガイドです。読んだ本を通して日本を旅したい方のために作ってい
        ます。
      </p>

      <h2>このサイトを始めた理由</h2>
      <p>
        Tabi Talesは、日本で生まれ育った一人の運営者が個人で運営しています。
        小説を読み終えたあと、その舞台になった町やお寺、鉄道路線に実際に足を
        運び、登場人物が立っていた場所に自分も立ってみたいという気持ちが消え
        ないことがきっかけです。同じような読者のためにその旅を形にし、定番の
        観光ルートだけでは見えてこない日本の良さを伝えることを目指していま
        す。
      </p>

      <h2>運営について</h2>
      <p>
        Tabi Talesは独立した非公式のプロジェクトです。本サイトに登場する著
        者・出版社・権利者と提携・協力関係にあるものではなく、それらの承認を
        受けたものでもありません。一部のリンクはアフィリエイトリンクです。詳
        細は<Link href="/ja/disclosure">アフィリエイト開示</Link>をご覧くださ
        い。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        内容の誤りにお気づきの場合や、本と場所の新しいつながりのご提案があれ
        ば、<Link href="/ja/contact">お問い合わせ</Link>ください。
      </p>
    </div>
  );
}
