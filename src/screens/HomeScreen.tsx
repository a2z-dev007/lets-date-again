import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { useDayStore } from '../store/useDayStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Heart, Sparkles, Mirror, BookOpen, Award } from 'lucide-react-native';

export default function HomeScreen() {
  const name = useUserStore((state) => state.name);
  const currentDay = useDayStore((state) => state.currentDay);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const days = [
    { title: 'The Spark Check', icon: Sparkles, day: 1, route: 'Day1' },
    { title: 'The Mood Room', icon: Heart, day: 2, route: 'Day2' },
    { title: 'The Mirror Game', icon: Mirror, day: 3, route: 'Day3' },
    { title: 'The Memory Jar', icon: BookOpen, day: 4, route: 'Day4' },
    { title: 'The Celebration', icon: Award, day: 5, route: 'Day5' },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-8 pt-20 pb-12">
        <Text className="text-sm font-inter text-brand-teal/50 uppercase tracking-widest mb-2">Hello, {name}</Text>
        <Text className="text-4xl font-playfair text-brand-teal">Your 5-Day Journey</Text>
      </View>

      <View className="px-6 space-y-4">
        {days.map((item, index) => {
          const isLocked = item.day > currentDay;
          const isComplete = item.day < currentDay;
          const isActive = item.day === currentDay;

          return (
            <TouchableOpacity
              key={index}
              disabled={isLocked}
              onPress={() => navigation.navigate(item.route as any)}
              className={`p-6 rounded-3xl border ${
                isActive ? 'bg-brand-peach border-brand-rose' : 
                isComplete ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-100 opacity-50'
              } flex-row items-center justify-between mb-4`}
            >
              <View className="flex-row items-center">
                <View className={`w-12 h-12 rounded-2xl items-center justify-center ${isActive ? 'bg-white' : 'bg-slate-100'}`}>
                  <item.icon size={24} color={isActive ? "#085041" : "#94a3b8"} />
                </View>
                <View className="ml-4">
                  <Text className="text-xs font-inter text-slate-400 uppercase tracking-widest">Day {item.day}</Text>
                  <Text className={`text-xl font-playfair ${isActive ? 'text-brand-teal' : 'text-slate-500'}`}>
                    {item.title}
                  </Text>
                </View>
              </View>
              {isComplete && (
                <View className="bg-emerald-100 px-3 py-1 rounded-full">
                  <Text className="text-emerald-700 text-[10px] uppercase font-bold tracking-tighter">Done</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
