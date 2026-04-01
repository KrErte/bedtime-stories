import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/auth_service.dart';
import 'services/api_service.dart';
import 'theme.dart';
import 'router.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
        Provider(create: (_) => ApiService()),
      ],
      child: const StoryForMeApp(),
    ),
  );
}

class StoryForMeApp extends StatelessWidget {
  const StoryForMeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'StoryFor.me',
      theme: AppTheme.darkTheme,
      routerConfig: appRouter(context),
      debugShowCheckedModeBanner: false,
    );
  }
}
