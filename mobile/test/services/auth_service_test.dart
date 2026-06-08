import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:mocktail/mocktail.dart';
import 'package:dreamlit/services/api_service.dart';
import 'package:dreamlit/services/auth_service.dart';

class MockHttpClient extends Mock implements http.Client {}
class MockFlutterSecureStorage extends Mock implements FlutterSecureStorage {}
class FakeUri extends Fake implements Uri {}

const _user = {'id': 'u1', 'email': 'test@test.com', 'name': 'Test', 'subscriptionStatus': 'free'};
const _proUser = {'id': 'u1', 'email': 'test@test.com', 'name': 'Test', 'subscriptionStatus': 'pro'};

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

    when(() => mockStorage.write(key: any(named: 'key'), value: any(named: 'value')))
        .thenAnswer((_) async {});
    when(() => mockStorage.deleteAll()).thenAnswer((_) async {});
  });

  AuthService buildAuth() => AuthService(api: api, storage: mockStorage);

  void stubStoredSession({String? accessToken, String? refreshToken, Map? user}) {
    when(() => mockStorage.read(key: 'accessToken')).thenAnswer((_) async => accessToken);
    when(() => mockStorage.read(key: 'refreshToken')).thenAnswer((_) async => refreshToken);
    when(() => mockStorage.read(key: 'user'))
        .thenAnswer((_) async => user != null ? jsonEncode(user) : null);
  }

  http.Response ok(Object body) => http.Response(jsonEncode(body), 200);
  http.Response err(int code, [String? msg]) => http.Response(
      msg != null ? jsonEncode({'message': msg}) : '', code);

  group('startup — seansi valideerimine', () {
    test('laadib kasutaja storage-st ja valideerib refreshiga', () async {
      stubStoredSession(
        accessToken: 'old-access',
        refreshToken: 'valid-refresh',
        user: _user,
      );
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => ok({'accessToken': 'new-access', 'refreshToken': 'new-refresh'}));

      final auth = buildAuth();
      // Oota async _loadUser lõppemist
      await Future.delayed(const Duration(milliseconds: 50));

      expect(auth.isLoggedIn, true);
      expect(auth.user?['email'], 'test@test.com');
      expect(auth.isLoading, false);
    });

    test('logib välja kui refresh token puudub', () async {
      stubStoredSession(refreshToken: null, user: _user);

      final auth = buildAuth();
      await Future.delayed(const Duration(milliseconds: 50));

      expect(auth.isLoggedIn, false);
      expect(auth.user, isNull);
    });

    test('logib välja kui refresh ebaõnnestub (401)', () async {
      stubStoredSession(
        accessToken: 'expired-access',
        refreshToken: 'expired-refresh',
        user: _user,
      );
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => err(401));

      final auth = buildAuth();
      await Future.delayed(const Duration(milliseconds: 50));

      expect(auth.isLoggedIn, false);
      verify(() => mockStorage.deleteAll()).called(greaterThanOrEqualTo(1));
    });

    test('logib välja kui storage tühi', () async {
      stubStoredSession(user: null, refreshToken: null);

      final auth = buildAuth();
      await Future.delayed(const Duration(milliseconds: 50));

      expect(auth.isLoggedIn, false);
    });
  });

  group('login', () {
    setUp(() {
      stubStoredSession(user: null, refreshToken: null);
    });

    test('edukas login seab isLoggedIn true ja salvestab tokenid', () async {
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => ok({
                'accessToken': 'access-abc',
                'refreshToken': 'refresh-xyz',
                'user': _user,
              }));

      final auth = buildAuth();
      await Future.delayed(const Duration(milliseconds: 50));
      await auth.login('test@test.com', 'password123');

      expect(auth.isLoggedIn, true);
      expect(auth.user?['email'], 'test@test.com');
      verify(() => mockStorage.write(key: 'accessToken', value: 'access-abc')).called(1);
      verify(() => mockStorage.write(key: 'refreshToken', value: 'refresh-xyz')).called(1);
    });

    test('login viga viskab ApiException edasi', () async {
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => err(401, 'Vale parool'));

      final auth = buildAuth();
      await Future.delayed(const Duration(milliseconds: 50));

      await expectLater(
        () => auth.login('test@test.com', 'wrong'),
        throwsA(isA<ApiException>().having((e) => e.message, 'message', 'Vale parool')),
      );
      expect(auth.isLoggedIn, false);
    });
  });

  group('logout', () {
    test('logout kustutab seansi ja seab isLoggedIn false', () async {
      stubStoredSession(
        accessToken: 'access',
        refreshToken: 'refresh',
        user: _user,
      );
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => ok({'accessToken': 'new', 'refreshToken': 'new'}));

      final auth = buildAuth();
      await Future.delayed(const Duration(milliseconds: 50));
      expect(auth.isLoggedIn, true);

      await auth.logout();
      expect(auth.isLoggedIn, false);
      expect(auth.user, isNull);
      verify(() => mockStorage.deleteAll()).called(greaterThanOrEqualTo(1));
    });
  });

  group('isPro getter', () {
    test('isPro false vabakasutajal', () async {
      stubStoredSession(
        accessToken: 'access',
        refreshToken: 'refresh',
        user: _user,
      );
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => ok({'accessToken': 'new', 'refreshToken': 'new'}));

      final auth = buildAuth();
      await Future.delayed(const Duration(milliseconds: 50));
      expect(auth.isPro, false);
    });

    test('isPro true pro kasutajal', () async {
      stubStoredSession(
        accessToken: 'access',
        refreshToken: 'refresh',
        user: _proUser,
      );
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async => ok({'accessToken': 'new', 'refreshToken': 'new'}));

      final auth = buildAuth();
      await Future.delayed(const Duration(milliseconds: 50));
      expect(auth.isPro, true);
    });
  });

  group('onSessionExpired callback', () {
    test('API 401 + failed refresh kutsub onSessionExpired callback', () async {
      stubStoredSession(
        accessToken: 'access',
        refreshToken: 'refresh',
        user: _user,
      );

      var callCount = 0;
      // Esimene POST = startup refresh (edukas), järgmised = data päringu 401 refresh (ebaõnnestub)
      when(() => mockClient.post(any(), headers: any(named: 'headers'), body: any(named: 'body')))
          .thenAnswer((_) async {
        callCount++;
        return callCount == 1
            ? ok({'accessToken': 'new-access', 'refreshToken': 'new-refresh'})
            : err(401);
      });
      when(() => mockStorage.read(key: 'accessToken')).thenAnswer((_) async => 'new-access');
      when(() => mockClient.get(any(), headers: any(named: 'headers')))
          .thenAnswer((_) async => err(401));

      final auth = buildAuth();
      await Future.delayed(const Duration(milliseconds: 50));
      expect(auth.isLoggedIn, true);

      // GET päring saab 401, refresh ebaõnnestub → callback
      await expectLater(
        () => api.get('/protected'),
        throwsA(isA<ApiException>()),
      );
      expect(auth.isLoggedIn, false);
    });
  });
}
