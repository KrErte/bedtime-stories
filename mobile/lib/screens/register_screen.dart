import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../services/locale_service.dart';
import '../theme.dart';
import '../l10n/app_localizations.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _loading = false;
  String? _error;

  Future<void> _register() async {
    setState(() { _loading = true; _error = null; });
    try {
      await context.read<AuthService>().register(_email.text, _password.text, _name.text);
      if (mounted) context.go('/children');
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _showLanguagePicker(BuildContext context, LocaleService localeService) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.navy700,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 12),
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 16),
            ListTile(
              title: const Text('Auto'),
              subtitle: Text('Device language', style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 12)),
              trailing: localeService.locale == null ? const Icon(Icons.check, color: AppTheme.storyPurple) : null,
              onTap: () { localeService.resetToDeviceLocale(); Navigator.of(context).pop(); },
            ),
            const Divider(height: 1, color: Colors.white12),
            ...LocaleService.languageNames.entries.map((entry) => ListTile(
              title: Text(entry.value),
              trailing: localeService.locale?.languageCode == entry.key ? const Icon(Icons.check, color: AppTheme.storyPurple) : null,
              onTap: () { localeService.setLocale(Locale(entry.key)); Navigator.of(context).pop(); },
            )),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    final localeService = context.watch<LocaleService>();
    final currentLangName = localeService.locale == null
        ? 'Auto'
        : LocaleService.languageNames[localeService.locale!.languageCode] ?? localeService.locale!.languageCode;

    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ShaderMask(
                  shaderCallback: (bounds) => const LinearGradient(colors: [AppTheme.storyPurple, AppTheme.storyPink]).createShader(bounds),
                  child: Text(l.appName, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
                const SizedBox(height: 8),
                Text(l.createYourAccount, style: TextStyle(color: Colors.white.withOpacity(0.5))),
                const SizedBox(height: 24),
                // Keelevalija
                InkWell(
                  onTap: () => _showLanguagePicker(context, localeService),
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      border: Border.all(color: AppTheme.storyPurple.withOpacity(0.4)),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                      Row(children: [
                        Icon(Icons.language, color: AppTheme.storyPurple, size: 18),
                        const SizedBox(width: 10),
                        Text(l.appLanguage, style: const TextStyle(fontSize: 14)),
                      ]),
                      Row(children: [
                        Text(currentLangName, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 14)),
                        const SizedBox(width: 4),
                        Icon(Icons.chevron_right, color: Colors.white.withOpacity(0.3), size: 18),
                      ]),
                    ]),
                  ),
                ),
                const SizedBox(height: 20),
                if (_error != null) Container(
                  width: double.infinity, padding: const EdgeInsets.all(12), margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(color: Colors.red.withOpacity(0.1), borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.red.withOpacity(0.3))),
                  child: Text(_error!, style: const TextStyle(color: Colors.redAccent, fontSize: 13)),
                ),
                TextField(controller: _name, decoration: InputDecoration(hintText: l.yourName)),
                const SizedBox(height: 12),
                TextField(controller: _email, decoration: InputDecoration(hintText: l.email), keyboardType: TextInputType.emailAddress),
                const SizedBox(height: 12),
                TextField(controller: _password, decoration: InputDecoration(hintText: l.passwordHint), obscureText: true),
                const SizedBox(height: 20),
                SizedBox(width: double.infinity, child: ElevatedButton(onPressed: _loading ? null : _register, child: Text(_loading ? l.creatingAccount : l.createAccount))),
                const SizedBox(height: 16),
                TextButton(onPressed: () => context.go('/login'), child: Text(l.alreadyHaveAccount, style: const TextStyle(color: AppTheme.storyPurple))),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
