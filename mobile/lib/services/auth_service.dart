import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'api_service.dart';

class AuthService extends ChangeNotifier {
  final _storage = const FlutterSecureStorage();
  final _api = ApiService();
  Map<String, dynamic>? _user;
  bool _isLoggedIn = false;

  bool get isLoggedIn => _isLoggedIn;
  Map<String, dynamic>? get user => _user;
  bool get isPro => _user?['subscriptionStatus'] == 'pro';

  AuthService() {
    _loadUser();
  }

  Future<void> _loadUser() async {
    final userData = await _storage.read(key: 'user');
    final token = await _storage.read(key: 'accessToken');
    if (userData != null && token != null) {
      _user = jsonDecode(userData);
      _isLoggedIn = true;
      notifyListeners();
    }
  }

  Future<void> register(String email, String password, String name) async {
    final res = await _api.post('/auth/register', body: {
      'email': email, 'password': password, 'name': name,
    });
    await _handleAuth(res);
  }

  Future<void> login(String email, String password) async {
    final res = await _api.post('/auth/login', body: {
      'email': email, 'password': password,
    });
    await _handleAuth(res);
  }

  Future<void> logout() async {
    await _storage.deleteAll();
    _user = null;
    _isLoggedIn = false;
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
