import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { api } from '../services/api';
import { API_BASE_URL } from '../constants/api';

export default function LoginScreen({ onBack, onLoginSuccess, onSignUp }: { 
  onBack: () => void; 
  onLoginSuccess: (userData: any) => void;
  onSignUp?: () => void; // Added optional onSignUp prop
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordInput = useRef<TextInput>(null);

  const handleLogin = async () => {
    console.log('🧪 Login button clicked');
    console.log('📝 Form data:', { email, password });
    
    if (!email.trim() || !password.trim()) {
      console.log('❌ Validation failed: Missing fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    console.log('✅ Validation passed, starting API call');
    setLoading(true);
    
    try {
      console.log('📡 Calling API: api.users.login');
      const response = await api.users.login({ email, password });
      console.log('📡 API Response:', response);
      
      if (response.success) {
        console.log('✅ Login successful');
        onLoginSuccess(response.data);
        Alert.alert('Success', 'Login successful!');
      } else {
        console.log('❌ Login failed:', response.message);
        Alert.alert('Error', response.message || 'Invalid email or password');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      Alert.alert('Error', error.message || 'Invalid email or password');
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
        <Text style={styles.headerTitle}>Login</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
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
            onSubmitEditing={handleLogin}
            returnKeyType="done"
            blurOnSubmit={false}
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity 
          style={styles.signUpLink}
          onPress={onSignUp}
        >
          <Text style={styles.signUpLinkText}>
            Don't have an account? <Text style={styles.signUpLinkHighlight}>Sign Up</Text>
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
    paddingTop: 40,
    paddingBottom: 20, // Reduced padding for mobile
  },
  inputContainer: {
    marginBottom: 25,
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
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 4px 8px rgba(31, 41, 55, 0.3)',
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#999',
    fontSize: 14,
  },
  signUpLink: {
    alignItems: 'center',
  },
  signUpLinkText: {
    color: '#666',
    fontSize: 14,
  },
  signUpLinkHighlight: {
    color: '#1F2937',
    fontWeight: 'bold',
  },
});
