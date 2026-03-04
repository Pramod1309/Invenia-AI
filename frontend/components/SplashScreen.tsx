import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform, StatusBar } from 'react-native';

export default function SplashScreen({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(Platform.OS === 'web' ? 30 : 50)).current;

  useEffect(() => {
    // Start animation when component mounts
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: Platform.OS === 'web' ? 1000 : 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: Platform.OS === 'web' ? 1000 : 1500,
        useNativeDriver: true,
      }),
    ]);

    animation.start(() => {
      // Wait a bit after animation completes, then transition
      const delay = Platform.OS === 'web' ? 1500 : 2000;
      setTimeout(() => {
        onAnimationComplete();
      }, delay);
    });

    return () => animation.stop();
  }, [onAnimationComplete]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Invenia</Text>
        <Text style={styles.subtitle}>AI</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 60 : 70,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: Platform.OS === 'web' ? 2 : 3,
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 35 : 50,
    fontWeight: '300',
    color: '#FFFFFF',
    marginTop: Platform.OS === 'web' ? -10 : -15,
  },
});
