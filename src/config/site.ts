/** Override at build time when the definitive public domain is confirmed. */
export const siteUrl = (process.env.SITE_URL || "https://tourmaline-kulfi-9e9fcd.netlify.app").replace(/\/$/, "");
