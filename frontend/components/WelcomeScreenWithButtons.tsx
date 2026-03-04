import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreenWithButtons({ onSignUp, onLogin }: { 
  onSignUp: () => void; 
  onLogin: () => void;
}) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Invenia</Text>
        <Text style={styles.subtitle}>AI</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signUpButton} onPress={onSignUp}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'web' ? 40 : 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 80 : 60,
  },
  title: {
    fontSize: Platform.OS === 'web' ? 60 : 70,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: Platform.OS === 'web' ? 2 : 3,
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 40 : 50,
    fontWeight: '300',
    color: '#FFFFFF',
    marginTop: Platform.OS === 'web' ? -10 : -15,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: Platform.OS === 'web' ? 60 : 40,
  },
  signUpButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: Platform.OS === 'web' ? 18 : 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  signUpText: {
    color: '#87CEEB',
    fontSize: Platform.OS === 'web' ? 18 : 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingVertical: Platform.OS === 'web' ? 16 : 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'web' ? 18 : 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
