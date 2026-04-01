import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../services/api_service.dart';
import '../models/story.dart';
import '../theme.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});
  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final _api = ApiService();
  List<Story> _stories = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final res = await _api.get('/stories/favorites', params: {'page': '0', 'size': '20'});
    setState(() {
      _stories = (res['content'] as List).map((e) => Story.fromJson(e)).toList();
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Favorites'), leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/home'))),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _stories.isEmpty
              ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                  const Icon(Icons.favorite_border, size: 64, color: AppTheme.navy400),
                  const SizedBox(height: 16),
                  Text('No favorites yet', style: TextStyle(color: Colors.white.withOpacity(0.5))),
                ]))
              : ListView.builder(
                  padding: const EdgeInsets.all(16), itemCount: _stories.length,
                  itemBuilder: (_, i) {
                    final s = _stories[i];
                    return GestureDetector(
                      onTap: () => context.go('/story/${s.id}'),
                      child: Card(margin: const EdgeInsets.only(bottom: 12), child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(s.title, style: const TextStyle(fontFamily: 'Merriweather', fontSize: 16, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 8),
                          Text(s.content.length > 120 ? '${s.content.substring(0, 120)}...' : s.content, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13), maxLines: 2),
                        ]),
                      )),
                    );
                  },
                ),
    );
  }
}
