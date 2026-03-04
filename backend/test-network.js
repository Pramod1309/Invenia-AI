import fetch from 'node-fetch';

const testNetworkAccess = async () => {
  try {
    console.log('Testing network access...');
    
    const response = await fetch('http://10.248.199.27:5000/api', {
      method: 'GET',
    });
    
    const data = await response.json();
    console.log('Network Status:', response.status);
    console.log('Network Response:', data);
    
    // Test login endpoint
    const loginResponse = await fetch('http://10.248.199.27:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'login@example.com',
        password: 'password123'
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response:', loginData);
    
  } catch (error) {
    console.error('Network Error:', error.message);
  }
};

testNetworkAccess();
