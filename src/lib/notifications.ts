import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { RCTEvent } from '@/types';

// Initialize notification system
export async function initNotifications() {
  if (!Capacitor.isNativePlatform()) {
    console.log('Notifications only work on native platforms (using web fallback)');
    // Request web notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    return;
  }

  try {
    // Request permissions for local notifications
    const localPermissions = await LocalNotifications.requestPermissions();
    console.log('Local notifications permission:', localPermissions);

    // Request permissions for push notifications
    const pushPermissions = await PushNotifications.requestPermissions();
    console.log('Push notifications permission:', pushPermissions);

    if (pushPermissions.receive === 'granted') {
      // Register for push notifications
      await PushNotifications.register();
      
      // Listen for registration
      await PushNotifications.addListener('registration', token => {
        console.log('Push registration success, token:', token.value);
        // TODO: Send token to backend when available
        localStorage.setItem('rct_push_token', token.value);
      });

      // Listen for registration errors
      await PushNotifications.addListener('registrationError', error => {
        console.error('Push registration error:', error);
      });

      // Listen for push notifications
      await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push notification received:', notification);
        // Show local notification when app is in foreground
        showLocalNotification({
          title: notification.title || 'RCT',
          body: notification.body || '',
          id: Date.now(),
        });
      });

      // Listen for notification actions
      await PushNotifications.addListener('pushNotificationActionPerformed', action => {
        console.log('Push notification action performed:', action);
        // TODO: Handle notification tap (navigate to event, etc.)
      });
    }
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
}

// Schedule a local notification
export async function scheduleLocalNotification(options: {
  title: string;
  body: string;
  scheduleAt: Date;
  id: number;
  extra?: any;
}) {
  if (!Capacitor.isNativePlatform()) {
    console.log('Scheduling notification (web):', options);
    // Web fallback - show browser notification at scheduled time
    const now = new Date();
    const delay = options.scheduleAt.getTime() - now.getTime();
    
    if (delay > 0 && 'Notification' in window && Notification.permission === 'granted') {
      setTimeout(() => {
        new Notification(options.title, {
          body: options.body,
          icon: '/favicon.svg',
          badge: '/favicon.svg'
        });
      }, delay);
    }
    return;
  }

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: options.title,
          body: options.body,
          id: options.id,
          schedule: { at: options.scheduleAt },
          extra: options.extra,
        },
      ],
    });
    console.log('Notification scheduled successfully');
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

// Show immediate local notification
export async function showLocalNotification(options: {
  title: string;
  body: string;
  id: number;
  extra?: any;
}) {
  if (!Capacitor.isNativePlatform()) {
    console.log('Showing notification (web):', options);
    // Web fallback
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(options.title, {
        body: options.body,
        icon: '/favicon.svg',
        badge: '/favicon.svg'
      });
    }
    return;
  }

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: options.title,
          body: options.body,
          id: options.id,
          extra: options.extra,
        },
      ],
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

// Cancel a scheduled notification
export async function cancelNotification(id: number) {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    await LocalNotifications.cancel({ notifications: [{ id }] });
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}

// Get pending notifications
export async function getPendingNotifications() {
  if (!Capacitor.isNativePlatform()) {
    return [];
  }

  try {
    const result = await LocalNotifications.getPending();
    return result.notifications;
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    return [];
  }
}

// Schedule event reminder (1 hour before event)
export async function scheduleEventReminder(event: { id: string; title: string; date: string; time: string }) {
  const eventDate = new Date(`${event.date}T${event.time}`);
  const reminderDate = new Date(eventDate.getTime() - 60 * 60 * 1000); // 1 hour before

  if (reminderDate > new Date()) {
    await scheduleLocalNotification({
      title: '📅 Rappel d\'événement',
      body: `${event.title} commence dans 1 heure`,
      scheduleAt: reminderDate,
      id: parseInt(event.id.replace(/\D/g, '')) || Date.now(),
      extra: { type: 'event', eventId: event.id },
    });
  }
}

// Schedule daily event notification (6:00 AM)
export async function scheduleDailyEventNotification(event: { id: string; title: string; date: string; time: string }) {
  const eventDate = new Date(`${event.date}T06:00:00`);

  if (eventDate > new Date()) {
    await scheduleLocalNotification({
      title: '🏃 Événement du jour',
      body: `N'oubliez pas : ${event.title} à ${event.time}`,
      scheduleAt: eventDate,
      id: parseInt(event.id.replace(/\D/g, '')) + 1000 || Date.now(),
      extra: { type: 'daily', eventId: event.id },
    });
  }
}

// Schedule weekly event notification (2 days before at 6:00 PM)
export async function scheduleWeeklyEventNotification(event: { id: string; title: string; date: string; time: string }) {
  const eventDate = new Date(`${event.date}T${event.time}`);
  const notificationDate = new Date(eventDate.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days before
  notificationDate.setHours(18, 0, 0, 0); // 6:00 PM

  if (notificationDate > new Date()) {
    await scheduleLocalNotification({
      title: '📅 Événement hebdomadaire',
      body: `Dans 2 jours : ${event.title} le ${new Date(event.date).toLocaleDateString('fr-FR')} à ${event.time}`,
      scheduleAt: notificationDate,
      id: parseInt(event.id.replace(/\D/g, '')) + 2000 || Date.now(),
      extra: { type: 'weekly', eventId: event.id },
    });
  }
}

// Schedule all notifications for an event
export async function scheduleEventNotifications(event: RCTEvent) {
  try {
    // Determine event type
    const isDailyEvent = event.type === 'daily';
    const isWeeklyEvent = event.type === 'weekly';

    // 1. Schedule reminder 1 hour before
    await scheduleEventReminder({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time
    });

    // 2. Schedule daily event notification (morning of the event)
    if (isDailyEvent) {
      await scheduleDailyEventNotification({
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time
      });
    }

    // 3. Schedule weekly event notification (2 days before)
    if (isWeeklyEvent) {
      await scheduleWeeklyEventNotification({
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time
      });
    }

    console.log(`✅ Notifications planifiées pour l'événement: ${event.title}`);
  } catch (error) {
    console.error('Error scheduling event notifications:', error);
  }
}

// Schedule notifications for all upcoming events
export async function scheduleAllEventNotifications(events: RCTEvent[]) {
  const now = new Date();
  
  // Filter upcoming events only
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(`${event.date}T${event.time}`);
    return eventDate > now;
  });

  console.log(`📅 Planification des notifications pour ${upcomingEvents.length} événements à venir...`);

  for (const event of upcomingEvents) {
    await scheduleEventNotifications(event);
  }

  console.log('✅ Toutes les notifications ont été planifiées');
}

// Cancel all notifications for an event
export async function cancelEventNotifications(eventId: string) {
  const baseId = parseInt(eventId.replace(/\D/g, '')) || Date.now();
  
  // Cancel all 3 notification types
  await cancelNotification(baseId); // Reminder
  await cancelNotification(baseId + 1000); // Daily
  await cancelNotification(baseId + 2000); // Weekly
  
  console.log(`Notifications annulées pour l'événement: ${eventId}`);
}

// Check and reschedule notifications (call this on app startup)
export async function refreshEventNotifications(events: RCTEvent[]) {
  console.log('🔄 Rafraîchissement des notifications d\'événements...');
  
  // Cancel all pending notifications
  if (Capacitor.isNativePlatform()) {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
        console.log(`Annulation de ${pending.notifications.length} notifications en attente`);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }
  
  // Reschedule all notifications
  await scheduleAllEventNotifications(events);
}
