// API Configuration using environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-fb20.onrender.com';

export const API_ENDPOINTS = {
  PROFILES: `${API_BASE_URL}/api/profiles`,
  WEBSITE_SETTINGS: `${API_BASE_URL}/api/website-settings`,
} as const;

export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Midnight Queens',
  TAGLINE: import.meta.env.VITE_APP_TAGLINE || 'Premium Adult Services',
  CONTACT: {
    WHATSAPP: import.meta.env.VITE_CONTACT_WHATSAPP || '+1234567890',
    TELEGRAM: import.meta.env.VITE_CONTACT_TELEGRAM || '@midnightqueens',
    PHONE: import.meta.env.VITE_CONTACT_PHONE || '+1234567890',
  }
} as const;

// API Helper Functions
export const apiRequest = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default API_BASE_URL;