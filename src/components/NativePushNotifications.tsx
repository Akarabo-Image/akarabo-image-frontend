import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor, registerPlugin, type PluginListenerHandle } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { useAuth } from '../context/AuthContext';
import { pushNotificationService } from '../services/pushNotificationService';

const CHANNEL_ID = 'akarabo_alerts_v1';
const HeadsUpNotifications = registerPlugin<{ show(options: { title: string; body: string }): Promise<void> }>('HeadsUpNotifications');

export function NativePushNotifications() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const isAndroid = Capacitor.getPlatform() === 'android';
    const canReceiveAlerts = user?.role === 'OWNER' || user?.role === 'MANAGER';
    if (!Capacitor.isNativePlatform() || !isAndroid || isLoading || !isAuthenticated || !canReceiveAlerts) return;

    let active = true;
    const handles: PluginListenerHandle[] = [];
    const addListener = async (listener: Promise<PluginListenerHandle>) => {
      const handle = await listener;
      if (active) handles.push(handle);
      else await handle.remove();
    };

    void (async () => {
      try {
        // MainActivity creates this channel before the WebView starts. This
        // idempotent call also covers Android upgrades and channel repair.
        await PushNotifications.createChannel({
          id: CHANNEL_ID,
          name: 'Akarabo Studio alerts',
          description: 'Time-sensitive booking and client message alerts',
          importance: 4,
          vibration: true,
          visibility: 0,
        }).catch(() => undefined);

        const permission = await PushNotifications.checkPermissions();
        const granted = permission.receive === 'granted'
          ? permission
          : permission.receive === 'prompt' || permission.receive === 'prompt-with-rationale'
            ? await PushNotifications.requestPermissions()
            : permission;
        if (!active || granted.receive !== 'granted') return;

        await addListener(PushNotifications.addListener('registration', ({ value }) => {
          if (active) void pushNotificationService.register(value).catch(() => {
            console.error('Could not register this device for Akarabo alerts.');
          });
        }));
        await addListener(PushNotifications.addListener('registrationError', () => {
          console.error('Akarabo push registration failed.');
        }));
        await addListener(PushNotifications.addListener('pushNotificationReceived', ({ title, body }) => {
          // Android does not display FCM notification payloads while the app is
          // open. Re-post them locally on the high-importance channel to show
          // the requested heads-up banner in the foreground too.
          if (active && title && body) {
            void HeadsUpNotifications.show({ title, body }).catch(() => {
              console.error('Could not display the Akarabo alert banner.');
            });
          }
        }));
        await addListener(PushNotifications.addListener('pushNotificationActionPerformed', ({ notification }) => {
          const route = notification.data?.route;
          if (active && typeof route === 'string' && route.startsWith('/') && !route.startsWith('//')) {
            navigate(route);
          }
        }));

        await PushNotifications.register();
      } catch {
        console.error('Could not initialize Akarabo push notifications.');
      }
    })();

    return () => {
      active = false;
      for (const handle of handles) void handle.remove();
    };
  }, [isAuthenticated, isLoading, navigate, user?.role]);

  return null;
}
