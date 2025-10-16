import { useState, useEffect, useCallback } from 'react';
import { 
  initializeGoogleAPIs, 
  authenticateGoogle, 
  signOutGoogle, 
  isSignedIn, 
  getUpcomingEvents, 
  createCalendarEvent, 
  updateCalendarEvent, 
  deleteCalendarEvent 
} from '../services/googleCalendarService';
import type { GoogleCalendarEvent } from '../types/googleCalendar';
import type { Appointment } from '../types';

interface UseGoogleCalendarReturn {
  // Authentication state
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Authentication actions
  authenticate: () => Promise<void>;
  signOut: () => void;
  
  // Calendar operations
  events: GoogleCalendarEvent[];
  createEvent: (appointment: Appointment) => Promise<void>;
  updateEvent: (eventId: string, appointment: Appointment) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  refreshEvents: () => Promise<void>;
}

/**
 * Custom hook for Google Calendar integration
 * 
 * Provides authentication, event management, and synchronization 
 * capabilities for Google Calendar API.
 * 
 * @returns UseGoogleCalendarReturn - Hook interface with state and actions
 */
export const useGoogleCalendar = (): UseGoogleCalendarReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);

  /**
   * Load upcoming calendar events
   * 
   * Fetches the next 10 events from the user's primary calendar.
   */
  const loadEvents = useCallback(async () => {
    try {
      setError(null);
      const upcomingEvents = await getUpcomingEvents(10);
      setEvents(upcomingEvents);
      console.log(`📅 Loaded ${upcomingEvents.length} calendar events`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load calendar events';
      setError(errorMessage);
      console.error('❌ Failed to load events:', err);
    }
  }, []);

  /**
   * Initialize Google Calendar API
   * 
   * Sets up the Google API client and OAuth configuration.
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        await initializeGoogleAPIs();
        setIsInitialized(true);
        
        // Check if user is already authenticated
        if (isSignedIn()) {
          setIsAuthenticated(true);
          await loadEvents();
        }
        
        console.log('🔧 Google Calendar initialized successfully');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Google Calendar';
        setError(errorMessage);
        console.error('❌ Google Calendar initialization failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [loadEvents]);

  /**
   * Authenticate user with Google Calendar
   * 
   * Initiates OAuth flow and updates authentication state.
   */
  const authenticate = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authenticateGoogle();
      setIsAuthenticated(true);
      await loadEvents();
      
      console.log('✅ Google Calendar authentication successful');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      console.error('❌ Authentication failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [loadEvents]);

  /**
   * Sign out from Google Calendar
   * 
   * Revokes access token and clears authentication state.
   */
  const signOut = useCallback(() => {
    try {
      signOutGoogle();
      setIsAuthenticated(false);
      setEvents([]);
      console.log('👋 Signed out from Google Calendar');
    } catch (err) {
      console.error('❌ Sign out failed:', err);
    }
  }, []);

  /**
   * Convert appointment to Google Calendar event format
   * 
   * @param appointment - Application appointment object
   * @returns Partial<GoogleCalendarEvent> - Google Calendar compatible event
   */
  const appointmentToCalendarEvent = (appointment: Appointment): Partial<GoogleCalendarEvent> => {
    const startDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    return {
      summary: `${appointment.serviceName} - ${appointment.clientName}`,
      description: `
        Cliente: ${appointment.clientName}
        Teléfono: ${appointment.clientPhone}
        Servicio: ${appointment.serviceName}
        Estado: ${appointment.status}
        
        Cita programada desde la aplicación de calendario
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };
  };

  /**
   * Create calendar event from appointment
   * 
   * @param appointment - Appointment to sync to calendar
   */
  const createEvent = useCallback(async (appointment: Appointment) => {
    try {
      setError(null);
      
      if (!isAuthenticated) {
        throw new Error('User not authenticated with Google Calendar');
      }

      const eventData = appointmentToCalendarEvent(appointment);
      await createCalendarEvent(eventData);
      await loadEvents(); // Refresh events list
      
      console.log('✅ Calendar event created for appointment:', appointment.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create calendar event';
      setError(errorMessage);
      console.error('❌ Failed to create calendar event:', err);
      throw err;
    }
  }, [isAuthenticated, loadEvents]);

  /**
   * Update existing calendar event
   * 
   * @param eventId - Google Calendar event ID
   * @param appointment - Updated appointment data
   */
  const updateEvent = useCallback(async (eventId: string, appointment: Appointment) => {
    try {
      setError(null);
      
      if (!isAuthenticated) {
        throw new Error('User not authenticated with Google Calendar');
      }

      const eventData = appointmentToCalendarEvent(appointment);
      await updateCalendarEvent(eventId, eventData);
      await loadEvents(); // Refresh events list
      
      console.log('✅ Calendar event updated:', eventId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update calendar event';
      setError(errorMessage);
      console.error('❌ Failed to update calendar event:', err);
      throw err;
    }
  }, [isAuthenticated, loadEvents]);

  /**
   * Delete calendar event
   * 
   * @param eventId - Google Calendar event ID to delete
   */
  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      setError(null);
      
      if (!isAuthenticated) {
        throw new Error('User not authenticated with Google Calendar');
      }

      await deleteCalendarEvent(eventId);
      await loadEvents(); // Refresh events list
      
      console.log('✅ Calendar event deleted:', eventId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete calendar event';
      setError(errorMessage);
      console.error('❌ Failed to delete calendar event:', err);
      throw err;
    }
  }, [isAuthenticated, loadEvents]);

  /**
   * Refresh events list
   * 
   * Manually reload events from Google Calendar.
   */
  const refreshEvents = useCallback(async () => {
    if (isAuthenticated) {
      await loadEvents();
    }
  }, [isAuthenticated, loadEvents]);

  return {
    // Authentication state
    isAuthenticated,
    isInitialized,
    isLoading,
    error,
    
    // Authentication actions
    authenticate,
    signOut,
    
    // Calendar operations
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents,
  };
};