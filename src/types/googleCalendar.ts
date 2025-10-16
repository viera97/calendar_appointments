/**
 * Type definitions for Google Calendar API and Google Identity Services
 * 
 * Provides TypeScript type definitions for the Google APIs used in the
 * calendar integration, ensuring type safety and better development experience.
 */

// Google Calendar Event structure
export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  reminders?: {
    useDefault?: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
  htmlLink?: string;
  created?: string;
  updated?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

// Google API Response structure
export interface GoogleApiResponse<T> {
  result: T;
  status: number;
  statusText: string;
}

// Calendar events list response
export interface CalendarEventsResponse {
  items: GoogleCalendarEvent[];
  nextPageToken?: string;
  summary: string;
  timeZone: string;
}

// OAuth token response
export interface TokenResponse {
  access_token: string;
  error?: string;
  error_description?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

// Google Identity Services token client
export interface TokenClient {
  requestAccessToken(options?: { prompt?: string }): void;
  callback: (response: TokenResponse) => void;
}

// Extend Window interface to include Google APIs
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: { discoveryDocs: string[] }) => Promise<void>;
        calendar: {
          events: {
            list: (params: {
              calendarId: string;
              timeMin?: string;
              timeMax?: string;
              showDeleted?: boolean;
              singleEvents?: boolean;
              maxResults?: number;
              orderBy?: string;
            }) => Promise<GoogleApiResponse<CalendarEventsResponse>>;
            insert: (params: {
              calendarId: string;
              resource: GoogleCalendarEvent;
            }) => Promise<GoogleApiResponse<GoogleCalendarEvent>>;
            update: (params: {
              calendarId: string;
              eventId: string;
              resource: GoogleCalendarEvent;
            }) => Promise<GoogleApiResponse<GoogleCalendarEvent>>;
            delete: (params: {
              calendarId: string;
              eventId: string;
            }) => Promise<GoogleApiResponse<void>>;
          };
        };
        getToken: () => { access_token?: string } | null;
        setToken: (token: string) => void;
      };
    };
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: string | ((response: TokenResponse) => void);
          }) => TokenClient;
          revoke: (token: string) => void;
          hasGrantedAllScopes: (token: { access_token: string } | null, scopes: string) => boolean;
          getToken: () => { access_token: string } | null;
        };
      };
    };
  }
}