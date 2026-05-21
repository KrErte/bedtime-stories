#!/bin/bash
set -e

echo "=== Dreamlit.ee Android Release Build ==="

if [ -z "$KEYSTORE_PASS" ]; then
  echo "ERROR: KEYSTORE_PASS env muutuja puudub"
  echo "  export KEYSTORE_PASS=sinu_parool"
  exit 1
fi

cd frontend

echo "1. Angular production build..."
npm run build:mobile

echo "2. Capacitor sync..."
npx cap sync android

echo "3. Android AAB build..."
cd android
./gradlew bundleRelease

echo ""
echo "=== ✅ BUILD VALMIS ==="
echo "AAB: frontend/android/app/build/outputs/bundle/release/app-release.aab"
echo "Laadi see Google Play Console -> Production -> New release"
