export type InfoboxFieldType = "text" | "textarea" | "number" | "wikilink" | "list";

export type InfoboxFieldDef = {
  key: string;
  label: string;
  type: InfoboxFieldType;
  placeholder?: string;
};

export type InfoboxSchema = {
  fields: InfoboxFieldDef[];
};

/** Infobox field schemas keyed by root category slug */
export const INFOBOX_SCHEMAS: Record<string, InfoboxSchema> = {
  people: {
    fields: [
      { key: "fullName", label: "Full Name", type: "text", placeholder: "Full legal or known name" },
      { key: "born", label: "Born", type: "text", placeholder: "Date and/or place of birth" },
      { key: "died", label: "Died", type: "text", placeholder: "Date and/or place of death" },
      { key: "occupation", label: "Occupation", type: "text", placeholder: "Primary occupation or role" },
      { key: "nationality", label: "Nationality", type: "text", placeholder: "Country or cultural identity" },
      { key: "knownFor", label: "Known For", type: "text", placeholder: "Notable achievements" },
      { key: "affiliation", label: "Affiliation", type: "wikilink", placeholder: "Organization or group" },
      { key: "title", label: "Title/Rank", type: "text", placeholder: "Official title or rank" },
    ],
  },
  places: {
    fields: [
      { key: "location", label: "Location", type: "text", placeholder: "Region, country, or coordinates" },
      { key: "type", label: "Type", type: "text", placeholder: "City, region, landmark, etc." },
      { key: "population", label: "Population", type: "number", placeholder: "Approximate population" },
      { key: "area", label: "Area", type: "text", placeholder: "Size in km² or other units" },
      { key: "founded", label: "Founded", type: "text", placeholder: "Founding date" },
      { key: "government", label: "Government", type: "text", placeholder: "Type of governance" },
      { key: "leader", label: "Leader", type: "wikilink", placeholder: "Current ruler or leader" },
      { key: "climate", label: "Climate", type: "text", placeholder: "Climate description" },
    ],
  },
  organizations: {
    fields: [
      { key: "type", label: "Type", type: "text", placeholder: "Guild, military, religious, etc." },
      { key: "founded", label: "Founded", type: "text", placeholder: "When it was established" },
      { key: "dissolved", label: "Dissolved", type: "text", placeholder: "When disbanded (if applicable)" },
      { key: "leader", label: "Leader", type: "wikilink", placeholder: "Current leader or head" },
      { key: "headquarters", label: "HQ", type: "wikilink", placeholder: "Base of operations" },
      { key: "members", label: "Members", type: "text", placeholder: "Membership count or description" },
      { key: "purpose", label: "Purpose", type: "text", placeholder: "Primary objective or mission" },
      { key: "allies", label: "Allies", type: "list", placeholder: "Allied organizations (comma-separated)" },
    ],
  },
  events: {
    fields: [
      { key: "date", label: "Date", type: "text", placeholder: "When it occurred" },
      { key: "location", label: "Location", type: "wikilink", placeholder: "Where it took place" },
      { key: "participants", label: "Participants", type: "list", placeholder: "Key participants (comma-separated)" },
      { key: "outcome", label: "Outcome", type: "text", placeholder: "Result or consequence" },
      { key: "cause", label: "Cause", type: "text", placeholder: "What triggered the event" },
      { key: "partOf", label: "Part Of", type: "wikilink", placeholder: "Larger event or conflict" },
      { key: "duration", label: "Duration", type: "text", placeholder: "How long it lasted" },
    ],
  },
  things: {
    fields: [
      { key: "type", label: "Type", type: "text", placeholder: "Weapon, artifact, tool, etc." },
      { key: "creator", label: "Creator", type: "wikilink", placeholder: "Who made it" },
      { key: "origin", label: "Origin", type: "wikilink", placeholder: "Where it came from" },
      { key: "material", label: "Material", type: "text", placeholder: "What it's made of" },
      { key: "status", label: "Status", type: "text", placeholder: "Current condition or whereabouts" },
      { key: "owner", label: "Owner", type: "wikilink", placeholder: "Current or last known owner" },
      { key: "properties", label: "Properties", type: "textarea", placeholder: "Special abilities or features" },
    ],
  },
  concepts: {
    fields: [
      { key: "type", label: "Type", type: "text", placeholder: "Magic system, philosophy, law, etc." },
      { key: "domain", label: "Domain", type: "text", placeholder: "Field or area of knowledge" },
      { key: "origin", label: "Origin", type: "text", placeholder: "Where concept originated" },
      { key: "relatedTo", label: "Related To", type: "list", placeholder: "Related concepts (comma-separated)" },
      { key: "practitioners", label: "Practitioners", type: "text", placeholder: "Who uses or follows this" },
      { key: "description", label: "Description", type: "textarea", placeholder: "Brief explanation" },
    ],
  },
};

type CategoryInfo = { slug: string; parentId: string | null; id: string };

/**
 * Resolve the infobox schema for a category.
 * Walks up the parent chain so subcategories inherit from ancestors.
 */
export function getInfoboxSchema(
  categorySlug: string,
  categories: CategoryInfo[]
): InfoboxSchema | null {
  const byId = new Map(categories.map((c) => [c.id, c]));

  let current = categories.find((c) => c.slug === categorySlug);
  while (current) {
    if (INFOBOX_SCHEMAS[current.slug]) {
      return INFOBOX_SCHEMAS[current.slug];
    }
    if (current.parentId) {
      current = byId.get(current.parentId);
    } else {
      break;
    }
  }
  return null;
}
