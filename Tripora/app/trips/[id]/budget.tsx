import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { PieChart, BarChart } from 'react-native-chart-kit';
import ScreenWrapper from '../../../src/components/ScreenWrapper';
import BudgetCategoryCard from '../../../src/components/BudgetCategoryCard';
import { useCameraStore } from '../../../src/store/cameraStore';
import { useTripStore } from '../../../src/store/tripStore';
import { toast } from '../../../src/store/toastStore';
import EmptyState from '../../../src/components/EmptyState';

const screenWidth = Dimensions.get('window').width;

export default function TripBudgetScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const { activeTrips, updateTripCost } = useTripStore();
  const trip = activeTrips[id as string] || activeTrips['t-101'];
  
  // Camera integration for Receipts
  const { capturedUri, activeMode, clearCapturedImage } = useCameraStore();
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  useEffect(() => {
    if (activeMode === 'receipt' && capturedUri) {
      setReceiptImage(capturedUri);
      clearCapturedImage();
    }
  }, [activeMode, capturedUri]);

  if (!trip) return null;

  const chartData = [
    { name: 'Activities', amount: trip.costBreakdown.activities, color: '#7C3AED', legendFontColor: '#374151', legendFontSize: 13 },
    { name: 'Transport', amount: trip.costBreakdown.transport, color: '#3B82F6', legendFontColor: '#374151', legendFontSize: 13 },
    { name: 'Stay', amount: trip.costBreakdown.accommodation, color: '#10B981', legendFontColor: '#374151', legendFontSize: 13 },
    { name: 'Meals', amount: trip.costBreakdown.food, color: '#F59E0B', legendFontColor: '#374151', legendFontSize: 13 },
    { name: 'Misc', amount: trip.costBreakdown.miscellaneous, color: '#EC4899', legendFontColor: '#374151', legendFontSize: 13 }
  ];

  const currentTotal = trip.estimatedTotalCost;
  const budgetLimit = trip.budgetLimit;
  const isOverBudget = currentTotal > budgetLimit;
  const percentageUsed = budgetLimit > 0 ? (currentTotal / budgetLimit) * 100 : 0;
  
  const travelDaysCount = 5; // Replace with moment diff later
  const avgCostPerDay = travelDaysCount > 0 ? (currentTotal / travelDaysCount) : 0;

  const handleUpdateAmount = async (category: keyof typeof trip.costBreakdown, val: number) => {
    try {
      await updateTripCost(id as string, { [category]: val });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update cost');
    }
  };

  const getProgressColor = () => {
    if (percentageUsed <= 70) return '#10B981'; // Green
    if (percentageUsed <= 90) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  return (
    <ScreenWrapper className="bg-gray-50 flex-1">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 border-b border-gray-100 flex-row justify-between items-center z-10 bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Budget Breakdown</Text>
        <TouchableOpacity onPress={() => router.push(`/trips/${id}/insights` as any)} className="p-2 -mr-2 bg-purple-100 rounded-full">
          <MaterialIcons name="insights" size={20} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        
        {/* Warning & Target UI */}
        {isOverBudget ? (
           <View className="bg-red-50 p-5 rounded-3xl mb-8 border border-red-200">
              <View className="flex-row items-center mb-3">
                <MaterialIcons name="warning" size={24} color="#EF4444" />
                <Text className="text-red-700 ml-2 font-bold text-lg">Over Budget by ${(currentTotal - budgetLimit).toLocaleString()}</Text>
              </View>
              <Text className="text-red-600 mb-2 text-sm leading-5">Your current estimate is ${currentTotal.toLocaleString()}, which exceeds your target of ${budgetLimit.toLocaleString()}.</Text>
           </View>
        ) : (
          <View className="bg-white p-5 rounded-3xl mb-8 border border-gray-100 shadow-sm">
            <View className="flex-row justify-between items-end mb-2">
              <Text className="text-gray-500 font-bold">Budget Status</Text>
              <Text className="text-gray-900 font-black text-lg">${currentTotal.toLocaleString()} <Text className="text-gray-400 text-sm font-medium">/ ${budgetLimit.toLocaleString()}</Text></Text>
            </View>
            <View className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
               <View className="h-full rounded-full" style={{ width: `${Math.min(percentageUsed, 100)}%`, backgroundColor: getProgressColor() }} />
            </View>
            <Text className="text-right text-xs font-bold" style={{ color: getProgressColor() }}>{percentageUsed.toFixed(1)}% Used</Text>
          </View>
        )}

        {/* Chart Card */}
        {currentTotal === 0 ? (
          <View className="mb-6">
            <EmptyState 
              title="No Expenses Logged" 
              description="You haven't added any receipts or expenses. Start by setting your category estimates below or scanning a receipt."
              iconName="account-balance-wallet"
            />
          </View>
        ) : (
          <View className="bg-white rounded-3xl pt-6 pb-6 mb-8 shadow-sm border border-gray-100 items-center">
             <Text className="text-gray-500 font-medium mb-1">{trip.isOptimized ? 'Optimized Total' : 'Estimated Total'}</Text>
             <Text className="text-4xl font-black text-gray-900 mb-2">${currentTotal.toLocaleString()}</Text>
             
             <View className="flex-row items-center justify-center mb-4 space-x-2">
               {trip.isOptimized && trip.savings > 0 && (
                 <View className="bg-green-100 px-3 py-1 rounded-md ml-1 shadow-sm border border-green-200 divide-y flex-row">
                   <Text className="text-green-700 text-xs font-bold">Saved ${trip.savings.toLocaleString()}</Text>
                 </View>
               )}
               <View className="bg-purple-100 px-3 py-1 rounded-md ml-2 shadow-sm border border-purple-200 divide-y flex-row">
                 <Text className="text-primary text-xs font-bold">Avg ${avgCostPerDay.toFixed(2)}/day</Text>
               </View>
             </View>

             <View className="flex-row rounded-full bg-gray-100 p-1 mb-5">
               <TouchableOpacity 
                 onPress={() => setChartType('pie')} 
                 className={`px-6 py-1.5 rounded-full ${chartType === 'pie' ? 'bg-white shadow-sm' : ''}`}
               >
                 <Text className={`font-bold text-sm ${chartType === 'pie' ? 'text-primary' : 'text-gray-500'}`}>Pie Chart</Text>
               </TouchableOpacity>
               <TouchableOpacity 
                 onPress={() => setChartType('bar')} 
                 className={`px-6 py-1.5 rounded-full ${chartType === 'bar' ? 'bg-white shadow-sm' : ''}`}
               >
                 <Text className={`font-bold text-sm ${chartType === 'bar' ? 'text-primary' : 'text-gray-500'}`}>Bar Graph</Text>
               </TouchableOpacity>
             </View>
             
             {chartType === 'pie' ? (
               <PieChart
                 data={chartData}
                 width={screenWidth - 60}
                 height={200}
                 chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                 accessor={"amount"}
                 backgroundColor={"transparent"}
                 paddingLeft={"15"}
                 center={[10, 0]}
                 absolute
               />
             ) : (
               <BarChart
                 data={{
                   labels: ["Activities", "Transport", "Stay", "Meals"],
                   datasets: [{ data: [trip.costBreakdown.activities, trip.costBreakdown.transport, trip.costBreakdown.accommodation, trip.costBreakdown.food] }]
                 }}
                 width={screenWidth - 90}
                 height={220}
                 yAxisLabel="$"
                 yAxisSuffix=""
                 fromZero={true}
                 showValuesOnTopOfBars={true}
                 chartConfig={{
                   backgroundColor: '#fff',
                   backgroundGradientFrom: '#fff',
                   backgroundGradientTo: '#fff',
                   fillShadowGradientFrom: '#7C3AED',
                   fillShadowGradientFromOpacity: 1,
                   fillShadowGradientTo: '#7C3AED',
                   fillShadowGradientToOpacity: 0.6,
                   decimalPlaces: 0,
                   color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
                   labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
                   barPercentage: 0.7,
                 }}
                 style={{ borderRadius: 16 }}
               />
             )}
          </View>
        )}

        <View className="flex-row justify-between items-center mb-4 mt-2">
           <Text className="text-xl font-bold text-gray-900">Categories & Expenses</Text>
           <TouchableOpacity 
             onPress={() => router.push('/camera?mode=receipt')}
             className="bg-purple-100 flex-row items-center px-3 py-1.5 rounded-xl border border-purple-200"
           >
              <MaterialIcons name="receipt" size={16} color="#7C3AED" />
              <Text className="text-primary font-bold text-sm ml-1">Scan Receipt</Text>
           </TouchableOpacity>
        </View>

        {receiptImage && (
           <View className="mb-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                 <Image source={{ uri: receiptImage }} style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: '#F3F4F6' }} />
                 <View className="ml-3 flex-1">
                    <Text className="font-bold text-gray-900">Recent Receipt</Text>
                    <Text className="text-green-600 text-xs font-bold mt-0.5">Ready to attach</Text>
                 </View>
              </View>
              <TouchableOpacity onPress={() => setReceiptImage(null)} className="p-2 bg-gray-50 rounded-full border border-gray-200">
                 <MaterialIcons name="close" size={20} color="#4B5563" />
              </TouchableOpacity>
           </View>
        )}
        
        <BudgetCategoryCard onAmountChange={(val) => handleUpdateAmount('transport', val)} title="Transport" amount={trip.costBreakdown.transport} percentage={currentTotal > 0 ? (trip.costBreakdown.transport/currentTotal)*100 : 0} color="#3B82F6" iconName="directions-car" />
        <BudgetCategoryCard onAmountChange={(val) => handleUpdateAmount('accommodation', val)} title="Stay" amount={trip.costBreakdown.accommodation} percentage={currentTotal > 0 ? (trip.costBreakdown.accommodation/currentTotal)*100 : 0} color="#10B981" iconName="hotel" />
        <BudgetCategoryCard onAmountChange={(val) => handleUpdateAmount('activities', val)} title="Activities" amount={trip.costBreakdown.activities} percentage={currentTotal > 0 ? (trip.costBreakdown.activities/currentTotal)*100 : 0} color="#7C3AED" iconName="local-activity" />
        <BudgetCategoryCard onAmountChange={(val) => handleUpdateAmount('food', val)} title="Meals" amount={trip.costBreakdown.food} percentage={currentTotal > 0 ? (trip.costBreakdown.food/currentTotal)*100 : 0} color="#F59E0B" iconName="restaurant" />
        <BudgetCategoryCard onAmountChange={(val) => handleUpdateAmount('miscellaneous', val)} title="Misc" amount={trip.costBreakdown.miscellaneous} percentage={currentTotal > 0 ? (trip.costBreakdown.miscellaneous/currentTotal)*100 : 0} color="#EC4899" iconName="category" />

      </ScrollView>
    </ScreenWrapper>
  );
}
