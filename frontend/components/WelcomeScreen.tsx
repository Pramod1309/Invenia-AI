import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ onSignUp, onLogin }: { onSignUp: () => void; onLogin: () => void }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [buttonOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    // Title fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Title slide up animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Buttons fade in delay
    setTimeout(() => {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 800);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      
      <View style={styles.titleContainer}>
        <Animated.View
          style={[
            styles.titleWrapper,
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

      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonOpacity,
          },
        ]}
      >
        <TouchableOpacity style={styles.signUpButton} onPress={onSignUp}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937', // Sky blue color
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrapper: {
    alignItems: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 40,
    fontWeight: '300',
    color: '#FFFFFF',
    marginTop: -10,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 60,
  },
  signUpButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 8,
  },
  signUpText: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
