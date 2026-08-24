import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { PieChart, BarChart } from 'react-native-chart-kit';
import ScreenWrapper from '../../../src/components/ScreenWrapper';
import BudgetCategoryCard from '../../../src/components/BudgetCategoryCard';
import { useCameraStore } from '../../../src/store/cameraStore';

const screenWidth = Dimensions.get('window').width;

export default function TripBudgetScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [appliedSuggestions, setAppliedSuggestions] = useState<number[]>([]);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  // Camera integration for Receipts
  const { capturedUri, activeMode, clearCapturedImage } = useCameraStore();
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  useEffect(() => {
    if (activeMode === 'receipt' && capturedUri) {
      setReceiptImage(capturedUri);
      clearCapturedImage();
    }
  }, [activeMode, capturedUri]);

  const chartData = [
    { name: 'Activities', amount: 120, color: '#7C3AED', legendFontColor: '#374151', legendFontSize: 13 },
    { name: 'Transport', amount: 150, color: '#3B82F6', legendFontColor: '#374151', legendFontSize: 13 },
    { name: 'Stay', amount: 100, color: '#10B981', legendFontColor: '#374151', legendFontSize: 13 },
    { name: 'Meals', amount: 60, color: '#F59E0B', legendFontColor: '#374151', legendFontSize: 13 }
  ];

  const baseTotal = chartData.reduce((acc, curr) => acc + curr.amount, 0);
  
  const suggestions = [
    { id: 1, text: 'Switch to a 3-star hotel nearby', savings: 45 },
    { id: 2, text: 'Remove "Premium City Tour"', savings: 30 },
  ];

  const totalSavings = appliedSuggestions.reduce((acc, currId) => {
    const sug = suggestions.find(s => s.id === currId);
    return acc + (sug ? sug.savings : 0);
  }, 0);

  const currentTotal = baseTotal - totalSavings;
  const budgetLimit = 400; // Mock limit
  const isOverBudget = currentTotal > budgetLimit;
  
  const travelDaysCount = 5; 
  const avgCostPerDay = travelDaysCount > 0 ? (currentTotal / travelDaysCount) : 0;

  const toggleSuggestion = (sId: number) => {
    setAppliedSuggestions(prev => 
      prev.includes(sId) ? prev.filter(id => id !== sId) : [...prev, sId]
    );
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
        
        {/* Warning & AI Optimization */}
        {isOverBudget ? (
           <View className="bg-red-50 p-5 rounded-3xl mb-8 border border-red-200">
              <View className="flex-row items-center mb-3">
                <MaterialIcons name="warning" size={24} color="#EF4444" />
                <Text className="text-red-700 ml-2 font-bold text-lg">Over Budget by ${currentTotal - budgetLimit}</Text>
              </View>
              <Text className="text-red-600 mb-4 text-sm leading-5">Your current estimate is ${currentTotal}, which exceeds your target of ${budgetLimit}.</Text>
              
              <View className="bg-white rounded-2xl p-4 shadow-sm border border-red-100">
                <View className="flex-row items-center mb-3 space-x-2">
                  <Text className="text-lg">✨</Text>
                  <Text className="text-gray-900 font-bold ml-1">AI Smart Savings</Text>
                </View>
                {suggestions.map(sug => {
                  const isApplied = appliedSuggestions.includes(sug.id);
                  return (
                    <TouchableOpacity 
                      key={sug.id} 
                      onPress={() => toggleSuggestion(sug.id)}
                      className={`flex-row items-center p-3 mb-2 rounded-xl border ${isApplied ? 'border-primary bg-purple-50' : 'border-gray-200 bg-gray-50'}`}
                      activeOpacity={0.7}
                    >
                      <View className={`w-6 h-6 rounded-full border items-center justify-center mr-3 ${isApplied ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                        {isApplied && <MaterialIcons name="check" size={16} color="white" />}
                      </View>
                      <View className="flex-1">
                        <Text className={`text-sm ${isApplied ? 'text-primary font-medium' : 'text-gray-700'}`}>{sug.text}</Text>
                        <Text className={`text-xs mt-0.5 ${isApplied ? 'text-purple-600' : 'text-green-600'}`}>Save ${sug.savings}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
           </View>
        ) : (
          <View className="bg-green-50 p-4 rounded-2xl mb-8 border border-green-200 flex-row items-center">
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text className="text-green-700 ml-2 font-medium flex-1">Looking good! You are within your ${budgetLimit} budget.</Text>
          </View>
        )}

        {/* Chart Card */}
        <View className="bg-white rounded-3xl pt-6 pb-6 mb-8 shadow-sm border border-gray-100 items-center">
           <Text className="text-gray-500 font-medium mb-1">Optimized Total</Text>
           <Text className="text-4xl font-bold text-gray-900 mb-2">${currentTotal}</Text>
           
           <View className="flex-row items-center justify-center mb-4 space-x-2">
             {totalSavings > 0 && (
               <View className="bg-green-100 px-3 py-1 rounded-md ml-1 shadow-sm border border-green-200 divide-y flex-row">
                 <Text className="text-green-700 text-xs font-bold">Saved ${totalSavings}</Text>
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
                 datasets: [{ data: [120, 150, 100, 60] }]
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
        
        <BudgetCategoryCard title="Transport" amount={150} percentage={(150/baseTotal)*100} color="#3B82F6" iconName="directions-car" />
        <BudgetCategoryCard title="Stay" amount={100} percentage={(100/baseTotal)*100} color="#10B981" iconName="hotel" />
        <BudgetCategoryCard title="Activities" amount={120} percentage={(120/baseTotal)*100} color="#7C3AED" iconName="local-activity" />
        <BudgetCategoryCard title="Meals & Other" amount={60} percentage={(60/baseTotal)*100} color="#F59E0B" iconName="restaurant" />

      </ScrollView>
    </ScreenWrapper>
  );
}
