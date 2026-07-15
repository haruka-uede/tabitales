import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Tabi Tales — questions, corrections, or rights concerns.",
};

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

export default function ContactPage() {
  const formIsConfigured = WEB3FORMS_ACCESS_KEY.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">Contact</h1>
      <p className="text-neutral-600 mb-8">
        Questions about a guide, a correction to suggest, or a concern about how your
        work is represented here? Send a message below.
      </p>

      {formIsConfigured ? (
        <form action="https://api.web3forms.com/submit" method="POST" className="space-y-4">
          <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
          <input type="hidden" name="subject" value="New message from Tabi Tales contact form" />
          <input type="hidden" name="redirect" value="https://japanese-novel-journey.com/contact?sent=true" />
          <input type="text" name="botcheck" className="hidden" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              required
              className="w-full border border-neutral-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="w-full border border-neutral-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full border border-neutral-300 rounded-md px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-neutral-900 text-white rounded-md px-5 py-2 font-medium hover:bg-neutral-700"
          >
            Send
          </button>
        </form>
      ) : (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-4">
          Contact form is not yet configured (missing NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY).
        </p>
      )}
    </div>
  );
}
