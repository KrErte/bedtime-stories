import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../services/api_service.dart';
import '../models/child.dart';
import '../theme.dart';

class ChildrenScreen extends StatefulWidget {
  const ChildrenScreen({super.key});
  @override
  State<ChildrenScreen> createState() => _ChildrenScreenState();
}

class _ChildrenScreenState extends State<ChildrenScreen> {
  final _api = ApiService();
  List<Child> _children = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final res = await _api.get('/children');
    setState(() {
      _children = (res as List).map((e) => Child.fromJson(e)).toList();
      _loading = false;
    });
  }

  Future<void> _addChild() async {
    final name = TextEditingController();
    final age = TextEditingController();
    final interests = TextEditingController();
    final animal = TextEditingController();
    String gender = '';

    final result = await showModalBottomSheet<bool>(
      context: context, isScrollControlled: true,
      backgroundColor: AppTheme.navy900,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: EdgeInsets.fromLTRB(20, 20, 20, MediaQuery.of(ctx).viewInsets.bottom + 20),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          const Text('Add Child', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          TextField(controller: name, decoration: const InputDecoration(hintText: "Child's name")),
          const SizedBox(height: 8),
          TextField(controller: age, decoration: const InputDecoration(hintText: 'Age (1-12)'), keyboardType: TextInputType.number),
          const SizedBox(height: 8),
          TextField(controller: interests, decoration: const InputDecoration(hintText: 'Interests (comma separated)')),
          const SizedBox(height: 8),
          TextField(controller: animal, decoration: const InputDecoration(hintText: 'Favorite animal')),
          const SizedBox(height: 16),
          SizedBox(width: double.infinity, child: ElevatedButton(
            onPressed: () async {
              await _api.post('/children', body: {
                'name': name.text,
                'age': int.tryParse(age.text) ?? 5,
                'gender': gender.isEmpty ? null : gender,
                'interests': interests.text.split(',').map((e) => e.trim()).where((e) => e.isNotEmpty).toList(),
                'favoriteAnimal': animal.text.isEmpty ? null : animal.text,
              });
              if (ctx.mounted) Navigator.pop(ctx, true);
            },
            child: const Text('Save'),
          )),
        ]),
      ),
    );
    if (result == true) _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Children'), leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/home'))),
      floatingActionButton: FloatingActionButton(onPressed: _addChild, backgroundColor: AppTheme.storyPurple, child: const Icon(Icons.add)),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _children.isEmpty
              ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                  const Icon(Icons.child_care, size: 64, color: AppTheme.navy400),
                  const SizedBox(height: 16),
                  Text('No children yet', style: TextStyle(color: Colors.white.withOpacity(0.5))),
                  const SizedBox(height: 16),
                  ElevatedButton(onPressed: _addChild, child: const Text('Add Your First Child')),
                ]))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _children.length,
                  itemBuilder: (_, i) {
                    final c = _children[i];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(c.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 4),
                          Text('Age ${c.age}${c.gender != null ? " · ${c.gender}" : ""}', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13)),
                          if (c.interests != null && c.interests!.isNotEmpty)
                            Padding(padding: const EdgeInsets.only(top: 8),
                              child: Wrap(spacing: 6, children: c.interests!.map((i) => Chip(
                                label: Text(i, style: const TextStyle(fontSize: 11)),
                                backgroundColor: AppTheme.navy700, padding: EdgeInsets.zero, materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              )).toList()),
                            ),
                        ]),
                      ),
                    );
                  },
                ),
    );
  }
}
