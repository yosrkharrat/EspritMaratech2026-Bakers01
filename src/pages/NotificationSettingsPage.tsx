import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, BellOff, Calendar, Clock, CheckCircle2, Info } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { showLocalNotification, getPendingNotifications } from '@/lib/notifications';

const NotificationSettingsPage = () => {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [settings, setSettings] = useState({
    dailyEvents: true,
    weeklyEvents: true,
    reminders: true,
  });

  useEffect(() => {
    checkPermissions();
    loadPendingNotifications();
    loadSettings();
  }, []);

  const checkPermissions = async () => {
    if (!Capacitor.isNativePlatform()) {
      // Web notifications
      if ('Notification' in window) {
        setNotificationsEnabled(Notification.permission === 'granted');
      }
      return;
    }

    try {
      const localStatus = await LocalNotifications.checkPermissions();
      setNotificationsEnabled(localStatus.display === 'granted');

      const pushStatus = await PushNotifications.checkPermissions();
      setPushEnabled(pushStatus.receive === 'granted');
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const loadPendingNotifications = async () => {
    try {
      const pending = await getPendingNotifications();
      setPendingCount(pending.length);
    } catch (error) {
      console.error('Error loading pending notifications:', error);
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('rct_notification_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('rct_notification_settings', JSON.stringify(newSettings));
  };

  const requestPermissions = async () => {
    if (!Capacitor.isNativePlatform()) {
      // Request web notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setNotificationsEnabled(permission === 'granted');
        
        if (permission === 'granted') {
          new Notification('Notifications activées! 🎉', {
            body: 'Vous recevrez maintenant les notifications pour les événements RCT',
            icon: '/favicon.svg'
          });
        }
      }
      return;
    }

    try {
      const localPermissions = await LocalNotifications.requestPermissions();
      setNotificationsEnabled(localPermissions.display === 'granted');

      const pushPermissions = await PushNotifications.requestPermissions();
      setPushEnabled(pushPermissions.receive === 'granted');

      if (pushPermissions.receive === 'granted') {
        await PushNotifications.register();
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const testNotification = async () => {
    await showLocalNotification({
      title: '🏃 Test RCT Connect',
      body: 'Les notifications fonctionnent correctement!',
      id: Date.now(),
    });
  };

  const toggleSetting = (key: keyof typeof settings) => {
    saveSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="pb-20 pt-6">
      <div className="flex items-center gap-3 px-4 mb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center" aria-label="Retour">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-extrabold text-xl">Notifications</h1>
          <p className="text-xs text-muted-foreground">Gérer les alertes d'événements</p>
        </div>
      </div>

      {/* Permission Status */}
      <div className="mx-4 mb-6">
        <div className={`rounded-2xl p-4 ${notificationsEnabled ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-start gap-3">
            {notificationsEnabled ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-semibold ${notificationsEnabled ? 'text-green-800' : 'text-yellow-800'}`}>
                {notificationsEnabled ? 'Notifications activées' : 'Notifications désactivées'}
              </p>
              <p className={`text-xs mt-1 ${notificationsEnabled ? 'text-green-700' : 'text-yellow-700'}`}>
                {notificationsEnabled 
                  ? `${pendingCount} notification(s) programmée(s) pour les événements à venir`
                  : 'Activez les notifications pour recevoir les rappels d\'événements'}
              </p>
              {!notificationsEnabled && (
                <button
                  onClick={requestPermissions}
                  className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-xl text-xs font-semibold hover:bg-yellow-700 transition-colors"
                >
                  Activer les notifications
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Test Notification */}
      {notificationsEnabled && (
        <div className="mx-4 mb-6">
          <button
            onClick={testNotification}
            className="w-full py-3 px-4 bg-card rounded-2xl rct-shadow-card flex items-center justify-center gap-2 font-semibold text-sm hover:bg-muted transition-colors"
          >
            <Bell className="w-4 h-4" />
            Tester les notifications
          </button>
        </div>
      )}

      {/* Notification Types */}
      <div className="mx-4 mb-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Types de notifications</p>
        <div className="bg-card rounded-2xl rct-shadow-card overflow-hidden">
          <button
            onClick={() => toggleSetting('dailyEvents')}
            className="w-full flex items-center gap-3 px-4 py-4 border-b border-border"
          >
            <Calendar className="w-5 h-5 text-primary" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Événements quotidiens</p>
              <p className="text-xs text-muted-foreground">Notification le matin de chaque événement quotidien</p>
            </div>
            <div className={`w-12 h-7 rounded-full flex items-center px-0.5 transition-colors ${settings.dailyEvents ? 'bg-primary' : 'bg-muted'}`}>
              <div className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${settings.dailyEvents ? 'translate-x-5' : ''}`} />
            </div>
          </button>

          <button
            onClick={() => toggleSetting('weeklyEvents')}
            className="w-full flex items-center gap-3 px-4 py-4 border-b border-border"
          >
            <Calendar className="w-5 h-5 text-purple-600" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Événements hebdomadaires</p>
              <p className="text-xs text-muted-foreground">Rappel 2 jours avant les événements hebdomadaires</p>
            </div>
            <div className={`w-12 h-7 rounded-full flex items-center px-0.5 transition-colors ${settings.weeklyEvents ? 'bg-primary' : 'bg-muted'}`}>
              <div className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${settings.weeklyEvents ? 'translate-x-5' : ''}`} />
            </div>
          </button>

          <button
            onClick={() => toggleSetting('reminders')}
            className="w-full flex items-center gap-3 px-4 py-4"
          >
            <Clock className="w-5 h-5 text-orange-600" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Rappels automatiques</p>
              <p className="text-xs text-muted-foreground">Rappel 1 heure avant chaque événement</p>
            </div>
            <div className={`w-12 h-7 rounded-full flex items-center px-0.5 transition-colors ${settings.reminders ? 'bg-primary' : 'bg-muted'}`}>
              <div className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${settings.reminders ? 'translate-x-5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="mx-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-xs text-blue-800">
          <strong>💡 Comment ça marche?</strong>
          <br /><br />
          • <strong>Événements quotidiens</strong>: Notification à 6h00 le jour de l'événement
          <br />
          • <strong>Événements hebdomadaires</strong>: Notification 2 jours avant à 18h00
          <br />
          • <strong>Rappels automatiques</strong>: Notification 1 heure avant le début
        </p>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
