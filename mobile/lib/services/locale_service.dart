import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class LocaleService extends ChangeNotifier {
  static const _key = 'app_locale';
  final _storage = const FlutterSecureStorage();

  // null = kasuta seadme keelt (Flutter valib automaatselt)
  Locale? _locale;

  Locale? get locale => _locale;

  static const _supportedCodes = {
    'en', 'et', 'ru', 'de', 'fi', 'lv', 'lt',
    'fr', 'es', 'it', 'pl', 'nl', 'sv', 'nb', 'pt',
  };

  LocaleService() {
    _load();
  }

  Future<void> _load() async {
    final code = await _storage.read(key: _key);
    if (code != null && _supportedCodes.contains(code)) {
      _locale = Locale(code);
      notifyListeners();
    }
    // Kui salvestust pole → jätab null → Flutter kasutab seadme keelt
  }

  Future<void> setLocale(Locale locale) async {
    if (_locale == locale) return;
    _locale = locale;
    await _storage.write(key: _key, value: locale.languageCode);
    notifyListeners();
  }

  /// Lähtesta seadme keelele
  Future<void> resetToDeviceLocale() async {
    _locale = null;
    await _storage.delete(key: _key);
    notifyListeners();
  }

  /// Kuvamiseks: keele nimetus emakeeles
  static const Map<String, String> languageNames = {
    'en': 'English',
    'et': 'Eesti',
    'ru': 'Русский',
    'de': 'Deutsch',
    'fi': 'Suomi',
    'lv': 'Latviešu',
    'lt': 'Lietuvių',
    'fr': 'Français',
    'es': 'Español',
    'it': 'Italiano',
    'pl': 'Polski',
    'nl': 'Nederlands',
    'sv': 'Svenska',
    'nb': 'Norsk',
    'pt': 'Português',
  };

  /// Claude API jaoks: ingliskeelne nimi
  static const Map<String, String> languageNamesForAI = {
    'en': 'English',
    'et': 'Estonian',
    'ru': 'Russian',
    'de': 'German',
    'fi': 'Finnish',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'fr': 'French',
    'es': 'Spanish',
    'it': 'Italian',
    'pl': 'Polish',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'nb': 'Norwegian',
    'pt': 'Portuguese',
  };
}
