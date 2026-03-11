/// <reference path="../vite-env.d.ts" />
export interface GeoRecommendation {
  name: string
  category: string
  description: string
  neighborhood?: string
  specialties?: string[]
  bestTime?: string
  priceRange?: string
  localTip?: string
}

export interface GeoRecommendationsResponse {
  mainstream: GeoRecommendation[]
  offTheBeaten: GeoRecommendation[]
}

export async function generateGeoLocalRecommendations(
  latitude: number,
  longitude: number,
  locationName: string,
  type: 'things-to-do' | 'places-to-eat'
): Promise<GeoRecommendationsResponse> {
  const recommendationType = type === 'things-to-do' ? 'attractions, activities, and experiences' : 'restaurants, cafes, bars, and food experiences'
  const categoryType = type === 'things-to-do' ? 'activities' : 'dining'

  const prompt = spark.llmPrompt`You are a knowledgeable local expert and travel guide with deep insider knowledge of ${locationName} (coordinates: ${latitude}, ${longitude}).

Generate two distinct sets of recommendations for ${recommendationType}:

1. **Mainstream Recommendations** (6 recommendations): Well-known, popular, highly-rated places that most visitors should experience. Include famous landmarks, top-rated establishments, and must-visit destinations.

2. **Off the Beaten Track** (6 recommendations): Hidden gems, local favorites, and unique experiences that tourists rarely discover. Include neighborhood spots, underground venues, secret locations, and places that locals actually frequent.

For ${type === 'things-to-do' ? 'attractions/activities' : 'dining establishments'}, provide:
- Specific real place names (not generic descriptions)
- Accurate neighborhood locations within ${locationName}
- Detailed descriptions that capture the essence and experience
- Category tags appropriate to the type ${type === 'things-to-do' ? '(e.g., Museum, Park, Historical Site, Street Art, Market, Gallery, Live Music, Theater, Architecture, Walking Tour)' : '(e.g., Fine Dining, Casual Restaurant, Café, Street Food, Bar, Pub, Local Cuisine, International, Bakery, Market)'}
- ${type === 'things-to-do' ? 'Best times to visit (e.g., "Early morning for fewer crowds", "Sunset for best views")' : 'Signature dishes or specialties (3-5 items)'}
- ${type === 'places-to-eat' ? 'Price range using $ symbols ($ = budget, $$ = moderate, $$$ = upscale, $$$$ = fine dining)' : 'Estimated visit duration'}
- Insider tips that demonstrate local knowledge

Return ONLY a valid JSON object with this exact structure:
{
  "mainstream": [
    {
      "name": "Specific Place Name",
      "category": "Category",
      "description": "Vivid 2-3 sentence description of the experience",
      "neighborhood": "Specific Neighborhood Name",
      ${type === 'things-to-do' 
        ? '"bestTime": "When to visit and why"'
        : '"specialties": ["Dish 1", "Dish 2", "Dish 3"], "priceRange": "$$"'
      },
      "localTip": "Insider advice that only a local would know"
    }
  ],
  "offTheBeaten": [
    {
      "name": "Hidden Gem Name",
      "category": "Category",
      "description": "Engaging 2-3 sentence description emphasizing uniqueness",
      "neighborhood": "Specific Neighborhood Name",
      ${type === 'things-to-do' 
        ? '"bestTime": "Optimal timing advice"'
        : '"specialties": ["Unique Item 1", "Unique Item 2", "Unique Item 3"], "priceRange": "$"'
      },
      "localTip": "Secret knowledge or hack that locals use"
    }
  ]
}

Be specific and authentic. Use real place names and neighborhoods for ${locationName}. Avoid generic descriptions.`

  try {
    const response = await spark.llm(prompt, 'gpt-4o', true)
    const data = JSON.parse(response) as GeoRecommendationsResponse
    
    if (!data.mainstream || !data.offTheBeaten) {
      throw new Error('Invalid response format from AI')
    }

    return data
  } catch (error) {
    console.error('Error generating geo recommendations:', error)
    throw new Error('Failed to generate recommendations. Please try again.')
  }
}
