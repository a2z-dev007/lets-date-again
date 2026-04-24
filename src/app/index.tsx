import { Redirect } from 'expo-router';
import { useUserStore } from '../store/useUserStore';

export default function Index() {
  const onboardingComplete = useUserStore((state) => state.onboardingComplete);
  return onboardingComplete ? <Redirect href="/home" /> : <Redirect href="/onboarding" />;
}
