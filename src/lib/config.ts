export const config = {
  name: process.env.NEXT_PUBLIC_WIKI_NAME || "My Wiki",
  tagline: process.env.NEXT_PUBLIC_WIKI_TAGLINE || "A personal wiki",
  description:
    process.env.NEXT_PUBLIC_WIKI_DESCRIPTION ||
    "A personal knowledge base and encyclopedia",
  welcomeText:
    process.env.NEXT_PUBLIC_WIKI_WELCOME_TEXT ||
    "Your personal knowledge base. Create articles, organize them into categories, and build your own encyclopedia.",
  footerText:
    process.env.NEXT_PUBLIC_WIKI_FOOTER_TEXT ||
    "Content is available under Creative Commons Attribution.",
  mapEnabled: process.env.NEXT_PUBLIC_MAP_ENABLED === "true",
  mapLabel: process.env.NEXT_PUBLIC_MAP_LABEL || "Map",
  mapImage: process.env.NEXT_PUBLIC_MAP_IMAGE || "",
};
