export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} — M.M Monique Mokelina` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — M.M Monique Mokelina` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
