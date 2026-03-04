// Test script to verify mobile configuration
console.log('=== TESTING MOBILE CONFIGURATION ===');

// Test if we're in development mode
console.log('__DEV__:', typeof __DEV__ !== 'undefined' ? __DEV__ : 'undefined');

// Test Platform detection
try {
  const { Platform } = require('react-native');
  console.log('Platform.OS:', Platform.OS);
  console.log('Platform.select:', typeof Platform.select);
} catch (e) {
  console.log('Platform import error:', e.message);
}

// Test API configuration
try {
  const { API_BASE_URL } = require('./constants/api.ts');
  console.log('API_BASE_URL:', API_BASE_URL);
} catch (e) {
  console.log('API import error:', e.message);
}

console.log('=== END TEST ===');
