#!/bin/bash
set -e
echo "=== Dreamlit Flutter Android Release Build ==="

if [ ! -f "android/key.properties" ]; then
  echo "ERROR: android/key.properties puudub. Käivita ./setup-android.sh"
  exit 1
fi

echo "Flutter pub get..."
flutter pub get

echo "Buildan AAB..."
flutter build appbundle --release

echo ""
echo "=== ✅ BUILD VALMIS ==="
echo "AAB: build/app/outputs/bundle/release/app-release.aab"
echo "Laadi see Google Play Console -> Production -> New release"
