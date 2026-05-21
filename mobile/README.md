# Dreamlit.ee Mobile Apps

The mobile apps for iOS and Android are built using **Capacitor**, which wraps the Angular web app into native containers.

## Prerequisites

- Node.js 18+
- For iOS: macOS with Xcode 15+, CocoaPods
- For Android: Android Studio, JDK 17+

## Setup

```bash
cd frontend

# Install dependencies (includes Capacitor)
npm install

# Build the Angular app
npm run build

# Sync web assets to native projects
npx cap sync

# Open in IDE
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio
```

## Development Workflow

```bash
# 1. Make changes to Angular code
# 2. Build
npm run build

# 3. Sync to native projects
npx cap sync

# 4. Run on device/simulator
npx cap run ios
npx cap run android
```

## Live Reload (Development)

```bash
# Start Angular dev server
npm start

# In another terminal, run with live reload
npx cap run ios --livereload --external
npx cap run android --livereload --external
```

## Building for Release

### iOS
1. Open Xcode: `npx cap open ios`
2. Select "Any iOS Device" as target
3. Product > Archive
4. Distribute App > App Store Connect

### Android
1. Open Android Studio: `npx cap open android`
2. Build > Generate Signed Bundle/APK
3. Follow the signing wizard
4. Upload to Google Play Console

## Native Plugins Used

- `@capacitor/splash-screen` - Native splash screen
- `@capacitor/status-bar` - Status bar styling
- `@capacitor/keyboard` - Keyboard handling
- `@capacitor/haptics` - Haptic feedback
- `@capacitor/share` - Native share sheet (share stories)
- `@capacitor/local-notifications` - Bedtime reminders
- `@capacitor/push-notifications` - Push notifications (future)

## App Store Info

- **Bundle ID (iOS):** `ee.dreamlit.app`
- **Package Name (Android):** `ee.dreamlit.app`
- **App Name:** Dreamlit.ee
- **Category:** Education / Kids
