import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { api } from '../services/api';

export default function SignUpScreen({ onBack, onSignUpSuccess }: { 
  onBack: () => void; 
  onSignUpSuccess: (userData: any) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordInput = useRef<TextInput>(null);
  const confirmPasswordInput = useRef<TextInput>(null);
  const emailInput = useRef<TextInput>(null);

  const handleSignUp = async () => {
    console.log('🧪 Sign up button clicked');
    console.log('📝 Form data:', { name, email, password, confirmPassword });
    
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      console.log('❌ Validation failed: Missing fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      console.log('❌ Validation failed: Passwords do not match');
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      console.log('❌ Validation failed: Password too short');
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    console.log('✅ Validation passed, starting API call');
    setLoading(true);
    
    try {
      console.log('📡 Calling API: api.users.create');
      const response = await api.users.create({ name, email, password });
      console.log('📡 API Response:', response);
      
      if (response.success) {
        console.log('✅ Sign up successful');
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => onSignUpSuccess(response.data) }
        ]);
      } else {
        console.log('❌ Sign up failed:', response.message);
        Alert.alert('Error', response.message || 'Failed to create account');
      }
    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      Alert.alert('Error', error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign Up</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#B0C4DE"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            onSubmitEditing={() => emailInput?.current?.focus()}
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            ref={emailInput}
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#B0C4DE"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onSubmitEditing={() => passwordInput?.current?.focus()}
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            ref={passwordInput}
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#B0C4DE"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onSubmitEditing={() => confirmPasswordInput?.current?.focus()}
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            ref={confirmPasswordInput}
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor="#B0C4DE"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            onSubmitEditing={handleSignUp}
            returnKeyType="done"
            blurOnSubmit={false}
          />
        </View>

        <TouchableOpacity 
          style={[styles.signUpButton, loading && styles.disabledButton]} 
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.signUpButtonText}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 30, // Reduced from 40
    paddingBottom: 15, // Further reduced to ensure button visibility
    justifyContent: 'flex-start', // Changed from space-between
  },
  inputContainer: {
    marginBottom: 15, // Further reduced from 20
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  signUpButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5, // Minimal margin to ensure visibility
    marginBottom: 10, // Add bottom margin to prevent cutoff
    boxShadow: '0px 4px 8px rgba(31, 41, 55, 0.3)',
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
