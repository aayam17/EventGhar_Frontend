import React, { useState } from "react";
import { Mail, Phone, Send, Clock } from "lucide-react";
import Page from "../components/layout/Page";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Toast, { useSnack } from "../components/ui/Toast";
import Wordmark from "../components/ui/Wordmark";
import { SUPPORT_EMAIL, CONTACT_PHONE, phoneHref } from "../config/site";

const ContactUs = () => {
  const [snack, showSnack] = useSnack();
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const form = e.target;
    const payload = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
    };

    try {
      const res = await fetch("https://formspree.io/f/xojaebzr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showSnack("Message sent. We'll get back to you soon.", "success");
      form.reset();
    } catch {
      showSnack(`Couldn't send the message. Email ${SUPPORT_EMAIL} instead.`, "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <Page>
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <div className="grid overflow-hidden border-2 border-ink shadow-pop md:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT — branded panel, carries the "why" and quiet fallback contact */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-ink p-9 text-paper md:p-11">
            {/* Decorative marigold glow — brand accent, not literal content */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-marigold/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-raspberry/20 blur-3xl" />

            <div className="relative">
              <Wordmark className="text-3xl text-paper" />

              <h2 className="mt-6 font-display text-4xl font-bold leading-[1.05]">
                Let's talk.
              </h2>
              <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-stone-300">
                Questions about an order, a refund, or hosting your own event.
                Send us a message and a real person will get back to you.
              </p>
            </div>

            <div className="relative mt-10 space-y-4 border-t border-white/10 pt-6">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-3 text-sm text-stone-200 transition hover:text-marigold"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Mail className="h-4 w-4" />
                </span>
                {SUPPORT_EMAIL}
              </a>
              {CONTACT_PHONE && (
                <a
                  href={phoneHref(CONTACT_PHONE)}
                  className="flex items-center gap-3 text-sm text-stone-200 transition hover:text-marigold"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <Phone className="h-4 w-4" />
                  </span>
                  {CONTACT_PHONE}
                </a>
              )}
              <div className="flex items-center gap-3 text-sm text-stone-400">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Clock className="h-4 w-4" />
                </span>
                Replies within 24 hours
              </div>
            </div>
          </div>

          {/* RIGHT — the one clear action on the page */}
          <div className="bg-white p-9 md:p-11">
            <h3 className="font-display text-xl font-semibold text-ink">
              Send us a message
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              Fill out the form below and we'll take it from there.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input name="name" label="Full name" placeholder="Your name" required />
                <Input name="email" type="email" label="Email address" placeholder="you@example.com" required />
              </div>
              <Input name="phone" label="Contact number (optional)" placeholder="98XXXXXXXX" />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-stone-700">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-stone-400 focus:ring-4 focus:ring-marigold/25"
                />
              </div>

              <Button type="submit" className="w-full" size="lg" icon={Send} loading={sending}>
                {sending ? "Sending..." : "Send message"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {snack && <Toast message={snack.message} type={snack.type} />}
    </Page>
  );
};

export default ContactUs;
