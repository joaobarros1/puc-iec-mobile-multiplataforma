// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8, opção A (Heart pop).
//
// Ao tocar: escala 1 → 1.4 → 1 (spring) + rotação leve (wiggle).
// A animação roda na UI thread: shared values + useAnimatedStyle (worklet).
// O callback JS (onPress → toggle do Zustand) roda normalmente no JS thread;
// a animação não depende dele, então não trava se o JS estiver ocupado.
//
// Doc: https://docs.swmansion.com/react-native-reanimated/

import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  active: boolean;
  onPress: () => void;
  size?: number;
};

export default function HeartButton({ active, onPress, size = 24 }: Props) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  // Worklet: o plugin do Reanimated transforma essa função pra rodar na UI thread.
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 4, stiffness: 200 })
    );
    rotation.value = withSequence(
      withTiming(-15, { duration: 60 }),
      withTiming(15, { duration: 120 }),
      withSpring(0, { damping: 5 })
    );
    onPress();
  };

  return (
    <Pressable
      onPress={(e) => {
        e.stopPropagation();
        handlePress();
      }}
      hitSlop={8}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      accessibilityState={{ selected: active }}
    >
      <Animated.Text style={[{ fontSize: size }, animatedStyle]}>
        {active ? '❤️' : '🤍'}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
});
