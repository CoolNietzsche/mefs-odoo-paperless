import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { odooService } from '../services/odoo.service';

export function useNotifications() {
  const { session } = useAuthStore();

  useEffect(() => {
    if (session) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          // Register token with Odoo
          odooService.rpc('/mobile/v1/register', {
            token,
            platform: Platform.OS,
            app_version: '1.0.0'
          }).catch(err => console.error('Token registration failed', err));
        }
      });
    }
  }, [session]);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#875A7B',
      });
    }

    return token;
  }
}
