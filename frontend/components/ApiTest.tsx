import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

export default function ApiTest() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.test();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      
      <Button 
        title="Test Backend Connection" 
        onPress={testConnection}
        disabled={loading}
      />
      
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}
      
      {data && (
        <View style={styles.resultContainer}>
          <Text style={styles.successText}>✅ Connection Successful!</Text>
          <Text style={styles.dataText}>{JSON.stringify(data, null, 2)}</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ Connection Failed</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    width: '100%',
  },
  successText: {
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dataText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  errorContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffe8e8',
    borderRadius: 8,
    width: '100%',
  },
  errorText: {
    color: 'red',
  },
});
