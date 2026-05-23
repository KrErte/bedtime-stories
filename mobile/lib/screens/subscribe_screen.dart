import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../services/purchase_service.dart';
import '../theme.dart';
import '../l10n/app_localizations.dart';

class SubscribeScreen extends StatefulWidget {
  const SubscribeScreen({super.key});
  @override
  State<SubscribeScreen> createState() => _SubscribeScreenState();
}

class _SubscribeScreenState extends State<SubscribeScreen> {
  final _api = ApiService();
  bool _stripeLoading = false;
  bool _purchaseSuccess = false;

  // Mobiilil kasutame Google Play, veebis / muul platvormil Stripe
  bool get _useGooglePlay => !kIsWeb && Platform.isAndroid;

  @override
  void initState() {
    super.initState();
    if (_useGooglePlay) {
      // Kuula AuthService muutusi — kui kasutaja saab pro, näita edu
      WidgetsBinding.instance.addPostFrameCallback((_) {
        context.read<AuthService>().addListener(_onAuthChange);
      });
    }
  }

  void _onAuthChange() {
    final auth = context.read<AuthService>();
    if (auth.isPro && mounted) {
      setState(() => _purchaseSuccess = true);
    }
  }

  @override
  void dispose() {
    if (_useGooglePlay && mounted) {
      try {
        context.read<AuthService>().removeListener(_onAuthChange);
      } catch (_) {}
    }
    super.dispose();
  }

  // Stripe checkout (veeb + iOS tulevikus)
  Future<void> _stripeCheckout() async {
    setState(() => _stripeLoading = true);
    try {
      final tz = DateTime.now().timeZoneName;
      final isEur = tz.contains('EET') || tz.contains('EEST') ||
          tz.contains('CET') || tz.contains('GMT+2') || tz.contains('GMT+3');
      final currency = isEur ? 'eur' : 'usd';
      final res = await _api.post('/subscription/checkout', params: {'currency': currency});
      final url = res['url'] as String;
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), duration: const Duration(seconds: 5)),
        );
      }
    } finally {
      if (mounted) setState(() => _stripeLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l = AppLocalizations.of(context);

    if (_purchaseSuccess) {
      return _SuccessView(onDone: () => context.go('/home'));
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(l.upgradeToPro),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/home'),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(children: [
          Text(l.unlockExperience,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(children: [
                Text(l.pro,
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                if (_useGooglePlay)
                  _GooglePlayPriceWidget()
                else
                  Text(l.perMonth,
                      style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                ...[
                  l.featUnlimited,
                  l.featWords,
                  l.featIllustrations,
                  l.featAudio,
                  l.featPdf,
                  l.sevenDayTrial,
                ].map((f) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(children: [
                    const Icon(Icons.check_circle, color: AppTheme.storyPurple, size: 18),
                    const SizedBox(width: 8),
                    Expanded(child: Text(f, style: const TextStyle(fontSize: 14))),
                  ]),
                )),
                const SizedBox(height: 20),
                if (_useGooglePlay)
                  _GooglePlayBuyButton()
                else
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _stripeLoading ? null : _stripeCheckout,
                      child: Text(_stripeLoading ? l.loading : l.startFreeTrial),
                    ),
                  ),
                const SizedBox(height: 8),
                Text(l.cancelAnytime,
                    style: TextStyle(fontSize: 12, color: Colors.white.withOpacity(0.4))),
                if (_useGooglePlay) ...[
                  const SizedBox(height: 8),
                  TextButton(
                    onPressed: () => context.read<PurchaseService>().restorePurchases(),
                    child: const Text('Taasta ostud', style: TextStyle(fontSize: 12)),
                  ),
                ],
              ]),
            ),
          ),
        ]),
      ),
    );
  }
}

/// Näitab hinda otse Play Store'ist
class _GooglePlayPriceWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<PurchaseService>(builder: (context, ps, _) {
      if (ps.loading) {
        return const CircularProgressIndicator();
      }
      final product = ps.product;
      if (product == null) {
        return const Text('4,99 €/kuu',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold));
      }
      return Text(
        '${product.price}/kuu',
        style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
      );
    });
  }
}

/// Google Play ostu nupp koos error käsitlusega
class _GooglePlayBuyButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<PurchaseService>(builder: (context, ps, _) {
      if (ps.error != null) {
        return Column(children: [
          Text(ps.error!, style: const TextStyle(color: Colors.red, fontSize: 12)),
          const SizedBox(height: 8),
        ]);
      }
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: ps.loading || ps.product == null ? null : () => ps.buy(),
          child: ps.loading
              ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Alusta 7-päevast prooviaega'),
        ),
      );
    });
  }
}

class _SuccessView extends StatelessWidget {
  final VoidCallback onDone;
  const _SuccessView({required this.onDone});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.star, size: 80, color: AppTheme.storyPurple),
              const SizedBox(height: 24),
              const Text('Tere tulemast Pro-sse!',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center),
              const SizedBox(height: 12),
              const Text('Sinu tellimus on aktiivne. Naudi piiramatuid lugusid!',
                  textAlign: TextAlign.center),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: onDone,
                child: const Text('Alusta'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
