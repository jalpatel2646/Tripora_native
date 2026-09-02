export interface TripPlanActivity {
  title: string;
  type: string;
  estimatedCost: number;
  durationHours: number;
  description: string;
}

export interface TripPlanStop {
  city: string;
  days: number;
  activities: TripPlanActivity[];
}

export interface TripPlanDayWise {
  day: number;
  city: string;
  activities: string[];
}

export interface TripPlanResponse {
  tripTitle: string;
  totalEstimatedCost: number;
  currency: 'INR' | 'USD' | string;
  totalDays: number;
  stops: TripPlanStop[];
  dayWiseItinerary: TripPlanDayWise[];
  travelOrder: string[];
  summary: string;
}

const SYSTEM_PROMPT = `
You are an expert AI Travel Planner for the Tripora app.
Your task is to create a detailed travel itinerary based on the user's natural language request.

You MUST respond strictly with VALID JSON data. DO NOT include markdown blocks like \`\`\`json. Start directly with the JSON object.
Your JSON must strictly match the following TypeScript interface structure:

{
  "tripTitle": string,
  "totalEstimatedCost": number,
  "currency": "INR", // Or appropriately deduced currency
  "totalDays": number,
  "stops": [
    {
      "city": string,
      "days": number,
      "activities": [
        {
          "title": string,
          "type": string, // e.g., "Sightseeing", "Food", "Leisure", "Transport"
          "estimatedCost": number,
          "durationHours": number,
          "description": string
        }
      ]
    }
  ],
  "dayWiseItinerary": [
    {
      "day": number,
      "city": string,
      "activities": string[] // Just string titles of the activities planned for this day
    }
  ],
  "travelOrder": string[], // Name of cities in order
  "summary": string // A brief exciting 2-sentence summary of the trip
}

Make the itinerary realistic, logically ordered, and ensure costs and descriptions make sense.
`;

export const generateTripPlanService = async (userPrompt: string): Promise<TripPlanResponse> => {
  const apiKey = process.env.OPENROUTER_API_KEY || ''; // Usually stored here in backend
  
  if (!apiKey || apiKey === 'YOUR_OPENROUTER_API_KEY_HERE') {
      throw new Error("Missing or invalid OpenRouter API Key in backend .env file");
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://tripora.com',
        'X-Title': 'Tripora Travel App',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        max_tokens: 2500,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response body returned from AI provider.');
    }
    
    const cleanedContent = content.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

    const parsed = JSON.parse(cleanedContent) as TripPlanResponse;

    // Advanced Validation Could Go Here
    if (!parsed.tripTitle || !parsed.stops || !parsed.dayWiseItinerary) {
        throw new Error('AI Response is missing critical required fields.');
    }

    return parsed;
  } catch (error: any) {
    console.error('AI Service Error:', error);
    throw new Error('Failed to generate trip plan. ' + (error?.message || 'Please try again later.'));
  }
};
