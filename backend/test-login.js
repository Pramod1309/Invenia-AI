import fetch from 'node-fetch';

const testLogin = async () => {
  try {
    // First create a user
    console.log('Creating test user...');
    const signupResponse = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Login User',
        email: 'login@example.com',
        password: 'password123'
      }),
    });

    const signupData = await signupResponse.json();
    console.log('Signup Status:', signupResponse.status);
    console.log('Signup Response:', signupData);

    // Now test login
    console.log('\nTesting login...');
    const loginResponse = await fetch('http://localhost:5000/api/users/login', {
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
    console.error('Error:', error.message);
  }
};

testLogin();
