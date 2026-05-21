# Lokaalse testimise juhend

## Backend käivitamine
```bash
docker-compose up backend db
```

## Testimiskasutaja loomine
```bash
# Registreeri
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'

# Tee pro kasutajaks
docker exec -it bedtime-stories-db-1 psql -U dreamlit -d dreamlit \
  -c "UPDATE users SET subscription_status='pro' WHERE email='test@test.com';"
```

## Flutter käivitamine
```bash
cd mobile
flutter pub get
flutter build apk --debug
flutter run --use-application-binary android\app\build\outputs\flutter-apk\app-debug.apk
```

## APK asukoht pärast buildi
`mobile\android\app\build\outputs\flutter-apk\app-debug.apk`
