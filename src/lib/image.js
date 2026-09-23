/* Asks Cloudinary for a right-sized, modern-format copy of an image
   (WebP/AVIF where the browser supports it, automatic quality) instead of the
   full-size original. Non-Cloudinary URLs are returned unchanged.

   optimizeImage(url, 800) -> .../upload/f_auto,q_auto,w_800,c_limit/...
   c_limit means it only ever shrinks an image, never enlarges it. */
export function optimizeImage(url, width) {
  if (typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;

  // Already transformed, leave it alone
  if (/\/upload\/[^/]*(f_auto|q_auto)/.test(url)) return url;

  const transform = ["f_auto", "q_auto"];
  if (width) transform.push(`w_${width}`, "c_limit");

  return url.replace("/upload/", `/upload/${transform.join(",")}/`);
}
