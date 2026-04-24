# Let's Date Again (LDA) - Product Requirements Document

## 1. Vision
Transform relationship maintenance into a daily 10-minute micro-habit that helps committed partners communicate better and feel more intentional.

## 2. Technical Stack
- **Framework**: React Native Expo (SDK 54)
- **Styling**: NativeWind (Tailwind CSS) v4
- **State**: Zustand (Persisted)
- **Storage**: react-native-mmkv
- **Animations**: react-native-reanimated
- **Haptics**: expo-haptics
- **Typography**: Playfair Display (Serif), Inter (Sans)

## 3. Product Architecture: "The Bridge" (5-Day Solo Flow)
A 5-day unauthenticated experience to build user investment before partner invitation.

### Day 1: The Spark Check
- Connection Slider (1-10)
- Spark Quiz (7 A/B Questions)
- Personality Result (4 Types)

### Day 2: The Mood Room
- Mood Picker (8 Options)
- Candle Visualization
- Reflection Prompt

### Day 3: The Mirror Game
- Appreciation Snap (Camera)
- Assumptions Test (Guessing partner's answers)
- Prediction Score

### Day 4: The Memory Jar
- Drop memories (Text/Emoji)
- Tiny Compliment (1 word)
- Daily Two (Reflections)
- Drop Box (Reframing frustrations)

### Day 5: The Celebration
- 3-Axis Badge Algorithm (8 Badges)
- Mood Report Card
- The Letter (Generated summary)
- Partner Invite

## 4. Design Principles
- **Premium Aesthetics**: High-contrast typography, soft gradients, and airy layouts.
- **Emotional Resonance**: Playfair Display Italic for quotes and key moments.
- **Haptic Feedback**: Meaningful vibration at every major interaction.
- **No Generic Buttons**: Use emotionally specific copy (e.g., "Enter the Bridge" instead of "Next").
