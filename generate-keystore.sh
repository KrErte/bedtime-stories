#!/bin/bash
# Käivita ÜKS KORD - hoia .jks fail turvalises kohas, mitte gitis!
keytool -genkeypair -v \
  -keystore frontend/android/app/dreamlit-release.jks \
  -alias dreamlit \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Dreamlit, OU=Mobile, O=Dreamlit OÜ, L=Estonia, S=Estonia, C=EE"

echo ""
echo "✅ Keystore loodud: frontend/android/app/dreamlit-release.jks"
echo ""
echo "Sea env muutujad (lisa ~/.bashrc või ~/.zshrc):"
echo "  export KEYSTORE_PASS=sinu_parool"
echo "  export KEY_ALIAS=dreamlit"
echo "  export KEY_PASS=sinu_parool"
