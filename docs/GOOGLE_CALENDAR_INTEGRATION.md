# 📅 Google Calendar Integration Guide

This document provides detailed instructions for setting up and using the Google Calendar integration in the Calendar Appointments application.

## 🔧 Setup Instructions

### 1. Google Cloud Console Setup

1. **Access Google Cloud Console**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create or Select Project**
   - Create a new project or select an existing one
   - Note the project ID for reference

3. **Enable Google Calendar API**
   - Navigate to **APIs & Services > Library**
   - Search for "Google Calendar API"
   - Click on it and press **Enable**

### 2. OAuth 2.0 Credentials Configuration

1. **Create Credentials**
   - Go to **APIs & Services > Credentials**
   - Click **+ CREATE CREDENTIALS**
   - Select **OAuth client ID**

2. **Configure OAuth Consent Screen** (if first time)
   - Go to **OAuth consent screen**
   - Choose **External** for testing
   - Fill required fields:
     - App name: "Calendar Appointments"
     - User support email: your email
     - Developer contact information: your email
   - Add scopes: `https://www.googleapis.com/auth/calendar`

3. **Create OAuth Client ID**
   - Application type: **Web application**
   - Name: "Calendar Appointments Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Your production domain (e.g., `https://yourdomain.com`)
   - Authorized redirect URIs: (leave empty for this implementation)

4. **Copy Client ID**
   - Copy the generated Client ID
   - Add it to your `.env` file as `VITE_CLIENT_ID`

### 3. Environment Configuration

Create a `.env` file in your project root:

```env
# Google Calendar API Configuration
VITE_CLIENT_ID=your_google_oauth_client_id_here

# Supabase Configuration (if using)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Implementation Guide

### Using the Google Calendar Hook

The `useGoogleCalendar` hook provides a complete interface for Google Calendar integration:

```typescript
import { useGoogleCalendar } from './hooks/useGoogleCalendar';

function MyComponent() {
  const {
    isAuthenticated,
    isInitialized,
    isLoading,
    error,
    events,
    authenticate,
    signOut,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents,
  } = useGoogleCalendar();

  // Component logic here
}
```

### Authentication Flow

```typescript
// Check if user is authenticated
if (isAuthenticated) {
  console.log('User is connected to Google Calendar');
} else {
  // Initiate authentication
  await authenticate();
}
```

### Creating Calendar Events

```typescript
// Create event from appointment data
const appointment = {
  id: '1',
  clientName: 'John Doe',
  clientPhone: '+1234567890',
  serviceName: 'Haircut',
  serviceId: 'service-1',
  date: '2024-01-15',
  time: '14:00',
  status: 'scheduled',
  createdAt: new Date().toISOString(),
};

try {
  await createEvent(appointment);
  console.log('Event created successfully!');
} catch (error) {
  console.error('Failed to create event:', error);
}
```

### Updating Calendar Events

```typescript
// Update existing event
const updatedAppointment = {
  ...appointment,
  time: '15:00', // Changed time
};

try {
  await updateEvent('google-event-id', updatedAppointment);
  console.log('Event updated successfully!');
} catch (error) {
  console.error('Failed to update event:', error);
}
```

### Deleting Calendar Events

```typescript
try {
  await deleteEvent('google-event-id');
  console.log('Event deleted successfully!');
} catch (error) {
  console.error('Failed to delete event:', error);
}
```

## 🔒 Security Considerations

### 1. Client ID Protection
- Client IDs are not secret and can be exposed in frontend code
- However, they should be tied to specific domains for security
- Always use HTTPS in production

### 2. Scope Limitations
- This integration only requests calendar access
- Users can revoke access at any time via Google Account settings
- Events are created in the user's primary calendar

### 3. Data Privacy
- Only appointment information is sent to Google Calendar
- No sensitive business data is transmitted
- Users control their own calendar data

## 🐛 Troubleshooting

### Common Issues

1. **"Origin not allowed" Error**
   ```
   Solution: Add your domain to "Authorized JavaScript origins" 
   in Google Cloud Console OAuth settings
   ```

2. **"API Key not found" Error**
   ```
   Solution: Ensure VITE_CLIENT_ID is correctly set in .env file
   and the app is restarted after adding the environment variable
   ```

3. **"Calendar API not enabled" Error**
   ```
   Solution: Enable Google Calendar API in Google Cloud Console
   under APIs & Services > Library
   ```

4. **Authentication popup blocked**
   ```
   Solution: Allow popups for your domain in browser settings
   or use the authentication directly in the same tab
   ```

### Debug Mode

Enable debug logging by adding to console:

```javascript
// In browser console
localStorage.setItem('google-calendar-debug', 'true');
```

This will show detailed logs for authentication and API calls.

### Testing Authentication

1. Open browser developer tools
2. Go to Network tab
3. Filter by "accounts.google.com"
4. Try authentication and check for any failed requests

## 📊 Calendar Event Format

Events created in Google Calendar include:

- **Summary**: "{Service Name} - {Client Name}"
- **Description**: Detailed appointment information
- **Start Time**: Appointment date and time
- **Duration**: 1 hour (configurable)
- **Time Zone**: User's local timezone

Example event in Google Calendar:
```
Title: Haircut - John Doe
Description:
  Cliente: John Doe
  Teléfono: +1234567890
  Servicio: Haircut
  Estado: scheduled
  
  Cita programada desde la aplicación de calendario
Time: January 15, 2024, 2:00 PM - 3:00 PM
```

## 🔄 Sync Workflow

1. **User creates appointment** in the application
2. **If authenticated** with Google Calendar:
   - Event is automatically created in Google Calendar
   - Success/error notification is shown
3. **If not authenticated**:
   - Appointment is saved locally/in database
   - User can authenticate later to sync existing appointments

## 📚 Additional Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [OAuth 2.0 for Web Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [React Hook Best Practices](https://react.dev/reference/react)

## 💡 Future Enhancements

Potential improvements for the Google Calendar integration:

1. **Bidirectional Sync**: Import existing Google Calendar events
2. **Multiple Calendars**: Allow users to choose which calendar to use
3. **Recurring Appointments**: Support for repeating appointments
4. **Conflict Detection**: Check for scheduling conflicts
5. **Timezone Support**: Better handling of different timezones
6. **Batch Operations**: Bulk create/update/delete operations