import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import SplashScreen from '@/components/SplashScreen';
import WelcomeScreenWithButtons from '@/components/WelcomeScreenWithButtons';
import SignUpScreen from '@/components/SignUpScreen';
import LoginScreen from '@/components/LoginScreen';
import AccountScreen from '@/components/AccountScreen';
import RecruiterDashboard from '@/components/RecruiterDashboard';
import HomeScreen from '@/components/HomeScreen';
import JobsScreen from '@/components/JobsScreen';
import AnalyticsScreen from '@/components/AnalyticsScreen';
import SettingsScreen from '@/components/SettingsScreen';
import AuthTestScreen from '@/components/AuthTestScreen';
import { StatusBar } from 'expo-status-bar';

type ScreenType = 'splash' | 'welcome' | 'signup' | 'login' | 'account' | 'dashboard' | 'home' | 'jobs' | 'analytics' | 'settings' | 'authtest';

export default function IndexPage() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [userData, setUserData] = useState<any>(null);

  const handleSplashComplete = () => {
    setCurrentScreen('welcome');
  };

  const handleSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleLogin = () => {
    setCurrentScreen('login');
  };


  const handleBack = () => {
    setCurrentScreen('welcome');
  };

  const handleSignUpSuccess = (userData: any) => {
    console.log('🎉 Sign up success callback called with:', userData);
    setUserData(userData);
    setCurrentScreen('dashboard');
  };

  const handleLoginSuccess = (userData: any) => {
    console.log('🎉 Login success callback called with:', userData);
    setUserData(userData);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentScreen('welcome');
  };

  const handleTabNavigation = (tab: 'home' | 'jobs' | 'analytics' | 'settings') => {
    setCurrentScreen(tab);
  };

  const renderScreen = () => {
    console.log('Current screen:', currentScreen, 'User data:', userData);
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onAnimationComplete={handleSplashComplete} />;
      case 'welcome':
        return (
          <View>
            <WelcomeScreenWithButtons 
              onSignUp={handleSignUp} 
              onLogin={handleLogin}
            />
            <TouchableOpacity 
              style={{ backgroundColor: '#007AFF', padding: 10, margin: 10, borderRadius: 5 }}
              onPress={() => setCurrentScreen('authtest')}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>🧪 Test Auth</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ backgroundColor: '#28a745', padding: 10, margin: 10, borderRadius: 5 }}
              onPress={() => {
                console.log('🧪 Direct login test');
                setUserData({ name: 'Test User', email: 'test@example.com' });
                setCurrentScreen('dashboard');
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>🎯 Skip to Dashboard</Text>
            </TouchableOpacity>
          </View>
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
      case 'account':
        return (
          <AccountScreen 
            userData={userData} 
            onLogout={handleLogout} 
          />
        );
      case 'dashboard':
        return (
          <RecruiterDashboard 
            userData={userData} 
            onLogout={handleLogout}
            onNavigateToTab={handleTabNavigation}
          />
        );
      case 'home':
        return (
          <RecruiterDashboard 
            userData={userData} 
            onLogout={handleLogout}
            onNavigateToTab={handleTabNavigation}
            activeContent="home"
          />
        );
      case 'jobs':
        return (
          <RecruiterDashboard 
            userData={userData} 
            onLogout={handleLogout}
            onNavigateToTab={handleTabNavigation}
            activeContent="jobs"
          />
        );
      case 'analytics':
        return (
          <RecruiterDashboard 
            userData={userData} 
            onLogout={handleLogout}
            onNavigateToTab={handleTabNavigation}
            activeContent="analytics"
          />
        );
      case 'settings':
        return (
          <RecruiterDashboard 
            userData={userData} 
            onLogout={handleLogout}
            onNavigateToTab={handleTabNavigation}
            activeContent="settings"
          />
        );
      case 'authtest':
        return <AuthTestScreen />;
      default:
        return null;
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
