import env from '../config/env.js';
import { getAccessToken } from './auth.js';
import {
  LOG_STACKS,
  LOG_LEVELS,
  LOG_PACKAGES
} from '../utils/constants.js';

export async function Log(stack, level, packageName, message) {
  try {
    const token = getAccessToken();
    if (!token) {
      console.warn('Warning: No access token available for logging');
      return { success: false, error: 'No access token' };
    }

    const payload = {
      stack,
      level,
      package: packageName,
      message
    };

    const response = await fetch(`${env.SERVER_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Logging failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Logging Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function debug(packageName, message) {
  return Log(LOG_STACKS.BACKEND, LOG_LEVELS.DEBUG, packageName, message);
}

export async function info(packageName, message) {
  return Log(LOG_STACKS.BACKEND, LOG_LEVELS.INFO, packageName, message);
}

export async function warn(packageName, message) {
  return Log(LOG_STACKS.BACKEND, LOG_LEVELS.WARN, packageName, message);
}

export async function error(packageName, message) {
  return Log(LOG_STACKS.BACKEND, LOG_LEVELS.ERROR, packageName, message);
}

export async function fatal(packageName, message) {
  return Log(LOG_STACKS.BACKEND, LOG_LEVELS.FATAL, packageName, message);
}
