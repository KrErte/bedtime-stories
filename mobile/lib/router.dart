import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'services/auth_service.dart';
import 'screens/landing_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/home_screen.dart';
import 'screens/children_screen.dart';
import 'screens/new_story_screen.dart';
import 'screens/story_reader_screen.dart';
import 'screens/library_screen.dart';
import 'screens/favorites_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/subscribe_screen.dart';

GoRouter appRouter(BuildContext context) {
  final auth = context.read<AuthService>();
  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final loggedIn = auth.isLoggedIn;
      final onAuth = state.matchedLocation == '/login' || state.matchedLocation == '/register';
      final onLanding = state.matchedLocation == '/';
      if (!loggedIn && !onAuth && !onLanding) return '/login';
      if (loggedIn && onAuth) return '/home';
      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (_, __) => const LandingScreen()),
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),
      GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
      GoRoute(path: '/children', builder: (_, __) => const ChildrenScreen()),
      GoRoute(path: '/new-story', builder: (_, __) => const NewStoryScreen()),
      GoRoute(path: '/story/:id', builder: (_, state) => StoryReaderScreen(storyId: state.pathParameters['id']!)),
      GoRoute(path: '/library', builder: (_, __) => const LibraryScreen()),
      GoRoute(path: '/favorites', builder: (_, __) => const FavoritesScreen()),
      GoRoute(path: '/settings', builder: (_, __) => const SettingsScreen()),
      GoRoute(path: '/subscribe', builder: (_, __) => const SubscribeScreen()),
    ],
  );
}
