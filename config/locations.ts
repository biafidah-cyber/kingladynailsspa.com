// config/locations.ts
// ─────────────────────────────────────────────────────────────────────────────
// Each entry generates a free SEO page at /locations/[slug]
// targeting "[service] [neighborhood]" searches.
// Add/remove entries to match your city's neighborhoods.
// ─────────────────────────────────────────────────────────────────────────────

export interface Location {
  slug:        string;    // URL slug — e.g. "henderson-nv"
  name:        string;    // Display name — e.g. "Henderson, NV"
  city:        string;    // City — e.g. "Henderson"
  stateCode:   string;    // 2-letter — e.g. "NV"
  description: string;    // Short description for meta / intro paragraph
  distance:    string;    // e.g. "8 miles south of the Strip"
  landmarks:   string[];  // 2-3 local landmarks for geo relevance
}

export const locations: Location[] = [
  {
    slug:        "henderson-nv",
    name:        "Henderson, NV",
    city:        "Henderson",
    stateCode:   "NV",
    description: "Henderson is the second-largest city in Nevada and one of the fastest-growing suburbs in the US.",
    distance:    "16 miles southeast of the Las Vegas Strip",
    landmarks:   ["The District at Green Valley Ranch", "Lake Las Vegas", "Galleria at Sunset Mall"],
  },
  {
    slug:        "summerlin-las-vegas",
    name:        "Summerlin, Las Vegas",
    city:        "Las Vegas",
    stateCode:   "NV",
    description: "Summerlin is an affluent master-planned community on the western edge of Las Vegas.",
    distance:    "15 miles west of the Las Vegas Strip",
    landmarks:   ["Downtown Summerlin Mall", "Red Rock Canyon", "Las Vegas Ballpark"],
  },
  {
    slug:        "north-las-vegas-nv",
    name:        "North Las Vegas, NV",
    city:        "North Las Vegas",
    stateCode:   "NV",
    description: "North Las Vegas is an independent city bordering Las Vegas to the north, known for its growing residential areas.",
    distance:    "8 miles north of the Strip",
    landmarks:   ["Craig Ranch Regional Park", "Losee Road Corridor", "Speedway Area"],
  },
  {
    slug:        "las-vegas-strip",
    name:        "Las Vegas Strip",
    city:        "Las Vegas",
    stateCode:   "NV",
    description: "The famous Las Vegas Strip stretches along Las Vegas Blvd and is home to the world's most iconic hotels and entertainment.",
    distance:    "On the Strip",
    landmarks:   ["MGM Grand", "Caesars Palace", "The Bellagio"],
  },
  {
    slug:        "downtown-las-vegas",
    name:        "Downtown Las Vegas",
    city:        "Las Vegas",
    stateCode:   "NV",
    description: "Downtown Las Vegas (Fremont Street area) is the historic heart of the city, known for locals and value-seekers.",
    distance:    "2 miles north of the Strip",
    landmarks:   ["Fremont Street Experience", "Container Park", "Arts District"],
  },
  {
    slug:        "spring-valley-las-vegas",
    name:        "Spring Valley, Las Vegas",
    city:        "Las Vegas",
    stateCode:   "NV",
    description: "Spring Valley is a large unincorporated community west of the Strip, popular with families and long-term residents.",
    distance:    "5 miles west of the Strip",
    landmarks:   ["Spring Valley Town Center", "Palms Casino vicinity", "Rainbow Blvd Corridor"],
  },
];
