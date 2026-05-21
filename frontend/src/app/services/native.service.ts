import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({ providedIn: 'root' })
export class NativeService {
  readonly isNative = Capacitor.isNativePlatform();
  readonly platform = Capacitor.getPlatform();

  async init() {
    if (!this.isNative) return;

    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#080720' });
    await SplashScreen.hide();
  }

  async shareStory(title: string, storyId: string) {
    if (!this.isNative) {
      if (navigator.share) {
        await navigator.share({ title, url: `https://dreamlit.ee/app/story/${storyId}` });
      }
      return;
    }
    await Share.share({
      title: title,
      text: `Check out this bedtime story: "${title}" on Dreamlit.ee`,
      url: `https://dreamlit.ee/app/story/${storyId}`,
      dialogTitle: 'Share Story',
    });
  }

  async hapticTap() {
    if (!this.isNative) return;
    await Haptics.impact({ style: ImpactStyle.Light });
  }

  async scheduleBedtimeReminder(hour: number, minute: number) {
    if (!this.isNative) return;

    const perms = await LocalNotifications.requestPermissions();
    if (perms.display !== 'granted') return;

    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'Bedtime Story Time!',
          body: 'Time for a magical bedtime story. Sweet dreams await!',
          schedule: {
            on: { hour, minute },
            every: 'day',
          },
          smallIcon: 'ic_notification',
          largeIcon: 'ic_launcher',
        },
      ],
    });
  }

  async cancelBedtimeReminder() {
    if (!this.isNative) return;
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
  }
}
