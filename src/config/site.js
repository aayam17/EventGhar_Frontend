/* Public contact details, read from the environment so real values never
   have to be edited into components. Anything left empty is simply not shown,
   so visitors never see a placeholder phone number or a dead social link.

   Set these in frontend/.env (or your hosting dashboard):
     VITE_SUPPORT_EMAIL=support@eventghar.com
     VITE_CONTACT_PHONE=+9779812345678
     VITE_INSTAGRAM_URL=https://instagram.com/youraccount
     VITE_FACEBOOK_URL=https://facebook.com/yourpage
     VITE_TWITTER_URL=https://x.com/youraccount
*/
const clean = (value) => (typeof value === "string" ? value.trim() : "");

export const SUPPORT_EMAIL =
  clean(import.meta.env.VITE_SUPPORT_EMAIL) || "support@eventghar.com";

export const CONTACT_PHONE = clean(import.meta.env.VITE_CONTACT_PHONE);

export const SOCIAL_LINKS = {
  instagram: clean(import.meta.env.VITE_INSTAGRAM_URL),
  facebook: clean(import.meta.env.VITE_FACEBOOK_URL),
  twitter: clean(import.meta.env.VITE_TWITTER_URL),
};

// "tel:" links must not contain spaces or dashes
export const phoneHref = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;
