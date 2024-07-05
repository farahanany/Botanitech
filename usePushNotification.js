import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
  let token;

  // Request permissions for notifications
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  // Get the token for this device
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);

  return token;
}

export async function scheduleNotificationAsync(title, body, trigger) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.HIGH, 
    },
    trigger,
  });
}

export async function cancelAllNotificationsAsync() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
