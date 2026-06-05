import env from '../config/env.js';
import { getAccessToken } from './auth.js';

export async function fetchDepots() {
  try {
    console.log('Fetching depots...');

    const response = await fetch(`${env.SERVER_URL}/depots`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch depots: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.depots.length} depots`);

    return {
      success: true,
      data: data.depots
    };
  } catch (error) {
    console.error('Error fetching depots:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}
