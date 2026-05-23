import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'api_service.dart';

/// Google Play subscription product ID — peab vastama Play Console'is loodule
const String kProMonthlyId = 'pro_monthly';

class PurchaseService extends ChangeNotifier {
  final _iap = InAppPurchase.instance;
  final _api = ApiService();

  bool _available = false;
  bool _loading = false;
  String? _error;
  ProductDetails? _product;
  PurchaseDetails? _lastPurchase;

  StreamSubscription<List<PurchaseDetails>>? _subscription;

  bool get available => _available;
  bool get loading => _loading;
  String? get error => _error;
  ProductDetails? get product => _product;

  PurchaseService() {
    _init();
  }

  Future<void> _init() async {
    _available = await _iap.isAvailable();
    if (!_available) {
      _error = 'Google Play ei ole saadaval';
      notifyListeners();
      return;
    }

    // Kuula ostu uuendusi
    _subscription = _iap.purchaseStream.listen(
      _onPurchaseUpdate,
      onError: (e) {
        _error = e.toString();
        notifyListeners();
      },
    );

    await _loadProduct();
  }

  Future<void> _loadProduct() async {
    _loading = true;
    notifyListeners();

    try {
      final response = await _iap.queryProductDetails({kProMonthlyId});
      if (response.error != null) {
        _error = response.error!.message;
      } else if (response.productDetails.isEmpty) {
        _error = 'Toode ei leitud Play Console\'ist (ID: $kProMonthlyId)';
      } else {
        _product = response.productDetails.first;
        _error = null;
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  /// Käivita ostuprotsess
  Future<void> buy() async {
    if (_product == null) {
      _error = 'Toode pole laaditud';
      notifyListeners();
      return;
    }
    _error = null;
    final param = PurchaseParam(productDetails: _product!);
    await _iap.buyNonConsumable(purchaseParam: param);
  }

  void _onPurchaseUpdate(List<PurchaseDetails> purchases) async {
    for (final purchase in purchases) {
      switch (purchase.status) {
        case PurchaseStatus.pending:
          _loading = true;
          notifyListeners();
          break;

        case PurchaseStatus.purchased:
          _loading = true;
          notifyListeners();
          await _verifyWithBackend(purchase);
          if (purchase.pendingCompletePurchase) {
            await _iap.completePurchase(purchase);
          }
          _loading = false;
          notifyListeners();
          break;

        case PurchaseStatus.restored:
          _loading = true;
          notifyListeners();
          await _verifyWithBackend(purchase);
          if (purchase.pendingCompletePurchase) {
            await _iap.completePurchase(purchase);
          }
          _loading = false;
          notifyListeners();
          break;

        case PurchaseStatus.error:
          _loading = false;
          _error = purchase.error?.message ?? 'Ost ebaõnnestus';
          notifyListeners();
          break;

        case PurchaseStatus.canceled:
          _loading = false;
          notifyListeners();
          break;
      }
    }
  }

  /// Saadab purchase token backendile verificeerimiseks
  Future<bool> _verifyWithBackend(PurchaseDetails purchase) async {
    try {
      // Android-spetsiifiline: võta purchaseToken
      final token = purchase.verificationData.serverVerificationData;
      final productId = purchase.productID;

      await _api.post('/subscription/google-play/verify', body: {
        'productId': productId,
        'purchaseToken': token,
      });

      _lastPurchase = purchase;
      _error = null;
      return true;
    } on ApiException catch (e) {
      _error = 'Verificeerimine ebaõnnestus: ${e.message}';
      return false;
    } catch (e) {
      _error = 'Verificeerimine ebaõnnestus: $e';
      return false;
    }
  }

  /// Taasta ostud (kasutaja vahetas telefoni vms)
  Future<void> restorePurchases() async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      await _iap.restorePurchases();
    } catch (e) {
      _error = e.toString();
      _loading = false;
      notifyListeners();
    }
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }
}
