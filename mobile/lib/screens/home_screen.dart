import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../theme.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Good evening,', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 14)),
                    Text(auth.user?['name'] ?? 'Friend', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                  ]),
                  GestureDetector(
                    onTap: () => context.go('/settings'),
                    child: CircleAvatar(backgroundColor: AppTheme.storyPurple, child: Text((auth.user?['name'] ?? 'U')[0], style: const TextStyle(fontWeight: FontWeight.bold))),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              _navCard(context, 'New Story', 'Create a magical bedtime story', Icons.auto_awesome, '/new-story'),
              const SizedBox(height: 12),
              _navCard(context, 'Library', 'Browse your story collection', Icons.menu_book, '/library'),
              const SizedBox(height: 12),
              _navCard(context, 'Favorites', 'Your favorite stories', Icons.favorite, '/favorites'),
              const SizedBox(height: 12),
              _navCard(context, 'Children', 'Manage child profiles', Icons.child_care, '/children'),
              if (!auth.isPro) ...[
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(onPressed: () => context.go('/subscribe'), child: const Text('Upgrade to Pro')),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _navCard(BuildContext context, String title, String subtitle, IconData icon, String route) {
    return GestureDetector(
      onTap: () => context.go(route),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.navy800.withOpacity(0.5),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.navy700.withOpacity(0.5)),
        ),
        child: Row(children: [
          Container(
            width: 44, height: 44,
            decoration: BoxDecoration(color: AppTheme.storyPurple.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
            child: Icon(icon, color: AppTheme.storyPurple),
          ),
          const SizedBox(width: 16),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
            Text(subtitle, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13)),
          ]),
          const Spacer(),
          Icon(Icons.chevron_right, color: Colors.white.withOpacity(0.3)),
        ]),
      ),
    );
  }
}
