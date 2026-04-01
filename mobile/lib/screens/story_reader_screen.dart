import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:just_audio/just_audio.dart';
import '../services/api_service.dart';
import '../models/story.dart';
import '../theme.dart';

class StoryReaderScreen extends StatefulWidget {
  final String storyId;
  const StoryReaderScreen({super.key, required this.storyId});
  @override
  State<StoryReaderScreen> createState() => _StoryReaderScreenState();
}

class _StoryReaderScreenState extends State<StoryReaderScreen> {
  final _api = ApiService();
  final _player = AudioPlayer();
  Story? _story;
  bool _loading = true;
  bool _playing = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final res = await _api.get('/stories/${widget.storyId}');
    final story = Story.fromJson(res);
    setState(() { _story = story; _loading = false; });
    if (story.audioUrl != null) {
      await _player.setUrl('${ApiService.baseUrl}${story.audioUrl}');
    }
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }

  void _togglePlay() async {
    if (_playing) {
      await _player.pause();
    } else {
      await _player.play();
    }
    setState(() => _playing = !_playing);
  }

  Future<void> _toggleFavorite() async {
    final res = await _api.put('/stories/${widget.storyId}/favorite');
    setState(() => _story = Story.fromJson(res));
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Scaffold(body: Center(child: CircularProgressIndicator()));
    final story = _story!;
    final paragraphs = story.content.split(RegExp(r'\n\n+')).where((p) => p.trim().isNotEmpty).toList();

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [AppTheme.navy900, AppTheme.navy950]),
        ),
        child: SafeArea(
          child: Column(children: [
            Padding(padding: const EdgeInsets.all(16), child: Row(children: [
              IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/library')),
              const Spacer(),
              IconButton(icon: Icon(story.isFavorite ? Icons.favorite : Icons.favorite_border, color: story.isFavorite ? Colors.red : null), onPressed: _toggleFavorite),
            ])),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Center(child: Text(story.title, style: const TextStyle(fontFamily: 'Merriweather', fontSize: 24, fontWeight: FontWeight.bold), textAlign: TextAlign.center)),
                  const SizedBox(height: 8),
                  Center(child: Text(story.storyTheme ?? '', style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 13))),
                  const SizedBox(height: 32),
                  ...paragraphs.map((p) => Padding(
                    padding: const EdgeInsets.only(bottom: 20),
                    child: Text(p.trim(), style: const TextStyle(fontFamily: 'Merriweather', fontSize: 17, height: 1.9, color: Color(0xFFe0e3ff))),
                  )),
                  const SizedBox(height: 40),
                ]),
              ),
            ),
            if (story.audioUrl != null)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: AppTheme.navy800.withOpacity(0.8), border: Border(top: BorderSide(color: AppTheme.navy700.withOpacity(0.5)))),
                child: Row(children: [
                  GestureDetector(
                    onTap: _togglePlay,
                    child: Container(
                      width: 48, height: 48,
                      decoration: const BoxDecoration(color: AppTheme.storyPurple, shape: BoxShape.circle),
                      child: Icon(_playing ? Icons.pause : Icons.play_arrow, color: Colors.white),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: StreamBuilder<Duration>(
                      stream: _player.positionStream,
                      builder: (_, snap) {
                        final pos = snap.data ?? Duration.zero;
                        final dur = _player.duration ?? Duration.zero;
                        return Column(children: [
                          LinearProgressIndicator(value: dur.inMilliseconds > 0 ? pos.inMilliseconds / dur.inMilliseconds : 0, color: AppTheme.storyPurple, backgroundColor: AppTheme.navy600),
                          const SizedBox(height: 4),
                          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                            Text(_fmt(pos), style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.5))),
                            Text(_fmt(dur), style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.5))),
                          ]),
                        ]);
                      },
                    ),
                  ),
                ]),
              ),
          ]),
        ),
      ),
    );
  }

  String _fmt(Duration d) => '${d.inMinutes}:${(d.inSeconds % 60).toString().padLeft(2, '0')}';
}
