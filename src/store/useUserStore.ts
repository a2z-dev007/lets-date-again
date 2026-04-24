import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../services/mmkvStorage';

interface UserState {
  name: string;
  partnerName: string;
  onboardingComplete: boolean;
  setName: (name: string) => void;
  setPartnerName: (name: string) => void;
  completeOnboarding: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: '',
      partnerName: '',
      onboardingComplete: false,
      setName: (name) => set({ name }),
      setPartnerName: (name) => set({ partnerName: name }),
      completeOnboarding: () => set({ onboardingComplete: true }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
