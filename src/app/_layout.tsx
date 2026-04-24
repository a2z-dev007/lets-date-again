import '../../global.css';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { useRouter, useSegments } from 'expo-router';

export default function RootLayout() {
  const onboardingComplete = useUserStore((state) => state.onboardingComplete);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inApp = segments[0] !== 'onboarding';
    
    if (!onboardingComplete && inApp) {
      router.replace('/onboarding');
    } else if (onboardingComplete && !inApp) {
      router.replace('/home');
    }
  }, [onboardingComplete, segments]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
  );
}
