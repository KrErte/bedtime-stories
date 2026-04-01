import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../theme.dart';

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ShaderMask(
                  shaderCallback: (bounds) => const LinearGradient(colors: [AppTheme.storyPurple, AppTheme.storyPink]).createShader(bounds),
                  child: const Text('StoryFor.me', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
                const SizedBox(height: 8),
                Text('Create your account', style: TextStyle(color: Colors.white.withOpacity(0.5))),
                const SizedBox(height: 32),
                if (_error != null) Container(
                  width: double.infinity, padding: const EdgeInsets.all(12), margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(color: Colors.red.withOpacity(0.1), borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.red.withOpacity(0.3))),
                  child: Text(_error!, style: const TextStyle(color: Colors.redAccent, fontSize: 13)),
                ),
                TextField(controller: _name, decoration: const InputDecoration(hintText: 'Your name')),
                const SizedBox(height: 12),
                TextField(controller: _email, decoration: const InputDecoration(hintText: 'Email'), keyboardType: TextInputType.emailAddress),
                const SizedBox(height: 12),
                TextField(controller: _password, decoration: const InputDecoration(hintText: 'Password (min 6 chars)'), obscureText: true),
                const SizedBox(height: 20),
                SizedBox(width: double.infinity, child: ElevatedButton(onPressed: _loading ? null : _register, child: Text(_loading ? 'Creating...' : 'Create Account'))),
                const SizedBox(height: 16),
                TextButton(onPressed: () => context.go('/login'), child: const Text('Already have an account? Sign in', style: TextStyle(color: AppTheme.storyPurple))),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
