import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme.dart';
import '../l10n/app_localizations.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 60),
              ShaderMask(
                shaderCallback: (bounds) => const LinearGradient(
                  colors: [AppTheme.storyPurple, AppTheme.storyPink],
                ).createShader(bounds),
                child: const Text('Dreamlit', style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.white)),
              ),
              const SizedBox(height: 24),
              Text(
                l.tagline,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 28, fontFamily: 'Merriweather', fontWeight: FontWeight.bold, height: 1.3),
              ),
              const SizedBox(height: 16),
              Text(
                l.taglineSubtitle,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.6)),
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => context.go('/register'),
                  child: Text(l.getStartedFree),
                ),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () => context.go('/login'),
                child: Text(l.alreadyHaveAccount, style: const TextStyle(color: AppTheme.navy300)),
              ),
              const SizedBox(height: 60),
              _buildStep('1', l.step1Title, l.step1Desc),
              const SizedBox(height: 16),
              _buildStep('2', l.pickTheme, l.step2Desc),
              const SizedBox(height: 16),
              _buildStep('3', l.step3Title, l.step3Desc),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStep(String num, String title, String desc) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.navy800.withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.navy700.withOpacity(0.5)),
      ),
      child: Row(
        children: [
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(color: AppTheme.storyPurple.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
            child: Center(child: Text(num, style: const TextStyle(color: AppTheme.storyPurple, fontWeight: FontWeight.bold))),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
              Text(desc, style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13)),
            ],
          ),
        ],
      ),
    );
  }
}
