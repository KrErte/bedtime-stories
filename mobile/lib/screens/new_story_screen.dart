import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../models/child.dart';
import '../theme.dart';

class NewStoryScreen extends StatefulWidget {
  const NewStoryScreen({super.key});
  @override
  State<NewStoryScreen> createState() => _NewStoryScreenState();
}

class _NewStoryScreenState extends State<NewStoryScreen> {
  final _api = ApiService();
  List<Child> _children = [];
  int _step = 0;
  Child? _selectedChild;
  String? _selectedTheme;
  bool _generating = false;
  String? _error;

  final _themes = [
    {'value': 'adventure', 'label': 'Adventure', 'icon': Icons.terrain},
    {'value': 'friendship', 'label': 'Friendship', 'icon': Icons.handshake},
    {'value': 'courage', 'label': 'Courage', 'icon': Icons.shield},
    {'value': 'nature', 'label': 'Nature', 'icon': Icons.park},
    {'value': 'space', 'label': 'Space', 'icon': Icons.rocket_launch},
    {'value': 'ocean', 'label': 'Under the Sea', 'icon': Icons.water},
    {'value': 'magic', 'label': 'Magic', 'icon': Icons.auto_awesome},
    {'value': 'helping', 'label': 'Helping Others', 'icon': Icons.favorite},
    {'value': 'random', 'label': 'Surprise Me!', 'icon': Icons.casino},
  ];

  final _voices = [
    {'value': 'luna', 'label': 'Luna', 'desc': 'Warm, gentle female'},
    {'value': 'atlas', 'label': 'Atlas', 'desc': 'Calm, soothing male'},
    {'value': 'willow', 'label': 'Willow', 'desc': 'Soft, whispery'},
    {'value': 'sage', 'label': 'Sage', 'desc': 'Classic storyteller'},
  ];

  @override
  void initState() {
    super.initState();
    _loadChildren();
  }

  Future<void> _loadChildren() async {
    final res = await _api.get('/children');
    setState(() => _children = (res as List).map((e) => Child.fromJson(e)).toList());
  }

  Future<void> _generate(String? voice) async {
    setState(() { _generating = true; _error = null; });
    try {
      final res = await _api.post('/stories/generate', body: {
        'childId': _selectedChild!.id,
        'theme': _selectedTheme,
        if (voice != null) 'voice': voice,
      });
      if (mounted) context.go('/story/${res['id']}');
    } catch (e) {
      setState(() { _error = e.toString(); _generating = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isPro = context.watch<AuthService>().isPro;
    return Scaffold(
      appBar: AppBar(title: const Text('New Story'), leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/home'))),
      body: _generating
          ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
              const CircularProgressIndicator(color: AppTheme.storyPurple),
              const SizedBox(height: 24),
              const Text('Writing a magical story...', style: TextStyle(fontFamily: 'Merriweather', fontSize: 18)),
              Text('This may take a few seconds', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13)),
            ]))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: _error != null
                  ? Column(children: [
                      Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.red.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                        child: Text(_error!, style: const TextStyle(color: Colors.redAccent))),
                      const SizedBox(height: 16),
                      ElevatedButton(onPressed: () => setState(() => _error = null), child: const Text('Try Again')),
                    ])
                  : _step == 0 ? _buildChildSelection()
                  : _step == 1 ? _buildThemeSelection()
                  : _buildVoiceSelection(isPro),
            ),
    );
  }

  Widget _buildChildSelection() {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('Who is tonight\'s story for?', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 16)),
      const SizedBox(height: 16),
      if (_children.isEmpty) Center(child: Column(children: [
        Text('Add a child first', style: TextStyle(color: Colors.white.withOpacity(0.5))),
        const SizedBox(height: 12),
        ElevatedButton(onPressed: () => context.go('/children'), child: const Text('Add Child')),
      ])),
      ..._children.map((c) => GestureDetector(
        onTap: () => setState(() { _selectedChild = c; _step = 1; }),
        child: Card(margin: const EdgeInsets.only(bottom: 12), child: Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(c.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
          Text('Age ${c.age} · Loves ${c.interests?.join(", ") ?? "stories"}', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13)),
        ]))),
      )),
    ]);
  }

  Widget _buildThemeSelection() {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('Story for ${_selectedChild!.name}', style: TextStyle(color: Colors.white.withOpacity(0.5))),
      const SizedBox(height: 8),
      const Text('Pick a theme', style: TextStyle(fontSize: 16)),
      const SizedBox(height: 16),
      GridView.count(crossAxisCount: 3, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(), mainAxisSpacing: 8, crossAxisSpacing: 8,
        children: _themes.map((t) => GestureDetector(
          onTap: () => setState(() { _selectedTheme = t['value'] as String; _step = 2; }),
          child: Container(
            decoration: BoxDecoration(color: AppTheme.navy800.withOpacity(0.5), borderRadius: BorderRadius.circular(16), border: Border.all(color: AppTheme.navy700.withOpacity(0.5))),
            child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
              Icon(t['icon'] as IconData, color: AppTheme.storyPurple, size: 28),
              const SizedBox(height: 8),
              Text(t['label'] as String, style: const TextStyle(fontSize: 12), textAlign: TextAlign.center),
            ]),
          ),
        )).toList(),
      ),
      TextButton(onPressed: () => setState(() => _step = 0), child: const Text('< Back')),
    ]);
  }

  Widget _buildVoiceSelection(bool isPro) {
    if (!isPro) {
      return Column(children: [
        const Text('Audio is a Pro feature', style: TextStyle(fontSize: 16)),
        const SizedBox(height: 16),
        SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () => _generate(null), child: const Text('Generate (Text Only)'))),
        const SizedBox(height: 8),
        TextButton(onPressed: () => context.go('/subscribe'), child: const Text('Upgrade to Pro', style: TextStyle(color: AppTheme.storyPurple))),
        TextButton(onPressed: () => setState(() => _step = 1), child: const Text('< Back')),
      ]);
    }
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const Text(
