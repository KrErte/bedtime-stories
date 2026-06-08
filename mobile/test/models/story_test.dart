import 'package:flutter_test/flutter_test.dart';
import 'package:dreamlit/models/story.dart';

void main() {
  group('Story.fromJson', () {
    final baseJson = {
      'id': 'story-1',
      'childId': 'child-1',
      'title': 'Kuuvalgusel',
      'content': 'Oli kord...',
      'contentWordCount': 42,
      'isFavorite': false,
      'createdAt': '2024-01-01T00:00:00Z',
    };

    test('parsib kohustuslikud väljad', () {
      final story = Story.fromJson(baseJson);
      expect(story.id, 'story-1');
      expect(story.childId, 'child-1');
      expect(story.title, 'Kuuvalgusel');
      expect(story.content, 'Oli kord...');
      expect(story.contentWordCount, 42);
      expect(story.isFavorite, false);
      expect(story.createdAt, '2024-01-01T00:00:00Z');
    });

    test('valikulised väljad on null kui puuduvad', () {
      final story = Story.fromJson(baseJson);
      expect(story.audioUrl, isNull);
      expect(story.audioDurationSeconds, isNull);
      expect(story.illustrationTheme, isNull);
      expect(story.illustrationUrls, isNull);
      expect(story.storyTheme, isNull);
    });

    test('parsib kõik valikulised väljad', () {
      final story = Story.fromJson({
        ...baseJson,
        'audioUrl': 'https://cdn.example.com/audio.mp3',
        'audioDurationSeconds': 180,
        'illustrationTheme': 'fantasy',
        'illustrationUrls': ['https://cdn.example.com/img1.png', 'https://cdn.example.com/img2.png'],
        'storyTheme': 'adventure',
        'isFavorite': true,
      });
      expect(story.audioUrl, 'https://cdn.example.com/audio.mp3');
      expect(story.audioDurationSeconds, 180);
      expect(story.illustrationTheme, 'fantasy');
      expect(story.illustrationUrls, ['https://cdn.example.com/img1.png', 'https://cdn.example.com/img2.png']);
      expect(story.storyTheme, 'adventure');
      expect(story.isFavorite, true);
    });

    test('illustrationUrls tühi list parsitakse korrektselt', () {
      final story = Story.fromJson({...baseJson, 'illustrationUrls': <String>[]});
      expect(story.illustrationUrls, isEmpty);
    });

    test('isFavorite default false kui puudub', () {
      final json = Map<String, dynamic>.from(baseJson)..remove('isFavorite');
      final story = Story.fromJson(json);
      expect(story.isFavorite, false);
    });
  });
}
