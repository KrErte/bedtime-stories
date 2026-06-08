import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'services/auth_service.dart';
import 'services/api_service.dart';
import 'services/purchase_service.dart';
import 'services/locale_service.dart';
import 'theme.dart';
import 'router.dart';
import 'l10n/app_localizations.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
        Provider(create: (_) => ApiService()),
        ChangeNotifierProvider(create: (_) => PurchaseService()),
        ChangeNotifierProvider(create: (_) => LocaleService()),
      ],
      child: const DreamlitApp(),
    ),
  );
}

class DreamlitApp extends StatelessWidget {
  const DreamlitApp({super.key});

  @override
  Widget build(BuildContext context) {
    final locale = context.watch<LocaleService>().locale;
    return MaterialApp.router(
      title: 'Dreamlit',
      theme: AppTheme.darkTheme,
      routerConfig: appRouter(context),
      debugShowCheckedModeBanner: false,
      locale: locale,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: AppLocalizations.supportedLocales,
    );
  }
}
