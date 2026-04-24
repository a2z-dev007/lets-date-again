import { useDayStore } from '../store/useDayStore';

export const resolveCurrentScreen = () => {
  const { currentDay, day1, day2, day3, day4, day5 } = useDayStore.getState();

  if (!day1.complete) return 'Day1';
  if (!day2.complete) return 'Day2';
  if (!day3.complete) return 'Day3';
  if (!day4.complete) return 'Day4';
  if (!day5.complete) return 'Day5';
  
  return 'Home';
};
