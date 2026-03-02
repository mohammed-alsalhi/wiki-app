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
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en",
  articlesPerPage: parseInt(process.env.NEXT_PUBLIC_ARTICLES_PER_PAGE || "20", 10),
  maxUploadSize: parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || "5242880", 10),
  registrationEnabled: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION !== "false",
  discussionsEnabled: process.env.NEXT_PUBLIC_ENABLE_DISCUSSIONS !== "false",
};
