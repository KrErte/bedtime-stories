import 'package:flutter_test/flutter_test.dart';
import 'package:dreamlit/models/child.dart';

void main() {
  group('Child.fromJson', () {
    final baseJson = {
      'id': 'child-1',
      'name': 'Mati',
      'age': 5,
    };

    test('parsib kohustuslikud väljad', () {
      final child = Child.fromJson(baseJson);
      expect(child.id, 'child-1');
      expect(child.name, 'Mati');
      expect(child.age, 5);
    });

    test('valikulised väljad on null kui puuduvad', () {
      final child = Child.fromJson(baseJson);
      expect(child.gender, isNull);
      expect(child.interests, isNull);
      expect(child.favoriteAnimal, isNull);
    });

    test('parsib kõik valikulised väljad', () {
      final child = Child.fromJson({
        ...baseJson,
        'gender': 'male',
        'interests': ['dinosaurused', 'kosmose'],
        'favoriteAnimal': 'draakon',
      });
      expect(child.gender, 'male');
      expect(child.interests, ['dinosaurused', 'kosmose']);
      expect(child.favoriteAnimal, 'draakon');
    });

    test('interests tühi list parsitakse korrektselt', () {
      final child = Child.fromJson({...baseJson, 'interests': <String>[]});
      expect(child.interests, isEmpty);
    });
  });
}
