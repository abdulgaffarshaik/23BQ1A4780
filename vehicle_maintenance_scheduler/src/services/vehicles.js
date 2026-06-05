import env from '../config/env.js';
import { getAccessToken } from './auth.js';

export async function fetchVehicles() {
  try {
    console.log('Fetching vehicles...');

    const response = await fetch(`${env.SERVER_URL}/vehicles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.vehicles.length} vehicles`);

    return {
      success: true,
      data: data.vehicles
    };
  } catch (error) {
    console.error('Error fetching vehicles:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}
