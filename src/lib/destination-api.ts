/// <reference path="../vite-env.d.ts" />
export interface Attraction {
  name: string
  description: string
  estimatedTime?: string
  tips?: string[]
}

export interface CulturalInsight {
  topic: string
  description: string
}

export interface CuisineItem {
  dish: string
  description: string
  type?: string
  whereToTry?: string
}

export interface TransportationOption {
  type: string
  description: string
  cost?: string
}

export interface TravelTip {
  category: string
  advice: string
}

export interface DestinationEssentials {
  language: string
  currency: string
  visaInfo: string
  safety: string
  healthTips: string
  commonPhrases?: string[]
}

export interface DestinationGuide {
  destination: string
  country: string
  overview: string
  tags: string[]
  bestTimeToVisit: string
  climate: string
  budgetRange: string
  attractions: Attraction[]
  culturalInsights: CulturalInsight[]
  cuisine: CuisineItem[]
  transportation: TransportationOption[]
  travelTips: TravelTip[]
  essentials: DestinationEssentials
}

export async function generateDestinationGuide(destination: string): Promise<DestinationGuide> {
  const prompt = spark.llmPrompt`You are an expert travel guide creator with deep knowledge of destinations worldwide. Generate a comprehensive, accurate, and practical travel guide for travelers planning to visit a destination.

Create a detailed travel guide for: ${destination}

Provide comprehensive information covering all aspects of travel:

1. Overview: A compelling 3-4 sentence introduction to the destination
2. Tags: 5-7 descriptive tags (e.g., "Historic", "Beach Paradise", "Foodie Haven")
3. Best Time to Visit: Specific months and seasonal considerations
4. Climate: Year-round weather patterns and what to expect
5. Budget Range: Daily cost estimates in USD for budget, moderate, and luxury travelers
6. Top Attractions: 6-8 must-see places with descriptions, estimated visit times, and insider tips
7. Cultural Insights: 4-6 important cultural topics (customs, etiquette, traditions, local norms)
8. Local Cuisine: 5-7 must-try dishes with descriptions, dish type, and where to try them
9. Transportation: 4-5 transportation options with descriptions and cost ranges
10. Travel Tips: 8-10 essential tips across various categories (money, connectivity, booking, timing, packing, etc.)
11. Essentials: Language, currency, visa requirements, safety information, health tips, and 5-8 common useful phrases

Return ONLY a valid JSON object in this exact format:
{
  "destination": "${destination}",
  "country": "Country Name",
  "overview": "Compelling description...",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "bestTimeToVisit": "Specific months and reasons",
  "climate": "Year-round climate description",
  "budgetRange": "$X-Y per day for budget, $A-B for moderate, $C-D for luxury",
  "attractions": [
    {
      "name": "Attraction Name",
      "description": "Detailed description",
      "estimatedTime": "2-3 hours",
      "tips": ["Tip 1", "Tip 2", "Tip 3"]
    }
  ],
  "culturalInsights": [
    {
      "topic": "Topic Name",
      "description": "Detailed explanation"
    }
  ],
  "cuisine": [
    {
      "dish": "Dish Name",
      "description": "What it is and why it's special",
      "type": "Street Food / Fine Dining / Traditional / Modern",
      "whereToTry": "Specific neighborhoods or restaurant recommendations"
    }
  ],
  "transportation": [
    {
      "type": "Metro / Bus / Taxi / Bike / Walking",
      "description": "How it works and when to use it",
      "cost": "Cost range or info"
    }
  ],
  "travelTips": [
    {
      "category": "Money / Connectivity / Safety / Booking / Timing / Packing / etc.",
      "advice": "Specific actionable advice"
    }
  ],
  "essentials": {
    "language": "Primary language spoken",
    "currency": "Currency name and code",
    "visaInfo": "Visa requirements for major countries",
    "safety": "General safety information and precautions",
    "healthTips": "Health considerations, vaccinations, medical care",
    "commonPhrases": ["Hello - Translation", "Thank you - Translation", "How much? - Translation", "Where is...? - Translation", "Help - Translation"]
  }
}

Be specific, accurate, and practical. Include real place names, specific tips, and actionable advice that travelers can use.`

  try {
    const result = await spark.llm(prompt, 'gpt-4o', true)
    const parsed = JSON.parse(result) as DestinationGuide
    return parsed
  } catch (error) {
    throw new Error(`Failed to generate destination guide: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
