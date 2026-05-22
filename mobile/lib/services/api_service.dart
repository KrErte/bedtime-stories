import 'dart:convert';
import 'dart:io';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:http/io_client.dart';

class ApiService {
  static const baseUrl = 'https://dreamlit.ee/api';

  final _storage = const FlutterSecureStorage();

  // Callback mida AuthService seab — kutsutakse kui refresh ebaõnnestub
  static void Function()? onSessionExpired;

  http.Client _buildClient() {
    final ctx = SecurityContext.defaultContext;
    final ioClient = HttpClient(context: ctx)
      ..badCertificateCallback = (cert, host, port) => true;
    return IOClient(ioClient);
  }

  Future<Map<String, String>> _headers({String? overrideToken}) async {
    final token = overrideToken ?? await _storage.read(key: 'accessToken');
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // Proovib refresh tokeniga uut access tokenit saada.
  // Tagastab uue access tokeni või null kui refresh ebaõnnestus.
  // Avalik — kasutatakse AuthService startup valideerimiseks.
  Future<String?> tryRefreshToken() async {
    final refreshToken = await _storage.read(key: 'refreshToken');
    if (refreshToken == null) return null;
    try {
      final res = await _buildClient().post(
        Uri.parse('$baseUrl/auth/refresh'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refreshToken': refreshToken}),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final newAccess = data['accessToken'] as String?;
        final newRefresh = data['refreshToken'] as String?;
        if (newAccess != null) {
          await _storage.write(key: 'accessToken', value: newAccess);
          if (newRefresh != null) {
            await _storage.write(key: 'refreshToken', value: newRefresh);
          }
          return newAccess;
        }
      }
    } catch (_) {}
    return null;
  }

  // Üldine request meetod — 401 puhul proovib refresh ja kordab ühe korra
  Future<dynamic> _request(Future<http.Response> Function(Map<String, String> headers) call,
      {bool isRetry = false}) async {
    final headers = await _headers();
    final res = await call(headers);

    if (res.statusCode == 401 && !isRetry) {
      // Access token aegunud — proovi refresh
      final newToken = await tryRefreshToken();
      if (newToken != null) {
        // Korda päringut uue tokeniga
        final retryHeaders = await _headers(overrideToken: newToken);
        final retryRes = await call(retryHeaders);
        return _handleResponse(retryRes);
      } else {
        // Refresh ebaõnnestus — seanss on aegunud
        await _storage.deleteAll();
        onSessionExpired?.call();
        throw ApiException(401, 'Seanss on aegunud, palun logi uuesti sisse');
      }
    }

    return _handleResponse(res);
  }

  Future<dynamic> get(String path, {Map<String, String>? params}) async {
    final uri = Uri.parse('$baseUrl$path').replace(queryParameters: params);
    return _request((h) => _buildClient().get(uri, headers: h));
  }

  Future<dynamic> post(String path, {Map<String, dynamic>? body, Map<String, String>? params}) async {
    final uri = Uri.parse('$baseUrl$path').replace(queryParameters: params);
    final encoded = body != null ? jsonEncode(body) : null;
    return _request((h) => _buildClient().post(uri, headers: h, body: encoded));
  }

  Future<dynamic> put(String path, {Map<String, dynamic>? body}) async {
    final uri = Uri.parse('$baseUrl$path');
    final encoded = body != null ? jsonEncode(body) : null;
    return _request((h) => _buildClient().put(uri, headers: h, body: encoded));
  }

  Future<dynamic> delete(String path) async {
    final uri = Uri.parse('$baseUrl$path');
    return _request((h) => _buildClient().delete(uri, headers: h));
  }

  dynamic _handleResponse(http.Response res) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (res.body.isEmpty) return null;
      return jsonDecode(res.body);
    }
    Map error = {};
    try { error = res.body.isNotEmpty ? jsonDecode(res.body) : {}; } catch (_) {}
    final msg = error['message'] as String?;
    throw ApiException(res.statusCode, msg ?? 'HTTP ${res.statusCode}: ${res.body.isEmpty ? "empty" : res.body}');
  }
}

class ApiException implements Exception {
  final int statusCode;
  final String message;
  ApiException(this.statusCode, this.message);
  @override
  String toString() => '[$statusCode] $message';
}
