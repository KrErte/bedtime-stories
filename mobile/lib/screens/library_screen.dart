import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../services/api_service.dart';
import '../models/story.dart';
import '../theme.dart';

class LibraryScreen extends StatefulWidget {
  const LibraryScreen({super.key});
  @override
  State<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends State<LibraryScreen> {
  final _api = ApiService();
  List<Story> _stories = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final res = await _api.get('/stories', params: {'page': '0', 'size': '20'});
    setState(() {
      _stories = (res['content'] as List).map((e) => Story.fromJson(e)).toList();
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Library'), leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/home'))),
      floatingActionButton: FloatingActionButton(onPressed: () => context.go('/new-story'), backgroundColor: AppTheme.storyPurple, child: const Icon(Icons.add)),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _stories.isEmpty
              ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                  const Icon(Icons.menu_book, size: 64, color: AppTheme.navy400),
                  const SizedBox(height: 16),
                  Text('No stories yet', style: TextStyle(color: Colors.white.withOpacity(0.5))),
                  const SizedBox(height: 16),
                  ElevatedButton(onPressed: () => context.go('/new-story'), child: const Text('Create Story')),
                ]))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _stories.length,
                  itemBuilder: (_, i) {
                    final s = _stories[i];
                    return GestureDetector(
                      onTap: () => context.go('/story/${s.id}'),
                      child: Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Row(children: [
                            Expanded(child: Text(s.title, style: const TextStyle(fontFamily: 'Merriweather', fontSize: 16, fontWeight: FontWeight.w600))),
                            if (s.isFavorite) const Icon(Icons.favorite, color: Colors.red, size: 16),
                          ]),
                          const SizedBox(height: 8),
                          Text(s.content.length > 120 ? '${s.content.substring(0, 120)}...' : s.content, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13), maxLines: 2, overflow: TextOverflow.ellipsis),
                          const SizedBox(height: 8),
                          Row(children: [
                            Text('${s.contentWordCount} words', style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.3))),
                            const SizedBox(width: 12),
                            Text(s.storyTheme ?? '', style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.3))),
                            if (s.audioUrl != null) ...[const SizedBox(width: 12), Icon(Icons.headphones, size: 14, color: Colors.white.withOpacity(0.3))],
                          ]),
                        ])),
                      ),
                    );
                  },
                ),
    );
  }
}
