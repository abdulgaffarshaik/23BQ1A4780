import env from '../config/env.js';

let accessToken = null;

export async function authenticate(authData) {
  try {
    const {
      email,
      name,
      rollNo,
      accessCode,
      clientID,
      clientSecret
    } = authData;

    const payload = {
      email,
      name,
      rollNo,
      accessCode,
      clientID,
      clientSecret
    };

    const response = await fetch(`${env.SERVER_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;

    console.log('Authentication Successful!');
    console.log('Token Type:', data.token_type);
    console.log('Expires In:', data.expires_in, 'seconds');

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Authentication Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token;
}
