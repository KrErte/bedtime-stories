#!/bin/bash
set -e
echo "=== Dreamlit Flutter Android Setup ==="

# 1. Keystore
if [ ! -f "android/app/dreamlit-release.jks" ]; then
  echo "Genereerin keystori..."
  keytool -genkeypair -v \
    -keystore android/app/dreamlit-release.jks \
    -alias dreamlit \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -dname "CN=Dreamlit, OU=Mobile, O=Dreamlit OÜ, L=Estonia, S=Estonia, C=EE"
  echo "✅ Keystore loodud"
else
  echo "✅ Keystore olemas"
fi

# 2. key.properties
if [ ! -f "android/key.properties" ]; then
  echo ""
  echo "Sisesta keystore parool (mida kasutasid eelmises sammus):"
  read -s KS_PASS
  cat > android/key.properties << PROPS
storePassword=$KS_PASS
keyPassword=$KS_PASS
keyAlias=dreamlit
storeFile=dreamlit-release.jks
PROPS
  echo "✅ key.properties loodud"
fi

# 3. Dependencies
echo "Flutter pub get..."
flutter pub get

# 4. App ikoonid (kui assets/icons/icon.png olemas)
if [ -f "assets/icons/icon.png" ]; then
  echo "Genereerin app ikoone..."
  dart run flutter_launcher_icons
  echo "✅ Ikoonid genereeritud"
else
  echo "⚠️  Lisa 1024x1024 PNG: assets/icons/icon.png"
  echo "   Seejärel käivita: dart run flutter_launcher_icons"
fi

echo ""
echo "=== Setup valmis! ==="
echo "Builda release: ./build-release.sh"
