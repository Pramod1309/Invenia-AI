import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { API_BASE_URL } from '../constants/api';

export default function NetworkTest({ onBack }: { onBack: () => void }) {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setTesting(true);
    setResults([]);
    addResult('Starting network test...');
    
    try {
      // Test 1: Basic connectivity
      addResult('Testing basic connectivity...');
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      addResult(`✅ Basic connectivity OK: ${data.message}`);
      
      // Test 2: Login endpoint
      addResult('Testing login endpoint...');
      const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'login@example.com',
          password: 'password123'
        }),
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        addResult(`✅ Login endpoint OK: ${loginData.message}`);
      } else {
        addResult(`❌ Login endpoint failed: ${loginResponse.status}`);
      }
      
      // Test 3: User creation endpoint
      addResult('Testing user creation endpoint...');
      const createResponse = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User Mobile',
          email: `test${Date.now()}@example.com`,
          password: 'password123'
        }),
      });
      
      if (createResponse.ok) {
        const createData = await createResponse.json();
        addResult(`✅ User creation OK: ${createData.message}`);
      } else {
        const errorData = await createResponse.json();
        addResult(`❌ User creation failed: ${errorData.message}`);
      }
      
    } catch (error: any) {
      addResult(`❌ Network error: ${error.message}`);
      Alert.alert('Network Error', `Failed to connect: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Network Test</Text>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>API URL: {API_BASE_URL}</Text>
        <Text style={styles.infoText}>Platform: {typeof window !== 'undefined' ? 'web' : 'mobile'}</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.testButton, testing && styles.testButtonDisabled]} 
        onPress={testConnection}
        disabled={testing}
      >
        <Text style={styles.testButtonText}>
          {testing ? 'Testing...' : 'Test Connection'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.results}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {results.map((result, index) => (
          <Text key={index} style={styles.resultText}>{result}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  info: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  testButton: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  testButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  results: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    flex: 1,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
});
