import LegalPage from "../components/layout/LegalPage";

const SUMMARY = [
  "We collect only what we need to sell you a ticket and let you into the event.",
  "Payments happen on eSewa. We never see or store your eSewa login or PIN.",
  "We don't sell your personal information.",
  "You can update your details in your profile, or ask us to delete your data.",
];

const SECTIONS = [
  {
    id: "who",
    title: "Who we are",
    body: [
      "EventGhar is a ticketing platform for events in Nepal. This policy explains what personal information we collect when you use the site, why we collect it, and the choices you have.",
    ],
  },
  {
    id: "collect",
    title: "What we collect",
    body: [
      [
        "Account details: your full name, email address, phone number, and password.",
        "Booking details: the event, ticket types and quantities, promo code used, order total, order ID, and payment status. At checkout you also give a name, email, phone number, and optionally an address for the ticket.",
        "Payment: eSewa handles the payment itself. We receive confirmation of whether it succeeded, not your eSewa credentials.",
        "Host requests: your name, email, phone, address, company details, and the event information you submit.",
        "Contact messages: your name, email, optional phone number, and message.",
        "Entry records: whether a ticket has been scanned and used at the venue.",
        "Preferences: for example whether you want email notifications.",
      ],
    ],
  },
  {
    id: "use",
    title: "How we use it",
    body: [
      [
        "to create and manage your account",
        "to process orders, issue QR tickets, and let you into events",
        "to send order confirmations, event updates, and refund decisions",
        "to answer your questions and run refunds when they apply",
        "to prevent fraud, misuse of promo codes, and duplicate ticket use",
        "to improve the site",
        "to send our email updates, only if you have chosen to receive them",
      ],
    ],
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: [
      "We don't sell your personal information. We share it only where it's needed:",
      [
        "eSewa, to take payment for your order",
        "Formspree, which delivers messages sent through our contact form",
        "Google and YouTube, when a page loads an embedded map or event song player",
        "our hosting and technical providers, who help us run the site",
        "the event organizer and venue staff, who can see your name and whether your ticket is valid so they can let you in",
        "the person you send a ticket to, who will see your name as the sender",
        "the authorities, if the law requires it",
      ],
    ],
  },
  {
    id: "storage",
    title: "Cookies and browser storage",
    body: [
      "EventGhar keeps a sign-in token and basic profile details in your browser's local storage so you stay logged in. Logging out or clearing your browser data removes them.",
      "Embedded YouTube players and Google Maps are run by Google and may set their own cookies when they load. You can block these in your browser settings, though the song player and maps may then not work.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: [
      "We keep your information for as long as your account is open and for as long as we need it to run tickets, handle refunds, meet accounting and legal duties, and settle disputes. After that we delete it or remove anything that identifies you.",
    ],
  },
  {
    id: "security",
    title: "Keeping it safe",
    body: [
      "We take reasonable steps to protect your information, including limiting who on our team can see it. No online service is completely secure, so we can't promise absolute safety. Please use a strong, unique password.",
    ],
  },
  {
    id: "rights",
    title: "Your choices",
    body: [
      "You can:",
      [
        "update your name and phone number on your Profile page",
        "turn email notifications on or off on your Profile page",
        "ask to see the information we hold about you",
        "ask us to correct it, or to delete your account and data",
      ],
      "To make a request, email support@eventghar.com from the address on your account. We may need to keep some records where the law or an open order requires it.",
    ],
  },
  {
    id: "children",
    title: "Children",
    body: [
      "EventGhar isn't meant for children, and we don't knowingly collect their information. If you think a child has given us personal details, contact us and we'll remove them.",
    ],
  },
  {
    id: "abroad",
    title: "Data outside Nepal",
    body: [
      "Some of the services we use, such as Google and Formspree, may process information on servers outside Nepal. By using EventGhar you understand your information may be handled there.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: [
      "If we change this policy, we'll update the date at the top of the page. If the change is significant, we'll tell you on the site or by email.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="21 September 2026"
      intro="Here is what we collect when you use EventGhar, why, and what you can do about it."
      summary={SUMMARY}
      sections={SECTIONS}
    />
  );
}
