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

import { apiFetch } from './api';

export const generateTripPlan = async (userPrompt: string): Promise<TripPlanResponse> => {
  try {
    const response = await apiFetch('/api/ai/plan', {
      method: 'POST',
      body: JSON.stringify({ prompt: userPrompt })
    });
    
    return response.data;
  } catch (error: any) {
    console.error('AI Service Error:', error);
    throw new Error('Failed to generate trip plan. ' + (error?.message || 'Please try again later.'));
  }
};
