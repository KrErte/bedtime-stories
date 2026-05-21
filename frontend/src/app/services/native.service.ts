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
    const url = `https://dreamlit.ee/app/story/${storyId}`;
    if (!this.isNative) {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        // Fallback: copy to clipboard + show toast
        try {
          await navigator.clipboard.writeText(url);
        } catch {
          const ta = document.createElement('textarea');
          ta.value = url;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        this.showToast('Link copied to clipboard!');
      }
      return;
    }
    await Share.share({
      title,
      text: `Check out this bedtime story: "${title}" on Dreamlit.ee`,
      url,
      dialogTitle: 'Share Story',
    });
  }

  showToast(message: string, duration = 2500) {
    const existing = document.getElementById('dreamlit-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'dreamlit-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
      background:#7c3aed;color:white;padding:10px 20px;border-radius:8px;
      font-size:14px;font-weight:600;z-index:99999;
      box-shadow:0 4px 12px rgba(0,0,0,0.4);
      animation:fadeInUp 0.2s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
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
