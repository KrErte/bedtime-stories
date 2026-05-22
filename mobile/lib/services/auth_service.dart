import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'api_service.dart';

class AuthService extends ChangeNotifier {
  final _storage = const FlutterSecureStorage();
  final _api = ApiService();
  Map<String, dynamic>? _user;
  bool _isLoggedIn = false;
  bool _isLoading = true;

  bool get isLoggedIn => _isLoggedIn;
  bool get isLoading => _isLoading;
  Map<String, dynamic>? get user => _user;
  bool get isPro => _user?['subscriptionStatus'] == 'pro';

  AuthService() {
    // Kui mis tahes API päring saab 401 ja refresh ebaõnnestub,
    // logitakse kasutaja automaatselt välja
    ApiService.onSessionExpired = () {
      _user = null;
      _isLoggedIn = false;
      notifyListeners();
    };
    _loadUser();
  }

  Future<void> _loadUser() async {
    _isLoading = true;
    try {
      final userData = await _storage.read(key: 'user');
      final refreshToken = await _storage.read(key: 'refreshToken');

      if (userData == null || refreshToken == null) {
        _isLoggedIn = false;
        return;
      }

      // Laadi kasutaja kohalikest andmetest kohe (UI kuvamiseks)
      _user = jsonDecode(userData);
      _isLoggedIn = true;
      notifyListeners();

      // Valideeri seanss — proovi access token refresh'ida
      // See tagab et vana/kehtetu token ei anna hiljem 401
      final newToken = await _api.tryRefreshToken();
      if (newToken == null) {
        // Refresh token aegunud — logi välja
        await _clearSession();
        notifyListeners();
      }
    } catch (_) {
      await _clearSession();
      notifyListeners();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> _clearSession() async {
    await _storage.deleteAll();
    _user = null;
    _isLoggedIn = false;
  }

  Future<void> register(String email, String password, String name) async {
    try {
      final res = await _api.post('/auth/register', body: {
        'email': email, 'password': password, 'name': name,
      });
      await _handleAuth(res);
    } on ApiException catch (e) {
      throw Exception(e.message);
    }
  }

  Future<void> login(String email, String password) async {
    final res = await _api.post('/auth/login', body: {
      'email': email, 'password': password,
    });
    await _handleAuth(res);
  }

  Future<void> logout() async {
    await _clearSession();
    notifyListeners();
  }

  Future<void> _handleAuth(Map<String, dynamic> res) async {
    await _storage.write(key: 'accessToken', value: res['accessToken']);
    await _storage.write(key: 'refreshToken', value: res['refreshToken']);
    await _storage.write(key: 'user', value: jsonEncode(res['user']));
    _user = res['user'];
    _isLoggedIn = true;
    notifyListeners();
  }
}
