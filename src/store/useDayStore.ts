import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../services/mmkvStorage';

interface DayState {
  currentDay: number;
  day1: { complete: boolean; sliderScore: number; personalityType: string };
  day2: { complete: boolean; mood: string; reflection: string };
  day3: { complete: boolean; predictionScore: number };
  day4: { complete: boolean; memoryAdded: boolean };
  day5: { complete: boolean; badgeAwarded: string };
  completeDay: (day: number, data: any) => void;
  resetProgress: () => void;
}

export const useDayStore = create<DayState>()(
  persist(
    (set) => ({
      currentDay: 1,
      day1: { complete: false, sliderScore: 0, personalityType: '' },
      day2: { complete: false, mood: '', reflection: '' },
      day3: { complete: false, predictionScore: 0 },
      day4: { complete: false, memoryAdded: false },
      day5: { complete: false, badgeAwarded: '' },
      completeDay: (day, data) => 
        set((state) => ({
          [`day${day}`]: { ...state[`day${day}`], ...data, complete: true },
          currentDay: Math.min(day + 1, 6),
        })),
      resetProgress: () => set({
        currentDay: 1,
        day1: { complete: false, sliderScore: 0, personalityType: '' },
        day2: { complete: false, mood: '', reflection: '' },
        day3: { complete: false, predictionScore: 0 },
        day4: { complete: false, memoryAdded: false },
        day5: { complete: false, badgeAwarded: '' },
      }),
    }),
    {
      name: 'day-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
