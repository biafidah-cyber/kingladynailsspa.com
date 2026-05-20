import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/** Maps Google Places types → { schemaBizType, category } */
const PLACE_TYPE_MAP: Record<string, { schemaBizType: string; category: string }> = {
  nail_salon:          { schemaBizType: "BeautySalon",             category: "Nail Salon" },
  beauty_salon:        { schemaBizType: "BeautySalon",             category: "Beauty Salon" },
  hair_care:           { schemaBizType: "HairSalon",               category: "Hair Salon" },
  spa:                 { schemaBizType: "DaySpa",                  category: "Spa" },
  restaurant:          { schemaBizType: "Restaurant",              category: "Restaurant" },
  food:                { schemaBizType: "FoodEstablishment",       category: "Restaurant" },
  doctor:              { schemaBizType: "Physician",               category: "Medical Practice" },
  dentist:             { schemaBizType: "Dentist",                 category: "Dental Clinic" },
  gym:                 { schemaBizType: "SportsActivityLocation",  category: "Gym" },
  lawyer:              { schemaBizType: "LegalService",            category: "Law Firm" },
  real_estate_agency:  { schemaBizType: "RealEstateAgent",        category: "Real Estate Agency" },
  lodging:             { schemaBizType: "Hotel",                   category: "Hotel" },
  car_repair:          { schemaBizType: "AutoRepair",              category: "Auto Repair Shop" },
  florist:             { schemaBizType: "Florist",                 category: "Florist" },
  pharmacy:            { schemaBizType: "Pharmacy",                category: "Pharmacy" },
  veterinary_care:     { schemaBizType: "VeterinaryCare",         category: "Veterinary Clinic" },
  accounting:          { schemaBizType: "AccountingService",      category: "Accounting Firm" },
  electrician:         { schemaBizType: "Electrician",             category: "Electrician" },
  plumber:             { schemaBizType: "Plumber",                 category: "Plumber" },
  general_contractor:  { schemaBizType: "GeneralContractor",      category: "General Contractor" },
  locksmith:           { schemaBizType: "Locksmith",               category: "Locksmith" },
  moving_company:      { schemaBizType: "MovingCompany",          category: "Moving Company" },
  storage:             { schemaBizType: "SelfStorage",             category: "Storage Facility" },
  pet_store:           { schemaBizType: "PetStore",                category: "Pet Store" },
  clothing_store:      { schemaBizType: "ClothingStore",          category: "Clothing Store" },
};

const PRICE_MAP: Record<number, string> = { 0: "Free", 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };

async function fetchFromGooglePlaces(
  name: string, address: string, city: string, state: string, apiKey: string
) {
  // Step 1: Text search to get place_id
  const query = encodeURIComponent(`${name} ${address} ${city} ${state}`);
  const searchRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`,
    { signal: AbortSignal.timeout(8000) }
  );
  const searchData = await searchRes.json();
  const placeId = searchData.results?.[0]?.place_id;
  if (!placeId) throw new Error("Business not found in Google Places");

  // Step 2: Place details
  const fields = [
    "name", "formatted_phone_number", "rating", "user_ratings_total",
    "price_level", "types", "opening_hours", "website", "business_status",
  ].join(",");
  const detailRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`,
    { signal: AbortSignal.timeout(8000) }
  );
  const detail = (await detailRes.json()).result ?? {};

  // Map types to schema
  const types: string[] = detail.types ?? [];
  let schemaBizType = "LocalBusiness";
  let category = name;
  for (const t of types) {
    if (PLACE_TYPE_MAP[t]) { ({ schemaBizType, category } = PLACE_TYPE_MAP[t]); break; }
  }

  return {
    source:         "Google Places",
    phone:          detail.formatted_phone_number ?? null,
    rating:         detail.rating ?? null,
    reviewCount:    detail.user_ratings_total ?? null,
    priceRange:     detail.price_level != null ? PRICE_MAP[detail.price_level] : null,
    category,
    schemaBizType,
    yearEstablished: null, // Google Places doesn't expose founding year
  };
}

async function fetchFromOpenAI(name: string, city: string, state: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("No API key — set GOOGLE_PLACES_API_KEY or OPENAI_API_KEY");

  const client = new OpenAI({ apiKey });
  const prompt = `You are a business research assistant with extensive knowledge of US local businesses.
Return accurate data for this business as JSON (no markdown, just raw JSON):

Business: ${name}
Location: ${city}, ${state}

Return exactly this structure:
{
  "rating": <number 1-5, realistic for this type of business>,
  "reviewCount": <integer, realistic Google review count>,
  "priceRange": <"$" | "$$" | "$$$" | "$$$$">,
  "category": <human-readable business category like "Nail Salon">,
  "schemaBizType": <Schema.org LocalBusiness subtype like "BeautySalon">,
  "yearEstablished": <integer year or null if unknown>,
  "phone": null
}

Use your knowledge of this specific business if you know it. Otherwise use realistic estimates for this business type in this city.`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  const data = JSON.parse(completion.choices[0].message.content ?? "{}");
  return { ...data, source: "AI (OpenAI)" };
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { name?: string; address?: string; city?: string; state?: string };
  const { name = "", address = "", city = "", state = "" } = body;

  if (!name.trim()) {
    return NextResponse.json({ error: "Business name is required" }, { status: 400 });
  }

  const placesKey = process.env.GOOGLE_PLACES_API_KEY;

  try {
    if (placesKey) {
      const data = await fetchFromGooglePlaces(name, address, city, state, placesKey);
      // Use OpenAI only to fill yearEstablished if Places didn't provide it
      if (!data.yearEstablished && process.env.OPENAI_API_KEY) {
        try {
          const aiData = await fetchFromOpenAI(name, city, state);
          data.yearEstablished = aiData.yearEstablished ?? null;
        } catch { /* non-blocking */ }
      }
      return NextResponse.json(data);
    }

    // Fallback: use OpenAI
    const data = await fetchFromOpenAI(name, city, state);
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
