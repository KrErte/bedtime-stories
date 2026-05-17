# Play Store publitseerimise checklist

## Ühekordne setup
- [ ] `./setup-android.sh` — keystore + dependencies
- [ ] Lisa `assets/icons/icon.png` (1024x1024 PNG)
- [ ] `dart run flutter_launcher_icons` — genereeri ikoonid

## API URL
Kontrolli `lib/services/api_service.dart`:
```dart
static const baseUrl = 'https://api.dreamlit.ee/api';
```
Veendu et backend töötab sellel aadressil.

## Build
```bash
./build-release.sh
```

## Play Console
- [ ] Google Play Developer konto (25$ ühekordne)
- [ ] Uus app → Package name: `ee.dreamlit.app`
- [ ] Laadi üles: `build/app/outputs/bundle/release/app-release.aab`
- [ ] Store listing:
  - [ ] Rakenduse nimi: Dreamlit
  - [ ] Lühikirjeldus (80 tähemärki)
  - [ ] Täiskirjeldus
  - [ ] Screenshots (min 2)
  - [ ] Feature graphic (1024×500)
  - [ ] App icon (512×512)
- [ ] Privacy Policy URL — **KOHUSTUSLIK** (laste äpp + GDPR)
- [ ] Content rating — täida küsimustik
- [ ] Target audience → alla 13? → lisanõuded!
