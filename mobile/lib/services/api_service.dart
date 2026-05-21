import 'dart:convert';
import 'dart:io';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:http/io_client.dart';

class ApiService {
  static const baseUrl = 'https://api.dreamlit.ee/api';

  final _storage = const FlutterSecureStorage();

  http.Client _buildClient() {
    final ctx = SecurityContext.defaultContext;
    final ioClient = HttpClient(context: ctx)
      ..badCertificateCallback = (cert, host, port) => true;
    return IOClient(ioClient);
  }

  Future<Map<String, String>> _headers() async {
    final token = await _storage.read(key: 'accessToken');
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<dynamic> get(String path, {Map<String, String>? params}) async {
    final uri = Uri.parse('$baseUrl$path').replace(queryParameters: params);
    final res = await _buildClient().get(uri, headers: await _headers());
    return _handleResponse(res);
  }

  Future<dynamic> post(String path, {Map<String, dynamic>? body}) async {
    final res = await _buildClient().post(
      Uri.parse('$baseUrl$path'),
      headers: await _headers(),
      body: body != null ? jsonEncode(body) : null,
    );
    return _handleResponse(res);
  }

  Future<dynamic> put(String path, {Map<String, dynamic>? body}) async {
    final res = await _buildClient().put(
      Uri.parse('$baseUrl$path'),
      headers: await _headers(),
      body: body != null ? jsonEncode(body) : null,
    );
    return _handleResponse(res);
  }

  Future<dynamic> delete(String path) async {
    final res = await _buildClient().delete(
      Uri.parse('$baseUrl$path'),
      headers: await _headers(),
    );
    return _handleResponse(res);
  }

  dynamic _handleResponse(http.Response res) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (res.body.isEmpty) return null;
      return jsonDecode(res.body);
    }
    final error = res.body.isNotEmpty ? jsonDecode(res.body) : {};
    throw ApiException(res.statusCode, error['message'] ?? 'Request failed');
  }
}

class ApiException implements Exception {
  final int statusCode;
  final String message;
  ApiException(this.statusCode, this.message);
  @override
  String toString() => message;
}
