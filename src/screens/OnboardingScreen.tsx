import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_400Regular_Italic } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular } from '@expo-google-fonts/inter';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [partner, setPartner] = useState('');
  const setStoreName = useUserStore((state) => state.setName);
  const setStorePartner = useUserStore((state) => state.setPartnerName);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  let [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
    Inter_400Regular,
  });

  if (!fontsLoaded) return null;

  const handleComplete = () => {
    if (name && partner) {
      setStoreName(name);
      setStorePartner(partner);
      completeOnboarding();
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-brand-peach px-8 justify-center"
    >
      <View>
        <Text className="text-4xl font-playfair-italic text-brand-teal mb-2">Welcome.</Text>
        <Text className="text-lg font-inter text-brand-teal/70 mb-12">
          Let's build a bridge back to each other.
        </Text>

        <View className="space-y-6">
          <View>
            <Text className="text-xs font-inter uppercase tracking-widest text-brand-teal/50 mb-2">Your Name</Text>
            <TextInput
              className="border-b border-brand-teal/20 py-2 text-xl font-playfair text-brand-teal"
              placeholder="What should we call you?"
              placeholderTextColor="#08504140"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="mt-8">
            <Text className="text-xs font-inter uppercase tracking-widest text-brand-teal/50 mb-2">Partner's Name</Text>
            <TextInput
              className="border-b border-brand-teal/20 py-2 text-xl font-playfair text-brand-teal"
              placeholder="Who are you here for?"
              placeholderTextColor="#08504140"
              value={partner}
              onChangeText={setPartner}
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleComplete}
          disabled={!name || !partner}
          className={`mt-16 py-4 rounded-full items-center ${name && partner ? 'bg-brand-teal' : 'bg-brand-teal/20'}`}
        >
          <Text className="text-white font-inter font-medium tracking-wide">Enter the Bridge</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
