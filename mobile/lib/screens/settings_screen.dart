import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../services/locale_service.dart';
import '../theme.dart';
import '../l10n/app_localizations.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    final localeService = context.watch<LocaleService>();
    final l = AppLocalizations.of(context);
    final currentLangName = localeService.locale == null
        ? 'Auto'
        : LocaleService.languageNames[localeService.locale!.languageCode] ?? localeService.locale!.languageCode;

    return Scaffold(
      appBar: AppBar(
        title: Text(l.settings),
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.go('/home')),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(children: [
          // Konto kaart
          Card(child: Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(l.account, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
            const SizedBox(height: 12),
            _row(l.email, auth.user?['email'] ?? ''),
            _row(l.name, auth.user?['name'] ?? ''),
            _row(l.stories, '${auth.user?['storiesGeneratedTotal'] ?? 0}'),
          ]))),
          const SizedBox(height: 12),

          // Tellimuse kaart
          Card(child: Padding(padding: const EdgeInsets.all(16), child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(l.subscription, style: const TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: auth.isPro ? AppTheme.storyPurple.withOpacity(0.2) : AppTheme.navy700,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  auth.isPro ? l.pro : l.free,
                  style: TextStyle(fontSize: 12, color: auth.isPro ? AppTheme.storyPurple : AppTheme.navy300),
                ),
              ),
            ]),
            if (!auth.isPro)
              TextButton(
                onPressed: () => context.go('/subscribe'),
                child: Text(l.upgrade, style: const TextStyle(color: AppTheme.storyPurple)),
              ),
          ]))),
          const SizedBox(height: 12),

          // Keelevaliku kaart
          Card(
            child: InkWell(
              borderRadius: BorderRadius.circular(12),
              onTap: () => _showLanguagePicker(context, localeService),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Text(l.appLanguage, style: const TextStyle(fontWeight: FontWeight.w600)),
                  Row(children: [
                    Text(currentLangName, style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 14)),
                    const SizedBox(width: 6),
                    Icon(Icons.chevron_right, color: Colors.white.withOpacity(0.4), size: 20),
                  ]),
                ]),
              ),
            ),
          ),

          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: TextButton(
              onPressed: () { auth.logout(); context.go('/'); },
              child: Text(l.signOut, style: const TextStyle(color: Colors.redAccent)),
            ),
          ),
        ]),
      ),
    );
  }

  void _showLanguagePicker(BuildContext context, LocaleService localeService) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.navy700,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 12),
              Container(
                width: 40, height: 4,
                decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
              ),
              const SizedBox(height: 16),
              // Auto valik
              ListTile(
                title: const Text('Auto'),
                subtitle: Text('Device language', style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 12)),
                trailing: localeService.locale == null
                    ? const Icon(Icons.check, color: AppTheme.storyPurple)
                    : null,
                onTap: () {
                  localeService.resetToDeviceLocale();
                  Navigator.of(context).pop();
                },
              ),
              const Divider(height: 1, color: Colors.white12),
              ...LocaleService.languageNames.entries.map((entry) {
                final isSelected = localeService.locale?.languageCode == entry.key;
                return ListTile(
                  title: Text(entry.value),
                  trailing: isSelected
                      ? const Icon(Icons.check, color: AppTheme.storyPurple)
                      : null,
                  onTap: () {
                    localeService.setLocale(Locale(entry.key));
                    Navigator.of(context).pop();
                  },
                );
              }),
              const SizedBox(height: 8),
            ],
          ),
        );
      },
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
