import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import WelcomeScreen from '@/components/WelcomeScreen';
import SignUpScreen from '@/components/SignUpScreen';
import LoginScreen from '@/components/LoginScreen';
import { StatusBar } from 'expo-status-bar';

type ScreenType = 'welcome' | 'signup' | 'login';

export default function WelcomePage() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');

  const handleSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleLogin = () => {
    setCurrentScreen('login');
  };

  const handleBack = () => {
    setCurrentScreen('welcome');
  };

  const handleSignUpSuccess = () => {
    // TODO: Navigate to main app after successful signup
    console.log('Signup successful - navigate to main app');
  };

  const handleLoginSuccess = () => {
    // TODO: Navigate to main app after successful login
    console.log('Login successful - navigate to main app');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onSignUp={handleSignUp} 
            onLogin={handleLogin} 
          />
        );
      case 'signup':
        return (
          <SignUpScreen 
            onBack={handleBack} 
            onSignUpSuccess={handleSignUpSuccess} 
          />
        );
      case 'login':
        return (
          <LoginScreen 
            onBack={handleBack} 
            onLoginSuccess={handleLoginSuccess} 
          />
        );
      default:
        return (
          <WelcomeScreen 
            onSignUp={handleSignUp} 
            onLogin={handleLogin} 
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
