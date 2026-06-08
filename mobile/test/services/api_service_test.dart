import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:mocktail/mocktail.dart';
import 'package:dreamlit/services/api_service.dart';

class MockHttpClient extends Mock implements http.Client {}
class MockFlutterSecureStorage extends Mock implements FlutterSecureStorage {}
class FakeUri extends Fake implements Uri {}

void main() {
  setUpAll(() {
    registerFallbackValue(FakeUri());
    registerFallbackValue(<String, String>{});
  });

  late MockHttpClient mockClient;
  late MockFlutterSecureStorage mockStorage;
  late ApiService api;

  setUp(() {
    mockClient = MockHttpClient();
    mockStorage = MockFlutterSecureStorage();
    api = ApiService(storage: mockStorage, client: mockClient);
    ApiService.onSessionExpired = null;

    // Vaikimisi: access token olemas
    when(() => mockStorage.read(key: 'accessToken')).thenAnswer((_) async => 'access-token-123');
    when(() => mockStorage.read(key: 'refreshToken')).thenAnswer((_) async => 'refresh-token-abc');
    when(() => mockStorage.write(key: any(named: 'key'), value: any(named: 'value')))
        .thenAnswer((_) async {});
    when(() => mockStorage.deleteAll()).thenAnswer((_) async {});
  });

  http.Response ok(Object body) => http.Response(jsonEncode(body), 200);
  http.Response err(int code, [String? msg]) => http.Response(
      msg != null ? jsonEncode({'message': msg}) : '', code);

  group('GET', () {
    test('tagastab dekooded JSON eduka vastuse korral', () async {
      when(() => mockClient.get(any(), headers: any(named: 'headers')))
          .thenAnswer((_) async => ok({'id': '1', 'name': 'test'}));

      final result = await api.get('/stories');
      expect(result['id'], '1');
    });

    test('edastab query parameetrid URI-sse', () async {
      Uri? capturedUri;
      when(() => mockClient.get(any(), headers: any(named: 'headers'))).thenAnswer((inv) async {
        capturedUri = inv.positionalArguments[0] as Uri;
        return ok([]);
      });

      await api.get('/stories', params: {'page': '1', 'limit': '10'});
      expect(capturedUri?.queryParameters['page'], '1');
      expect(capturedUri?.queryParameters['limit'], '10');
    });

    test('lisab Authorization headeri tokeniga', () async {
      Map<String, String>? capturedHeaders;
      when(() => mockClient.get(any(), headers: any(named: 'headers'))).thenAnswer((inv) async {
        capturedHeaders = inv.namedArguments[const Symbol('headers')] as Map<String, String>;
        return ok({});
      });

      await api.get('/me');
      expect(capturedHeaders?['Authorization'], 'Bearer access-token-123');
    });

    test('ei lisa Authorization headeri kui token puudub', () async {
      when(() => mockStorage.read(key: 'accessToken')).thenAnswer((_) async => null);
      Map<String, String>? capturedHeaders;
      when(() => mockClient.get(any(), headers: any(named: 'headers'))).thenAnswer((inv) async {
        capturedHeaders = inv.namedArguments[const Symbol('headers')] as Map<String, String>;
        return ok({});
      });

      await api.get('/public');
      expect(capturedHeaders?.containsKey('Authorization'), false);
    });
  });

  group('POST', () {
    test('tagastab dekooded JSON', () async {
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => ok({'created': true}));

      final result = await api.post('/stories', body: {'title': 'Test'});
      expect(result['created'], true);
    });

    test('tagastab null tühja body puhul', () async {
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => http.Response('', 201));

      final result = await api.post('/stories/generate');
      expect(result, isNull);
    });
  });

  group('PUT', () {
    test('saadab PUT päringu ja tagastab vastuse', () async {
      when(() => mockClient.put(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => ok({'updated': true}));

      final result = await api.put('/children/1', body: {'name': 'Mari'});
      expect(result['updated'], true);
    });
  });

  group('DELETE', () {
    test('saadab DELETE päringu', () async {
      when(() => mockClient.delete(any(), headers: any(named: 'headers')))
          .thenAnswer((_) async => http.Response('', 204));

      final result = await api.delete('/stories/1');
      expect(result, isNull);
    });
  });

  group('401 → refresh retry loogika', () {
    test('401 puhul teeb refresh ja kordab päringut uue tokeniga', () async {
      var callCount = 0;
      when(() => mockClient.get(any(), headers: any(named: 'headers'))).thenAnswer((_) async {
        callCount++;
        return callCount == 1 ? err(401) : ok({'data': 'ok'});
      });

      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => ok({'accessToken': 'new-access', 'refreshToken': 'new-refresh'}));

      final result = await api.get('/protected');
      expect(result['data'], 'ok');
      expect(callCount, 2); // esimene 401, teine uue tokeniga
      verify(() => mockStorage.write(key: 'accessToken', value: 'new-access')).called(1);
    });

    test('401 + refresh ebaõnnestub → ApiException + deleteAll + callback', () async {
      when(() => mockClient.get(any(), headers: any(named: 'headers')))
          .thenAnswer((_) async => err(401));

      // Refresh endpoint tagastab 401
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => err(401));

      bool callbackCalled = false;
      ApiService.onSessionExpired = () => callbackCalled = true;

      await expectLater(
        () => api.get('/protected'),
        throwsA(isA<ApiException>().having((e) => e.statusCode, 'statusCode', 401)),
      );

      verify(() => mockStorage.deleteAll()).called(1);
      expect(callbackCalled, true);
    });

    test('401 + refresh token puudub → ApiException kohe', () async {
      when(() => mockStorage.read(key: 'refreshToken')).thenAnswer((_) async => null);
      when(() => mockClient.get(any(), headers: any(named: 'headers')))
          .thenAnswer((_) async => err(401));

      bool callbackCalled = false;
      ApiService.onSessionExpired = () => callbackCalled = true;

      await expectLater(
        () => api.get('/protected'),
        throwsA(isA<ApiException>().having((e) => e.statusCode, 'statusCode', 401)),
      );
      verify(() => mockStorage.deleteAll()).called(1);
      expect(callbackCalled, true);
    });
  });

  group('HTTP veavastused', () {
    test('500 viga viskab ApiException serveri veaga', () async {
      when(() => mockClient.get(any(), headers: any(named: 'headers')))
          .thenAnswer((_) async => err(500, 'Sisemine viga'));

      await expectLater(
        () => api.get('/stories'),
        throwsA(isA<ApiException>()
            .having((e) => e.statusCode, 'statusCode', 500)
            .having((e) => e.message, 'message', 'Sisemine viga')),
      );
    });

    test('404 koos tühja body → vaikimisi veateade', () async {
      when(() => mockClient.get(any(), headers: any(named: 'headers')))
          .thenAnswer((_) async => err(404));

      await expectLater(
        () => api.get('/notfound'),
        throwsA(isA<ApiException>()
            .having((e) => e.statusCode, 'statusCode', 404)
            .having((e) => e.message, 'message', contains('404'))),
      );
    });

    test('ApiException.toString() sisaldab status kood', () {
      final e = ApiException(422, 'Vigane sisend');
      expect(e.toString(), '[422] Vigane sisend');
    });
  });

  group('tryRefreshToken', () {
    test('tagastab uue access tokeni eduka refresh puhul', () async {
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => ok({'accessToken': 'new-access', 'refreshToken': 'new-refresh'}));

      final token = await api.tryRefreshToken();
      expect(token, 'new-access');
      verify(() => mockStorage.write(key: 'accessToken', value: 'new-access')).called(1);
      verify(() => mockStorage.write(key: 'refreshToken', value: 'new-refresh')).called(1);
    });

    test('tagastab null kui refresh token puudub', () async {
      when(() => mockStorage.read(key: 'refreshToken')).thenAnswer((_) async => null);
      final token = await api.tryRefreshToken();
      expect(token, isNull);
      verifyNever(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')));
    });

    test('tagastab null kui server vastab veaga', () async {
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => err(401));
      final token = await api.tryRefreshToken();
      expect(token, isNull);
    });

    test('tagastab null kui network viga', () async {
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenThrow(Exception('Network error'));
      final token = await api.tryRefreshToken();
      expect(token, isNull);
    });
  });
}
