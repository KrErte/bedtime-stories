import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../models/child.dart';
import '../theme.dart';
import '../l10n/app_localizations.dart';

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
  String? _selectedVoice;
  bool _generating = false;
  String? _error;

  final _voices = [
    {'value': 'luna', 'label': 'Luna'},
    {'value': 'atlas', 'label': 'Atlas'},
    {'value': 'willow', 'label': 'Willow'},
    {'value': 'sage', 'label': 'Sage'},
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

  List<Map<String, dynamic>> _themes(AppLocalizations l) => [
    {'value': 'adventure', 'label': l.themeAdventure, 'icon': Icons.terrain},
    {'value': 'friendship', 'label': l.themeFriendship, 'icon': Icons.handshake},
    {'value': 'courage', 'label': l.themeCourage, 'icon': Icons.shield},
    {'value': 'nature', 'label': l.themeNature, 'icon': Icons.park},
    {'value': 'space', 'label': l.themeSpace, 'icon': Icons.rocket_launch},
    {'value': 'ocean', 'label': l.themeOcean, 'icon': Icons.water},
    {'value': 'magic', 'label': l.themeMagic, 'icon': Icons.auto_awesome},
    {'value': 'helping', 'label': l.themeHelping, 'icon': Icons.favorite},
    {'value': 'random', 'label': l.themeRandom, 'icon': Icons.casino},
  ];

  List<Map<String, String>> _voiceList(AppLocalizations l) => [
    {'value': 'luna', 'label': 'Luna', 'desc': l.voiceLunaDesc},
    {'value': 'atlas', 'label': 'Atlas', 'desc': l.voiceAtlasDesc},
    {'value': 'willow', 'label': 'Willow', 'desc': l.voiceWillowDesc},
    {'value': 'sage', 'label': 'Sage', 'desc': l.voiceSageDesc},
  ];

  @override
  Widget build(BuildContext context) {
    final isPro = context.watch<AuthService>().isPro;
    final l = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Text(l.newStory),
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/home')),
      ),
      body: _generating
          ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
              const CircularProgressIndicator(color: AppTheme.storyPurple),
              const SizedBox(height: 24),
              Text(l.writingStory, style: const TextStyle(fontFamily: 'Merriweather', fontSize: 18)),
              Text(l.thisMayTake, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13)),
            ]))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: _error != null
                  ? Column(children: [
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(color: Colors.red.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                        child: Text(_error!, style: const TextStyle(color: Colors.redAccent)),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(onPressed: () => setState(() => _error = null), child: Text(l.tryAgain)),
                    ])
                  : _step == 0 ? _buildChildSelection(l)
                  : _step == 1 ? _buildThemeSelection(l)
                  : _buildVoiceSelection(l, isPro),
            ),
    );
  }

  Widget _buildChildSelection(AppLocalizations l) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(l.whoIsStoryFor, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 16)),
      const SizedBox(height: 16),
      if (_children.isEmpty) Center(child: Column(children: [
        Text(l.addChildFirst, style: TextStyle(color: Colors.white.withOpacity(0.5))),
        const SizedBox(height: 12),
        ElevatedButton(onPressed: () => context.go('/children'), child: Text(l.addChild)),
      ])),
      ..._children.map((c) => GestureDetector(
        onTap: () => setState(() { _selectedChild = c; _step = 1; }),
        child: Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(c.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            Text(l.ageAndLoves(c.age, c.interests?.join(', ') ?? 'stories'),
                style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13)),
          ])),
        ),
      )),
    ]);
  }

  Widget _buildThemeSelection(AppLocalizations l) {
    final themes = _themes(l);
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(l.storyFor(_selectedChild!.name), style: TextStyle(color: Colors.white.withOpacity(0.5))),
      const SizedBox(height: 8),
      Text(l.pickTheme, style: const TextStyle(fontSize: 16)),
      const SizedBox(height: 16),
      GridView.count(
        crossAxisCount: 3,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        mainAxisSpacing: 8,
        crossAxisSpacing: 8,
        children: themes.map((t) => GestureDetector(
          onTap: () => setState(() { _selectedTheme = t['value'] as String; _step = 2; }),
          child: Container(
            decoration: BoxDecoration(
              color: AppTheme.navy800.withOpacity(0.5),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.navy700.withOpacity(0.5)),
            ),
            child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
              Icon(t['icon'] as IconData, color: AppTheme.storyPurple, size: 28),
              const SizedBox(height: 8),
              Text(t['label'] as String, style: const TextStyle(fontSize: 12), textAlign: TextAlign.center),
            ]),
          ),
        )).toList(),
      ),
      TextButton(onPressed: () => setState(() => _step = 0), child: Text(l.back)),
    ]);
  }

  Widget _buildVoiceSelection(AppLocalizations l, bool isPro) {
    if (!isPro) {
      return Column(children: [
        Text(l.audioIsPro, style: const TextStyle(fontSize: 16)),
        const SizedBox(height: 16),
        SizedBox(width: double.infinity, child: ElevatedButton(
          onPressed: () => _generate(null),
          child: Text(l.generateTextOnly),
        )),
        const SizedBox(height: 8),
        TextButton(onPressed: () => context.go('/subscribe'), child: Text(l.upgradeToPro, style: const TextStyle(color: AppTheme.storyPurple))),
        TextButton(onPressed: () => setState(() => _step = 1), child: Text(l.back)),
      ]);
    }

    final voices = _voiceList(l);
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(l.chooseVoice, style: const TextStyle(fontSize: 16)),
      const SizedBox(height: 16),
      ...voices.map((v) => GestureDetector(
        onTap: () => setState(() => _selectedVoice = v['value']),
        child: Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: _selectedVoice == v['value']
                ? AppTheme.storyPurple.withOpacity(0.2)
                : AppTheme.navy800.withOpacity(0.5),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: _selectedVoice == v['value'] ? AppTheme.storyPurple : AppTheme.navy700.withOpacity(0.5),
              width: _selectedVoice == v['value'] ? 2 : 1,
            ),
          ),
          child: Row(children: [
            Icon(Icons.record_voice_over, color: _selectedVoice == v['value'] ? AppTheme.storyPurple : Colors.white54),
            const SizedBox(width: 12),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(v['label']!, style: const TextStyle(fontWeight: FontWeight.w600)),
              Text(v['desc']!, style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.5))),
            ]),
            const Spacer(),
            if (_selectedVoice == v['value']) const Icon(Icons.check_circle, color: AppTheme.storyPurple),
          ]),
        ),
      )),
      const SizedBox(height: 16),
      SizedBox(width: double.infinity, child: ElevatedButton(
        onPressed: _selectedVoice != null ? () => _generate(_selectedVoice) : null,
        child: Text(l.generateStory),
      )),
      const SizedBox(height: 8),
      SizedBox(width: double.infinity, child: OutlinedButton(
        onPressed: () => _generate(null),
        child: Text(l.generateTextOnly),
      )),
      TextButton(onPressed: () => setState(() => _step = 1), child: Text(l.back)),
    ]);
  }
}
