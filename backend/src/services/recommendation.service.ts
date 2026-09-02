// A clean list of destinations available to be recommended
export const REAL_DESTINATIONS = [
  {
    id: "dest-1",
    name: "Paris",
    country: "France",
    imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600",
    tags: ["History", "Art", "Food", "Luxury"],
    costLevel: 4,
    description: "The city of light, famous for its culture and art."
  },
  {
    id: "dest-2",
    name: "Bali",
    country: "Indonesia",
    imageUrl: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600",
    tags: ["Beach", "Nature", "Relaxation", "Adventure"],
    costLevel: 2,
    description: "Tropical paradise known for beaches and temples."
  },
  {
    id: "dest-3",
    name: "Kyoto",
    country: "Japan",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600",
    tags: ["History", "Culture", "Nature"],
    costLevel: 3,
    description: "Historical heart of Japan with stunning temples."
  },
  {
    id: "dest-4",
    name: "Rome",
    country: "Italy",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600",
    tags: ["History", "Food", "Architecture"],
    costLevel: 4,
    description: "Ancient ruins and incredible cuisine."
  },
  {
    id: "dest-5",
    name: "Cape Town",
    country: "South Africa",
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600",
    tags: ["Adventure", "Nature", "Beach"],
    costLevel: 3,
    description: "Mountains meeting the ocean."
  },
  {
    id: "dest-6",
    name: "New York City",
    country: "USA",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600",
    tags: ["Urban", "Nightlife", "Shopping", "Food"],
    costLevel: 5,
    description: "The city that never sleeps."
  }
];

export const generateRecommendations = (userPreferences: string[]) => {
  // If no preferences, just return some trending places
  if (!userPreferences || userPreferences.length === 0) {
    return REAL_DESTINATIONS.slice(0, 3).map(dest => ({
      ...dest,
      matchScore: 0.5,
      reason: "Popular destinations to explore."
    }));
  }

  const scored = REAL_DESTINATIONS.map(dest => {
    let score = 0;
    let matchReasons: string[] = [];

    dest.tags.forEach(tag => {
      // Case insensitive match
      if (userPreferences.some(pref => pref.toLowerCase() === tag.toLowerCase())) {
        score += 1;
        matchReasons.push(tag);
      }
    });

    const normalizedScore = score / Math.max(userPreferences.length, 1);
    
    // Generate explanation
    let reason = "A great place to discover.";
    if (matchReasons.length > 0) {
      reason = `Matches your interest in ${matchReasons.join(' & ')}.`;
    }

    return {
      ...dest,
      matchScore: normalizedScore,
      reason
    };
  });

  // Sort by highest match, then return top ones
  scored.sort((a, b) => b.matchScore - a.matchScore);
  
  // Filter out zero match if we have strict preferences, or just return top 4
  const recommended = scored.filter(s => s.matchScore > 0);
  
  return recommended.length > 0 ? recommended.slice(0, 4) : scored.slice(0, 4);
};
