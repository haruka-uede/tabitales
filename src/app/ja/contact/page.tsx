import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "Tabi Talesへのご質問、訂正のご提案、権利に関するご連絡はこちらから。",
};

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

export default function JaContactPage() {
  const formIsConfigured = WEB3FORMS_ACCESS_KEY.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">お問い合わせ</h1>
      <p className="text-muted-foreground mb-8">
        ガイドに関するご質問、訂正のご提案、記載内容に関するご懸念など、下記フォームよりお気軽にご連絡ください。
      </p>

      {formIsConfigured ? (
        <form action="https://api.web3forms.com/submit" method="POST" className="space-y-4">
          <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
          <input type="hidden" name="subject" value="New message from Tabi Tales contact form (JA)" />
          <input type="hidden" name="redirect" value="https://www.tabitales.jp/ja/contact?sent=true" />
          <input type="text" name="botcheck" className="hidden" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">お名前</label>
            <input
              id="name"
              type="text"
              name="name"
              required
              className="w-full border border-border bg-background rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">メールアドレス</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="w-full border border-border bg-background rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">メッセージ</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full border border-border bg-background rounded-md px-3 py-2"
            />
          </div>
          <Button type="submit" size="lg">
            送信
          </Button>
        </form>
      ) : (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-4">
          お問い合わせフォームはまだ設定されていません（NEXT_PUBLIC_WEB3FORMS_ACCESS_KEYが未設定です）。
        </p>
      )}
    </div>
  );
}
