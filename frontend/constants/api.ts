import { Platform } from 'react-native';

const getLocalIP = () => {
  // Your computer's current IP address for mobile development
  const ip = 'http://172.31.28.27:5000/api';
  console.log('=== MOBILE DEBUG ===');
  console.log('Platform.OS:', Platform.OS);
  console.log('Is __DEV__ true?:', __DEV__);
  console.log('Using mobile IP:', ip);
  console.log('====================');
  return ip;
};

const API_BASE_URL = __DEV__ 
  ? (Platform.OS === 'web' ? 'http://localhost:5000/api' : getLocalIP())
  : (process.env.EXPO_PUBLIC_API_URL || 'https://invenia-backend.onrender.com/api');

console.log('🌐 API_BASE_URL:', API_BASE_URL, 'Platform:', Platform.OS, 'Is Web?:', Platform.OS === 'web');

export const API_ENDPOINTS = {
  ROOT: '/',
  USERS: '/users',
  JOBS: '/jobs',
} as const;

export { API_BASE_URL };
