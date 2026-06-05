import env from '../config/env.js';
import { getAccessToken } from './auth.js';

export async function fetchNotifications() {
  try {
    console.log('Fetching notifications...');

    const response = await fetch(`${env.SERVER_URL}/notifications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.notifications.length} notifications`);

    return {
      success: true,
      data: data.notifications
    };
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}
