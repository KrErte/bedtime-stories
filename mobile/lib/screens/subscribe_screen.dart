import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_service.dart';
import '../theme.dart';
import '../l10n/app_localizations.dart';

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
      final tz = DateTime.now().timeZoneName;
      final currency = tz.contains('EET') || tz.contains('EEST') || tz.contains('CET') || tz.contains('GMT+2') || tz.contains('GMT+3') ? 'eur' : 'usd';
      final res = await _api.post('/subscription/checkout', params: {'currency': currency});
      final url = res['url'] as String;
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), duration: const Duration(seconds: 5)),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(title: Text(l.upgradeToPro), leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/home'))),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(children: [
          Text(l.unlockExperience, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          Card(child: Padding(padding: const EdgeInsets.all(20), child: Column(children: [
            Text(l.pro, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(l.perMonth, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            ...[
              l.featUnlimited,
              l.featWords,
              l.featIllustrations,
              l.featAudio,
              l.featPdf,
              l.sevenDayTrial,
            ].map((f) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(children: [
                const Icon(Icons.check_circle, color: AppTheme.storyPurple, size: 18),
                const SizedBox(width: 8),
                Expanded(child: Text(f, style: const TextStyle(fontSize: 14))),
              ]),
            )),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _loading ? null : _checkout,
                child: Text(_loading ? l.loading : l.startFreeTrial),
              ),
            ),
            const SizedBox(height: 8),
            Text(l.cancelAnytime, style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.4))),
          ]))),
        ]),
      ),
    );
  }
}
