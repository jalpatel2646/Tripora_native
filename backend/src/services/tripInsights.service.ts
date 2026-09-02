import { Trip } from '../models/Trip';
import mongoose from 'mongoose';

export const getTripInsightsService = async (tripId: string) => {
  const trip = await Trip.findById(tripId).populate('stops').lean();
  
  if (!trip) {
    throw new Error('Trip not found');
  }

  // Assuming `stops` is populated with stop objects, and we need activities.
  // Wait, stops might not have activities populated. We need to aggregate.
  
  const pipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(tripId) } },
    {
      $lookup: {
        from: 'stops',
        localField: 'stops',
        foreignField: '_id',
        as: 'stopDetails'
      }
    },
    {
      $unwind: { path: '$stopDetails', preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: {
        from: 'activities',
        localField: 'stopDetails.activities',
        foreignField: '_id',
        as: 'stopDetails.activityDocs'
      }
    },
    {
       $group: {
         _id: '$_id',
         trip: { $first: '$$ROOT' },
         stopDetails: { $push: '$stopDetails' }
       }
    }
  ];

  const result = await Trip.aggregate(pipeline);
  const tripData = result[0];

  if (!tripData) throw new Error('Trip not found');

  const startDate = new Date(tripData.trip.startDate);
  const endDate = new Date(tripData.trip.endDate);
  
  const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  let activityCount = 0;
  let estimatedDistance = 0; // if coordinates available, otherwise guess distance per stop
  let travelTimeMin = 0;
  let totalActivityTimeHours = 0;
  const citiesCount = tripData.stopDetails.length;

  for (let i = 0; i < tripData.stopDetails.length; i++) {
     const stop = tripData.stopDetails[i];
     if (stop.activityDocs) {
        activityCount += stop.activityDocs.length;
        
        // Sum activity durations if defined, defaulting to 2 hours
        for (const act of stop.activityDocs) {
           totalActivityTimeHours += act.durationHours || 2;
        }
     }
     
     if (i > 0) {
       const prevStop = tripData.stopDetails[i-1];
       if (prevStop.latitude && prevStop.longitude && stop.latitude && stop.longitude) {
           const dist = calculateDistance(prevStop.latitude, prevStop.longitude, stop.latitude, stop.longitude);
           estimatedDistance += dist;
           travelTimeMin += (dist / 80) * 60; // assume 80km/h avg
       }
     }
  }

  // Activity Density Calculation
  const totalFreeTimeHours = (days * 12) - totalActivityTimeHours - (travelTimeMin / 60); // Assume 12 hours active a day
  const freeTimePerDay = Math.max(0, totalFreeTimeHours / days);
  
  let tripHealth = "Balanced Pace";
  let healthDescription = "Your itinerary is well-balanced with a good mix of activities and free time.";
  
  if (freeTimePerDay < 2) {
      tripHealth = "Fast Pace";
      healthDescription = "Your itinerary is heavily packed! Prepare for a busy schedule with very little downtime.";
  } else if (freeTimePerDay > 8) {
      tripHealth = "Relaxed Pace";
      healthDescription = "You have plenty of free time to relax and explore spontaneously.";
  }

  // Cost Insights
  const costInsights = [];
  const breakdown = tripData.trip.costBreakdown;
  const totalCost = Object.values(breakdown).reduce((acc: any, val: any) => acc + val, 0) as number;
  
  if (totalCost > 0) {
      const topCategory = Object.entries(breakdown).reduce((a, b) => (b[1] as number) > (a[1] as number) ? b : a);
      if (topCategory[1] > 0) {
         costInsights.push(`${topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1)} is your largest expense.`)
      }
      
      const actPercentage = (breakdown.activities / totalCost) * 100;
      if (actPercentage > 0) {
         costInsights.push(`You are spending ${actPercentage.toFixed(0)}% of your budget on activities.`);
      }
  }

  // Savings insight
  if (tripData.trip.savings > 0) {
       costInsights.push(`Your current trip is $${tripData.trip.savings} under budget.`);
  }

  return {
    travelDays: days,
    cities: citiesCount,
    activityCount,
    estimatedDistance: estimatedDistance.toFixed(0) + ' km',
    freeTime: freeTimePerDay.toFixed(1) + ' hr/day',
    tripHealth,
    healthDescription,
    costInsights
  };
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a)); 
}
