import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { eventsApi } from '@/lib/api';
import { mapApiEvent } from '@/lib/apiMappers';
import { initNotifications, refreshEventNotifications } from '@/lib/notifications';

// Hook to manage event notifications
export const useEventNotifications = () => {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const setupNotifications = async () => {
      if (!isLoggedIn) return;

      try {
        // Initialize notification system
        await initNotifications();
        console.log('✅ Système de notifications initialisé');

        // Fetch all upcoming events
        const response = await eventsApi.getAll();
        if (response.success && response.data) {
          const events = (response.data as any[]).map(mapApiEvent);
          
          // Filter only future events
          const now = new Date();
          const futureEvents = events.filter(event => {
            const eventDate = new Date(`${event.date}T${event.time}`);
            return eventDate > now;
          });

          // Schedule notifications for all future events
          await refreshEventNotifications(futureEvents);
          
          console.log(`✅ ${futureEvents.length} événements programmés pour les notifications`);
        }
      } catch (error) {
        console.error('Erreur lors de la configuration des notifications:', error);
      }
    };

    setupNotifications();

    // Refresh notifications every hour to catch new events
    const intervalId = setInterval(() => {
      setupNotifications();
    }, 60 * 60 * 1000); // 1 hour

    return () => {
      clearInterval(intervalId);
    };
  }, [isLoggedIn]);
};
