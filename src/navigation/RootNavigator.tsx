import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useUserStore } from '../store/useUserStore';

// Onboarding
import OnboardingScreen from '../screens/OnboardingScreen';

// Home
import HomeScreen from '../screens/HomeScreen';

// Day 1
import Day1Screen from '../screens/day1/Day1Screen';
import { Day1HonestMoment } from '../screens/day1/Day1HonestMoment';
import { Day1SparkQuiz } from '../screens/day1/Day1SparkQuiz';
import { Day1PersonalityResult } from '../screens/day1/Day1PersonalityResult';

// Day 2–5
import Day2Screen from '../screens/day2/Day2Screen';
import Day3Screen from '../screens/day3/Day3Screen';
import Day4Screen from '../screens/day4/Day4Screen';
import Day5Screen from '../screens/day5/Day5Screen';

// Day 3 sub-screens
import Day3AppreciationSnap from '../screens/day3/Day3AppreciationSnap';

// Day 4 sub-screens
import Day4DailyTwo from '../screens/day4/Day4DailyTwo';

// Day 5 sub-screens
import Day5TheLetter from '../screens/day5/Day5TheLetter';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Day1: undefined;
  Day1HonestMoment: { score: number; segment: string };
  Day1SparkQuiz: { score: number };
  Day1PersonalityResult: { score: number; type: string };
  Day2: undefined;
  Day3: undefined;
  Day3AppreciationSnap: undefined;
  Day4: undefined;
  Day4DailyTwo: undefined;
  Day5: undefined;
  Day5TheLetter: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const onboardingComplete = useUserStore((state) => state.onboardingComplete);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: { opacity: current.progress },
        }),
      }}
    >
      {!onboardingComplete ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          {/* Day 1 flow */}
          <Stack.Screen name="Day1" component={Day1Screen} />
          <Stack.Screen name="Day1HonestMoment" component={Day1HonestMoment} />
          <Stack.Screen name="Day1SparkQuiz" component={Day1SparkQuiz} />
          <Stack.Screen name="Day1PersonalityResult" component={Day1PersonalityResult} />
          {/* Days 2–5 */}
          <Stack.Screen name="Day2" component={Day2Screen} />
          <Stack.Screen name="Day3" component={Day3Screen} />
          <Stack.Screen name="Day3AppreciationSnap" component={Day3AppreciationSnap} />
          <Stack.Screen name="Day4" component={Day4Screen} />
          <Stack.Screen name="Day4DailyTwo" component={Day4DailyTwo} />
          <Stack.Screen name="Day5" component={Day5Screen} />
          <Stack.Screen name="Day5TheLetter" component={Day5TheLetter} />
        </>
      )}
    </Stack.Navigator>
  );
};
