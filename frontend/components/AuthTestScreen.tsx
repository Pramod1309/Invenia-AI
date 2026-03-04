import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../services/api';

export default function AuthTestScreen() {
  const [testResults, setTestResults] = React.useState<string[]>([]);

  const testAuth = async () => {
    try {
      setTestResults(prev => [...prev, '🧪 Starting authentication test...']);
      
      // Test 1: Create a new user
      setTestResults(prev => [...prev, '📝 Creating test user...']);
      const signupResponse = await api.users.create({
        name: 'Auth Test User',
        email: 'authtest@example.com',
        password: 'testpass123'
      });
      
      if (signupResponse.success) {
        setTestResults(prev => [...prev, `✅ User created: ${signupResponse.data.user.name} (${signupResponse.data.user.email})`]);
        
        // Test 2: Login with the created user
        setTestResults(prev => [...prev, '🔐 Logging in with created user...']);
        const loginResponse = await api.users.login({
          email: 'authtest@example.com',
          password: 'testpass123'
        });
        
        if (loginResponse.success) {
          setTestResults(prev => [...prev, `✅ Login successful: ${loginResponse.data.user.name}`]);
          setTestResults(prev => [...prev, `🎫 Token received: ${loginResponse.data.token ? 'YES' : 'NO'}`]);
          setTestResults(prev => [...prev, '🎉 Authentication test PASSED!']);
        } else {
          setTestResults(prev => [...prev, `❌ Login failed: ${loginResponse.message}`]);
        }
      } else {
        setTestResults(prev => [...prev, `❌ User creation failed: ${signupResponse.message}`]);
      }
      
    } catch (error: any) {
      setTestResults(prev => [...prev, `❌ Test error: ${error.message}`]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Authentication Test</Text>
      <Text style={styles.subtitle}>Test the complete authentication flow</Text>
      
      <TouchableOpacity style={styles.testButton} onPress={testAuth}>
        <Text style={styles.testButtonText}>Run Authentication Test</Text>
      </TouchableOpacity>
      
      <View style={styles.resultsContainer}>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>{result}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
});
