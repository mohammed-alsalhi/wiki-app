export type ArticleTemplate = {
  id: string;
  name: string;
  icon: string;
  description: string;
  content: string;
};

export const ARTICLE_TEMPLATES: ArticleTemplate[] = [
  {
    id: "blank",
    name: "Blank",
    icon: "\uD83D\uDCC4",
    description: "Start from scratch",
    content: "",
  },
  {
    id: "character",
    name: "Character",
    icon: "\uD83D\uDC64",
    description: "A person or notable figure",
    content: `<h2>Overview</h2><p>Brief description of the character.</p><h2>History</h2><p>Background and life events.</p><h2>Personality</h2><p>Traits, motivations, and demeanor.</p><h2>Relationships</h2><p>Key connections to other characters.</p><h2>Trivia</h2><ul><li></li></ul>`,
  },
  {
    id: "location",
    name: "Location",
    icon: "\uD83C\uDFF0",
    description: "A place, city, or region",
    content: `<h2>Overview</h2><p>Brief description of the location.</p><h2>Geography</h2><p>Physical features, climate, and terrain.</p><h2>History</h2><p>Notable events that occurred here.</p><h2>Notable Residents</h2><ul><li></li></ul><h2>Points of Interest</h2><ul><li></li></ul>`,
  },
  {
    id: "event",
    name: "Event",
    icon: "\u2694\uFE0F",
    description: "A battle, festival, or event",
    content: `<h2>Overview</h2><p>Brief summary of the event.</p><h2>Background</h2><p>Context and causes.</p><h2>Key Participants</h2><ul><li></li></ul><h2>Timeline</h2><ol><li></li></ol><h2>Aftermath</h2><p>Consequences and legacy.</p>`,
  },
  {
    id: "item",
    name: "Item",
    icon: "\uD83D\uDDE1\uFE0F",
    description: "A weapon, relic, or artifact",
    content: `<h2>Description</h2><p>Physical appearance and properties.</p><h2>History</h2><p>Origin and notable owners.</p><h2>Powers</h2><p>Magical or special abilities.</p><h2>Current Location</h2><p>Where the item is now.</p>`,
  },
  {
    id: "faction",
    name: "Faction",
    icon: "\uD83C\uDFDB\uFE0F",
    description: "A guild, kingdom, or group",
    content: `<h2>Overview</h2><p>Purpose and general description.</p><h2>History</h2><p>Founding and major events.</p><h2>Leadership</h2><ul><li></li></ul><h2>Members</h2><p>Notable members and ranks.</p><h2>Goals</h2><p>Current objectives and motivations.</p>`,
  },
];
