class Story {
  final String id;
  final String childId;
  final String title;
  final String content;
  final int contentWordCount;
  final String? audioUrl;
  final int? audioDurationSeconds;
  final String? illustrationTheme;
  final List<String>? illustrationUrls;
  final String? storyTheme;
  final bool isFavorite;
  final String createdAt;

  Story({
    required this.id, required this.childId, required this.title,
    required this.content, required this.contentWordCount, this.audioUrl,
    this.audioDurationSeconds, this.illustrationTheme, this.illustrationUrls,
    this.storyTheme, this.isFavorite = false, required this.createdAt,
  });

  factory Story.fromJson(Map<String, dynamic> json) => Story(
    id: json['id'],
    childId: json['childId'],
    title: json['title'],
    content: json['content'],
    contentWordCount: json['contentWordCount'],
    audioUrl: json['audioUrl'],
    audioDurationSeconds: json['audioDurationSeconds'],
    illustrationTheme: json['illustrationTheme'],
    illustrationUrls: json['illustrationUrls'] != null ? List<String>.from(json['illustrationUrls']) : null,
    storyTheme: json['storyTheme'],
    isFavorite: json['isFavorite'] ?? false,
    createdAt: json['createdAt'],
  );
}
