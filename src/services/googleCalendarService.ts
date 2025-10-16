/**
 * Google Calendar Service
 * 
 * Handles Google Calendar API integration including authentication,
 * event management, and calendar operations. Provides a comprehensive
 * interface for calendar functionality with proper error handling.
 */

import type { 
  GoogleCalendarEvent, 
  TokenResponse,
  TokenClient
} from '../types/googleCalendar';

// Google Calendar API configuration
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

// Validation for required environment variables
if (!CLIENT_ID) {
  throw new Error('VITE_CLIENT_ID is required in environment variables for Google Calendar integration');
}

// Global variables for API state
let tokenClient: TokenClient | null = null;
let gapiInited = false;
let gisInited = false;

/**
 * Initialize Google APIs
 * 
 * Sets up both the Google API Client Library (GAPI) and Google Identity Services (GIS)
 * required for calendar operations and authentication.
 * 
 * @returns Promise<void>
 */
export const initializeGoogleAPIs = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Load Google API Client Library
      const initGapi = () => {
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
              discoveryDocs: [DISCOVERY_DOC],
            });
            gapiInited = true;
            console.log('📅 Google API Client initialized');
            checkInitializationComplete();
          } catch (error) {
            console.error('Error initializing GAPI:', error);
            reject(error);
          }
        });
      };

      // Initialize Google Identity Services
      const initGis = () => {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // Will be set dynamically
        });
        gisInited = true;
        console.log('🔐 Google Identity Services initialized');
        checkInitializationComplete();
      };

      // Check if both APIs are ready
      const checkInitializationComplete = () => {
        if (gapiInited && gisInited) {
          console.log('✅ Google Calendar APIs ready');
          resolve();
        }
      };

      // Load APIs when available
      if (window.gapi) {
        initGapi();
      } else {
        window.addEventListener('load', initGapi);
      }

      if (window.google?.accounts?.oauth2) {
        initGis();
      } else {
        window.addEventListener('load', initGis);
      }
    } catch (error) {
      console.error('Error during Google APIs initialization:', error);
      reject(error);
    }
  });
};

/**
 * Handle user authentication with Google
 * 
 * Initiates the OAuth flow for Google Calendar access.
 * 
 * @returns Promise<string> - Access token on successful authentication
 */
export const authenticateGoogle = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('Google Identity Services not initialized'));
      return;
    }

    tokenClient.callback = (response: TokenResponse) => {
      if (response.error !== undefined) {
        console.error('Authentication error:', response.error);
        reject(new Error(response.error));
        return;
      }
      console.log('✅ Google authentication successful');
      resolve(response.access_token);
    };

    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
};

/**
 * Sign out from Google Calendar
 * 
 * Revokes the current access token and clears authentication state.
 */
export const signOutGoogle = (): void => {
  const token = window.gapi.client.getToken();
  if (token) {
    if (token?.access_token) {
      window.google.accounts.oauth2.revoke(token.access_token);
    }
    window.gapi.client.setToken('');
    console.log('👋 Signed out from Google Calendar');
  }
};

/**
 * Check if user is currently signed in
 * 
 * @returns boolean - True if user has valid token
 */
export const isSignedIn = (): boolean => {
  const token = window.gapi?.client?.getToken();
  return !!(token && token.access_token);
};

/**
 * Fetch upcoming events from Google Calendar
 * 
 * @param maxResults - Maximum number of events to retrieve (default: 10)
 * @returns Promise<any[]> - Array of calendar events
 */
export const getUpcomingEvents = async (maxResults: number = 10): Promise<GoogleCalendarEvent[]> => {
  try {
    if (!isSignedIn()) {
      throw new Error('User not authenticated');
    }

    const response = await window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults,
      orderBy: 'startTime',
    });

    console.log(`📅 Retrieved ${response.result.items?.length || 0} upcoming events`);
    return response.result.items || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Create a new event in Google Calendar
 * 
 * @param eventData - Event data object
 * @returns Promise<any> - Created event object
 */
export const createCalendarEvent = async (eventData: Partial<GoogleCalendarEvent>): Promise<GoogleCalendarEvent> => {
  try {
    if (!isSignedIn()) {
      throw new Error('User not authenticated');
    }

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: eventData as GoogleCalendarEvent,
    });

    console.log('✅ Calendar event created:', response.result.htmlLink);
    return response.result;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

/**
 * Update an existing calendar event
 * 
 * @param eventId - ID of the event to update
 * @param eventData - Updated event data
 * @returns Promise<any> - Updated event object
 */
export const updateCalendarEvent = async (eventId: string, eventData: Partial<GoogleCalendarEvent>): Promise<GoogleCalendarEvent> => {
  try {
    if (!isSignedIn()) {
      throw new Error('User not authenticated');
    }

    const response = await window.gapi.client.calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      resource: eventData as GoogleCalendarEvent,
    });

    console.log('✅ Calendar event updated:', response.result.htmlLink);
    return response.result;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }
};

/**
 * Delete a calendar event
 * 
 * @param eventId - ID of the event to delete
 * @returns Promise<void>
 */
export const deleteCalendarEvent = async (eventId: string): Promise<void> => {
  try {
    if (!isSignedIn()) {
      throw new Error('User not authenticated');
    }

    await window.gapi.client.calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });

    console.log('🗑️ Calendar event deleted');
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
};