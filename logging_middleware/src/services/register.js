import env from '../config/env.js';

export async function register(userData) {
  try {
    const {
      email,
      name,
      mobileNo,
      githubUsername,
      rollNo,
      accessCode
    } = userData;

    const payload = {
      email,
      name,
      mobileNo,
      githubUsername,
      rollNo,
      accessCode
    };

    const response = await fetch(`${env.SERVER_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.statusText}`);
    }

    const data = await response.json();

    console.log('Registration Successful!');
    console.log('ClientID:', data.clientID);
    console.log('ClientSecret:', data.clientSecret);

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Registration Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}
