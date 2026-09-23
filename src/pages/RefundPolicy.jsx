import LegalPage from "../components/layout/LegalPage";

const SUMMARY = [
  "Tickets are non-refundable by default.",
  "If an event is cancelled and we open refunds for it, you'll see a notice on the event page and in My bookings.",
  "Request a refund from My bookings. Our team reviews every request.",
  "Approved refunds go back to your original payment method through eSewa.",
];

const SECTIONS = [
  {
    id: "default",
    title: "Tickets are non-refundable by default",
    body: [
      "Every ticket sold on EventGhar is final once payment is confirmed. That includes changing your mind, being unable to attend, or buying the wrong ticket type.",
    ],
  },
  {
    id: "when",
    title: "When a refund is possible",
    body: [
      "If an event is cancelled or postponed, we may open refunds for that event only. Refunds are opened one event at a time, so other events are not affected.",
      "When refunds are open for an event, you will see:",
      [
        "a cancellation notice on the event page",
        "a message on the ticket in My bookings saying you're eligible for a refund",
        "a Request refund option in the ticket's menu",
      ],
      "If none of these appear, refunds are not open for that event.",
    ],
  },
  {
    id: "how",
    title: "How to request a refund",
    body: [
      [
        "Log in and open My bookings.",
        "Find the ticket for the cancelled event and open its menu (the three dots).",
        "Choose Request refund and confirm.",
      ],
      "Your booking will then show a Refund status: pending, approved, or rejected.",
    ],
  },
  {
    id: "review",
    title: "How requests are reviewed",
    body: [
      "Our team reviews each request against the event's refund status and your order. We check that the event is eligible and that the tickets in the order haven't been used. You'll see the outcome in My bookings.",
    ],
  },
  {
    id: "amount",
    title: "What you get back",
    body: [
      "An approved refund covers the amount you actually paid for that order, after any promo code discount. It is returned to your original payment method through eSewa. How long it takes to appear depends on eSewa.",
    ],
  },
  {
    id: "not-eligible",
    title: "What isn't refundable",
    body: [
      [
        "change of mind, or being unable to attend an event that goes ahead",
        "tickets already scanned or used at the venue",
        "missing an event or arriving late",
        "changes to the lineup, set times, or venue where the event still takes place, unless we open refunds",
        "tickets refused entry for breaking venue rules",
        "tickets lost or used because a QR code was shared with someone else",
      ],
    ],
  },
  {
    id: "failed",
    title: "Failed or duplicate payments",
    body: [
      "If eSewa shows a payment as failed or cancelled, no tickets were reserved and you haven't been charged for an order. If money left your account but you got no ticket, or you were charged twice, email support@eventghar.com with your order ID or eSewa transaction reference and we'll look into it.",
    ],
  },
  {
    id: "law",
    title: "Your legal rights",
    body: [
      "This policy doesn't affect any rights you have under Nepali consumer protection law.",
    ],
  },
];

export default function RefundPolicy() {
  return (
    <LegalPage
      title="Refund policy"
      updated="21 September 2026"
      intro="Ticket sales are final unless an event is cancelled and we open refunds for it. Here is how that works."
      summary={SUMMARY}
      sections={SECTIONS}
    />
  );
}
