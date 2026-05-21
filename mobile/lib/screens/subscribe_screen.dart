import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_service.dart';
import '../theme.dart';

class SubscribeScreen extends StatefulWidget {
  const SubscribeScreen({super.key});
  @override
  State<SubscribeScreen> createState() => _SubscribeScreenState();
}

class _SubscribeScreenState extends State<SubscribeScreen> {
  final _api = ApiService();
  bool _loading = false;

  Future<void> _checkout() async {
    setState(() => _loading = true);
    try {
      final res = await _api.post('/subscription/checkout');
      final url = res['url'] as String;
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Upgrade to Pro'), leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/home'))),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(children: [
          const Text('Unlock the full experience', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          Card(child: Padding(padding: const EdgeInsets.all(20), child: Column(children: [
            const Text('Pro', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('\$7.99/month', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            ...[
              'Unlimited stories (20/day)',
              '500-600 words per story',
              '3-4 illustrations',
              'Audio narration (4 voices)',
              'PDF export',
              '7-day free trial',
            ].map((f) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(children: [
                const Icon(Icons.check_circle, color: AppTheme.storyPurple, size: 18),
                const SizedBox(width: 8),
                Text(f, style: const TextStyle(fontSize: 14)),
              ]),
            )),
            const SizedBox(height: 20),
            SizedBox(width: double.infinity, child: ElevatedButton(onPressed: _loading ? null : _checkout, child: Text(_loading ? 'Redirecting...' : 'Start Free Trial'))),
          ]))),
        ]),
      ),
    );
  }
}
