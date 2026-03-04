import fetch from 'node-fetch';

const testNewIP = async () => {
  try {
    console.log('Testing new IP address...');
    
    const response = await fetch('http://172.31.28.27:5000/api', {
      method: 'GET',
    });
    
    const data = await response.json();
    console.log('New IP Status:', response.status);
    console.log('New IP Response:', data);
    
    // Test login endpoint
    const loginResponse = await fetch('http://172.31.28.27:5000/api/users/login', {
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
    console.error('New IP Error:', error.message);
  }
};

testNewIP();
