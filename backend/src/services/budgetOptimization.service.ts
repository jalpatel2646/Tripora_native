import { Trip } from '../models/Trip';

export interface CostBreakdown {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
}

export const optimizeBudgetService = (
  currentTotal: number, 
  budget: number, 
  costBreakdown: CostBreakdown
) => {
  if (currentTotal <= budget) {
    return {
      status: 'WITHIN_BUDGET',
      message: 'Trip is within budget.',
      optimizedTotal: currentTotal,
      savings: 0,
      suggestions: [],
      optimizedBreakdown: costBreakdown
    };
  }

  const requiredSavings = currentTotal - budget;
  let remainingSavings = requiredSavings;
  const suggestions: any[] = [];
  const optimizedBreakdown = { ...costBreakdown };

  // Heuristic-based real optimizations (Example Candidate generation)
  // We can look at the breakdown. Accommodation and Transport are usually most flexible.

  if (costBreakdown.accommodation > 0 && remainingSavings > 0) {
    const accSavings = Math.min(remainingSavings, Math.floor(costBreakdown.accommodation * 0.3)); // up to 30% cut on hotels
    if (accSavings > 0) {
      optimizedBreakdown.accommodation -= accSavings;
      remainingSavings -= accSavings;
      suggestions.push({
        id: `opt-acc-${Date.now()}`,
        type: 'accommodation',
        title: 'Switch to a better-value hotel or Airbnb',
        originalCost: costBreakdown.accommodation,
        newCost: optimizedBreakdown.accommodation,
        savings: accSavings
      });
    }
  }

  if (costBreakdown.transport > 0 && remainingSavings > 0) {
    const transSavings = Math.min(remainingSavings, Math.floor(costBreakdown.transport * 0.2)); 
    if (transSavings > 0) {
      optimizedBreakdown.transport -= transSavings;
      remainingSavings -= transSavings;
      suggestions.push({
        id: `opt-trans-${Date.now()}`,
        type: 'transport',
        title: 'Use local transport instead of private cabs',
        originalCost: costBreakdown.transport,
        newCost: optimizedBreakdown.transport,
        savings: transSavings
      });
    }
  }
  
  if (costBreakdown.activities > 0 && remainingSavings > 0) {
    const actSavings = Math.min(remainingSavings, costBreakdown.activities); // cut up to all activities 
    if (actSavings > 0) {
      optimizedBreakdown.activities -= actSavings;
      remainingSavings -= actSavings;
      suggestions.push({
        id: `opt-act-${Date.now()}`,
        type: 'activities',
        title: 'Replace paid activities with free alternatives',
        originalCost: costBreakdown.activities,
        newCost: optimizedBreakdown.activities,
        savings: actSavings
      });
    }
  }

  // Calculate actual total after suggestions
  const optimizedTotal = currentTotal - (requiredSavings - remainingSavings);
  const actualSavings = currentTotal - optimizedTotal;

  return {
    status: 'OPTIMIZED',
    currentTotal,
    budget,
    requiredSavings,
    actualSavings,
    suggestions,
    optimizedBreakdown,
    optimizedTotal
  };
};
