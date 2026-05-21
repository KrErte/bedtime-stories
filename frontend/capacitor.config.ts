import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ee.dreamlit.app',
  appName: 'Dreamlit.ee',
  webDir: 'dist/frontend/browser',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#080720',
      showSpinner: true,
      spinnerColor: '#7c3aed',
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#080720',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'DreamlitEe',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#080720',
  },
};

export default config;
