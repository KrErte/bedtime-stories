import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
                child: const Text('StoryFor.me', style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.white)),
              ),
              const SizedBox(height: 24),
              const Text(
                'Every child deserves to be the hero of their own story',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 28, fontFamily: 'Merriweather', fontWeight: FontWeight.bold, height: 1.3),
              ),
              const SizedBox(height: 16),
              Text(
                'AI-powered personalized bedtime stories with audio narration',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.6)),
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => context.go('/register'),
                  child: const Text('Get Started Free'),
                ),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () => context.go('/login'),
                child: const Text('Already have an account? Sign in', style: TextStyle(color: AppTheme.navy300)),
              ),
              const SizedBox(height: 60),
              _buildStep('1', 'Add your child', 'Name, age, interests'),
              const SizedBox(height: 16),
              _buildStep('2', 'Pick a theme', 'Adventure, space, ocean...'),
              const SizedBox(height: 16),
              _buildStep('3', 'Listen & dream', 'Unique story with audio'),
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
