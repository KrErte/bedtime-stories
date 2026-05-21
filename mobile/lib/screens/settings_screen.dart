import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../theme.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    return Scaffold(
      appBar: AppBar(title: const Text('Settings'), leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/home'))),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(children: [
          Card(child: Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Account', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
            const SizedBox(height: 12),
            _row('Email', auth.user?['email'] ?? ''),
            _row('Name', auth.user?['name'] ?? ''),
            _row('Stories', '${auth.user?['storiesGeneratedTotal'] ?? 0}'),
          ]))),
          const SizedBox(height: 12),
          Card(child: Padding(padding: const EdgeInsets.all(16), child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('Subscription', style: TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: auth.isPro ? AppTheme.storyPurple.withOpacity(0.2) : AppTheme.navy700, borderRadius: BorderRadius.circular(20)),
                child: Text(auth.isPro ? 'Pro' : 'Free', style: TextStyle(fontSize: 12, color: auth.isPro ? AppTheme.storyPurple : AppTheme.navy300)),
              ),
            ]),
            if (!auth.isPro) TextButton(onPressed: () => context.go('/subscribe'), child: const Text('Upgrade', style: TextStyle(color: AppTheme.storyPurple))),
          ]))),
          const SizedBox(height: 24),
          SizedBox(width: double.infinity, child: TextButton(
            onPressed: () { auth.logout(); context.go('/'); },
            child: const Text('Sign Out', style: TextStyle(color: Colors.redAccent)),
          )),
        ]),
      ),
    );
  }

  Widget _row(String label, String value) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 4),
    child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Text(label, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13)),
      Text(value, style: const TextStyle(fontSize: 13)),
    ]),
  );
}
