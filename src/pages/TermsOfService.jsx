import LegalPage from "../components/layout/LegalPage";

const SECTIONS = [
  {
    id: "about",
    title: "About EventGhar",
    body: [
      "EventGhar is an online ticketing platform for events in Nepal. You can discover events, buy tickets, and walk in with a QR code. We list events ourselves and on behalf of organizers who apply to host through our Host page.",
      "Each event is run by its organizer. EventGhar provides the platform for listing, selling, and checking in tickets.",
    ],
  },
  {
    id: "accepting",
    title: "Accepting these terms",
    body: [
      "By browsing EventGhar, creating an account, or buying a ticket, you agree to these Terms of Service, our Privacy Policy, and our Refund Policy. If you don't agree, please don't use the site.",
    ],
  },
  {
    id: "account",
    title: "Your account",
    body: [
      "You need an account to buy tickets. When you sign up you agree to:",
      [
        "give accurate information, including a valid email address and Nepal phone number",
        "keep your password private and not share your account",
        "tell us straight away if you think someone else has used your account",
      ],
      "You are responsible for what happens under your account. We may suspend or close accounts that break these terms.",
    ],
  },
  {
    id: "tickets",
    title: "Buying tickets",
    body: [
      [
        "Prices are shown in Nepali rupees (NPR) before you pay. Ticket types such as Fan Pit, VIP, VVIP, and General are as listed on each event page.",
        "Your order is confirmed only once eSewa confirms your payment. If a payment fails or is cancelled, no tickets are reserved.",
        "Promo codes give a flat or percentage discount on an order. Only one code can be used per order. Codes have no cash value, and we may end or refuse a code at any time.",
        "A ticket is a permission to attend a specific event. It is not property you can trade for profit.",
      ],
    ],
  },
  {
    id: "payments",
    title: "Payments",
    body: [
      "Payments are handled by eSewa. When you tap Pay with eSewa, you are sent to eSewa's secure page and eSewa's own terms apply to the payment. EventGhar does not see or store your eSewa credentials.",
      "By paying, you authorise the charge for the total shown at checkout.",
    ],
  },
  {
    id: "entry",
    title: "Entry and QR tickets",
    body: [
      [
        "Every ticket has its own QR code, so a group can arrive separately. Each code is scanned at the venue and works for one entry only. Once a ticket has been scanned, it is marked as used.",
        "Keep your QR code private. Anyone who scans a copy before you do will use up the ticket, and we can't replace it.",
        "Venue rules apply on the day. The organizer or venue may refuse entry for safety reasons or for breaking venue rules, without a refund.",
        "Dates, times, lineups, and venues can change. We show the latest details on the event page.",
      ],
    ],
  },
  {
    id: "transfers",
    title: "Transferring tickets",
    body: [
      "You can transfer a ticket to another registered EventGhar user from the ticket page. The person you send it to must already have an account.",
      "When you transfer an order, its unused QR codes are replaced with new ones for the new owner, and your old codes stop working. Tickets that have already been scanned stay marked as used, and an order where every ticket has been scanned can't be transferred.",
      "Reselling tickets for more than you paid, or selling them outside EventGhar to make money, isn't allowed. We may cancel tickets we believe were obtained or sold this way.",
    ],
  },
  {
    id: "refunds",
    title: "Cancelled events and refunds",
    body: [
      "Tickets are non-refundable by default. If an event is cancelled and we open refunds for it, the rules in our Refund Policy apply. Please read it before you buy.",
    ],
  },
  {
    id: "hosting",
    title: "Hosting an event",
    body: [
      "Sending a host request doesn't guarantee your event will be listed. We review every request and can approve or reject it.",
      "If we list your event, you agree that:",
      [
        "the information you give us is accurate and kept up to date",
        "you have the right to run the event and any permits, licences, and music rights it needs",
        "you will run the event as described and follow the law",
        "you are responsible for delivering the event to attendees",
      ],
    ],
  },
  {
    id: "songs",
    title: "Event songs and third-party content",
    body: [
      "Some events feature a song that plays through an embedded YouTube player. The music belongs to its owners. Organizers may only add links they are entitled to share. YouTube's own terms apply to the player, and Google Maps terms apply to embedded maps.",
    ],
  },
  {
    id: "use",
    title: "Acceptable use",
    body: [
      "You agree not to:",
      [
        "create fake accounts or give false details",
        "try to get around QR verification, payments, or promo code limits",
        "scrape, copy, or overload the site, or probe it for weaknesses",
        "post or send anything unlawful, abusive, or misleading",
        "use EventGhar for anything other than lawful, personal ticket buying or event hosting",
      ],
    ],
  },
  {
    id: "ip",
    title: "Our content",
    body: [
      "The EventGhar name, logo, design, and site content belong to EventGhar or the people who license them to us. Archival photos are credited where shown. You may use the site for your own personal, non-commercial use, but you may not copy or reuse our content without permission.",
    ],
  },
  {
    id: "liability",
    title: "Disclaimers and liability",
    body: [
      "We work hard to keep EventGhar running, but we provide it as is and can't promise it will always be available or error free. Events are run by their organizers, so we aren't responsible for how an event is delivered.",
      "To the extent the law allows, our total liability for any claim about an order is limited to the amount you paid for that order. Nothing in these terms takes away rights you have under Nepali law that can't be limited, including consumer protection law.",
    ],
  },
  {
    id: "changes",
    title: "Changes and ending your account",
    body: [
      "We may update these terms from time to time. The date at the top shows when they last changed, and using EventGhar after an update means you accept the new terms.",
      "You can stop using EventGhar at any time. We may suspend or end access if these terms are broken.",
    ],
  },
  {
    id: "law",
    title: "Governing law",
    body: [
      "These terms are governed by the laws of Nepal. Any dispute that can't be settled informally will be handled by the courts of Kathmandu, Nepal.",
    ],
  },
];

export default function TermsOfService() {
  return (
    <LegalPage
      title="Terms of service"
      updated="21 September 2026"
      intro="These are the rules for using EventGhar to find events, buy tickets, and host shows. We've kept them as plain as we can."
      sections={SECTIONS}
    />
  );
}
