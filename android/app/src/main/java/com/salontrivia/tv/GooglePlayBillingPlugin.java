package com.salontrivia.tv;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CapacitorPlugin(name = "GooglePlayBilling")
public class GooglePlayBillingPlugin extends Plugin implements PurchasesUpdatedListener {

    private static final String TAG = "GooglePlayBilling";
    private static final String PREFS_NAME = "bil_bakalim_billing_prefs";
    private static final String KEY_IS_PRO = "is_pro_active";
    private static final String KEY_PRO_TIER = "pro_tier_id";
    private static final String KEY_PURCHASE_TIME = "pro_purchase_time";

    private BillingClient billingClient;
    private boolean isClientReady = false;
    private final Map<String, ProductDetails> cachedProductDetails = new HashMap<>();
    private PluginCall activePurchaseCall = null;

    @Override
    public void load() {
        super.load();
        initBillingClient();
    }

    private void initBillingClient() {
        try {
            billingClient = BillingClient.newBuilder(getContext())
                    .setListener(this)
                    .enablePendingPurchases()
                    .build();

            startConnection(null);
        } catch (Exception e) {
            Log.e(TAG, "Error initializing BillingClient: " + e.getMessage(), e);
        }
    }

    private void startConnection(final Runnable onConnected) {
        if (billingClient == null) return;
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    isClientReady = true;
                    Log.i(TAG, "Google Play BillingClient bağlı ve hazır!");
                    queryExistingPurchasesInternal();
                    if (onConnected != null) {
                        onConnected.run();
                    }
                } else {
                    isClientReady = false;
                    Log.w(TAG, "Billing setup failed with code: " + billingResult.getResponseCode());
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                isClientReady = false;
                Log.w(TAG, "Billing service disconnected, will retry when needed.");
            }
        });
    }

    @PluginMethod
    public void isAvailable(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("available", isClientReady && billingClient != null);
        ret.put("isReady", isClientReady);
        call.resolve(ret);
    }

    @PluginMethod
    public void queryProducts(PluginCall call) {
        JSArray inAppIdsArray = call.getArray("inAppProducts");
        JSArray subsIdsArray = call.getArray("subscriptions");

        final List<QueryProductDetailsParams.Product> productList = new ArrayList<>();

        if (inAppIdsArray != null) {
            try {
                List<String> inAppList = inAppIdsArray.toList();
                for (String id : inAppList) {
                    productList.add(QueryProductDetailsParams.Product.newBuilder()
                            .setProductId(id)
                            .setProductType(BillingClient.ProductType.INAPP)
                            .build());
                }
            } catch (Exception ignored) {}
        }

        if (subsIdsArray != null) {
            try {
                List<String> subsList = subsIdsArray.toList();
                for (String id : subsList) {
                    productList.add(QueryProductDetailsParams.Product.newBuilder()
                            .setProductId(id)
                            .setProductType(BillingClient.ProductType.SUBS)
                            .build());
                }
            } catch (Exception ignored) {}
        }

        // Varsayılan ürünlerimiz
        if (productList.isEmpty()) {
            productList.add(QueryProductDetailsParams.Product.newBuilder()
                    .setProductId("pro_party")
                    .setProductType(BillingClient.ProductType.INAPP)
                    .build());
            productList.add(QueryProductDetailsParams.Product.newBuilder()
                    .setProductId("pro_lifetime")
                    .setProductType(BillingClient.ProductType.INAPP)
                    .build());
            productList.add(QueryProductDetailsParams.Product.newBuilder()
                    .setProductId("pro_monthly")
                    .setProductType(BillingClient.ProductType.SUBS)
                    .build());
        }

        Runnable task = () -> {
            QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                    .setProductList(productList)
                    .build();

            billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    JSArray detailsArray = new JSArray();
                    for (ProductDetails pd : productDetailsList) {
                        cachedProductDetails.put(pd.getProductId(), pd);

                        JSObject item = new JSObject();
                        item.put("productId", pd.getProductId());
                        item.put("title", pd.getTitle());
                        item.put("name", pd.getName());
                        item.put("description", pd.getDescription());
                        item.put("productType", pd.getProductType());

                        if (pd.getOneTimePurchaseOfferDetails() != null) {
                            item.put("price", pd.getOneTimePurchaseOfferDetails().getFormattedPrice());
                            item.put("priceAmountMicros", pd.getOneTimePurchaseOfferDetails().getPriceAmountMicros());
                            item.put("priceCurrencyCode", pd.getOneTimePurchaseOfferDetails().getPriceCurrencyCode());
                        } else if (pd.getSubscriptionOfferDetails() != null && !pd.getSubscriptionOfferDetails().isEmpty()) {
                            ProductDetails.SubscriptionOfferDetails sod = pd.getSubscriptionOfferDetails().get(0);
                            if (!sod.getPricingPhases().getPricingPhaseList().isEmpty()) {
                                ProductDetails.PricingPhase pp = sod.getPricingPhases().getPricingPhaseList().get(0);
                                item.put("price", pp.getFormattedPrice());
                                item.put("priceAmountMicros", pp.getPriceAmountMicros());
                                item.put("priceCurrencyCode", pp.getPriceCurrencyCode());
                            }
                        }
                        detailsArray.put(item);
                    }

                    JSObject ret = new JSObject();
                    ret.put("products", detailsArray);
                    call.resolve(ret);
                } else {
                    call.reject("Google Play ürünleri sorgulanamadı: " + billingResult.getDebugMessage());
                }
            });
        };

        if (isClientReady) {
            task.run();
        } else {
            startConnection(task);
        }
    }

    @PluginMethod
    public void purchase(PluginCall call) {
        final String productId = call.getString("productId");
        final boolean isSub = Boolean.TRUE.equals(call.getBoolean("isSubscription", false));

        if (productId == null || productId.isEmpty()) {
            call.reject("Geçersiz productId!");
            return;
        }

        activePurchaseCall = call;

        Runnable task = () -> {
            ProductDetails pd = cachedProductDetails.get(productId);

            if (pd == null) {
                // Önceden sorgulanmadıysa tekli sorgula
                List<QueryProductDetailsParams.Product> list = new ArrayList<>();
                list.add(QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(productId)
                        .setProductType(isSub ? BillingClient.ProductType.SUBS : BillingClient.ProductType.INAPP)
                        .build());

                QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                        .setProductList(list)
                        .build();

                billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
                    if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && !productDetailsList.isEmpty()) {
                        ProductDetails found = productDetailsList.get(0);
                        cachedProductDetails.put(productId, found);
                        launchBilling(found);
                    } else {
                        if (activePurchaseCall != null) {
                            activePurchaseCall.reject("Ürün Google Play'de bulunamadı (" + productId + "): " + billingResult.getDebugMessage());
                            activePurchaseCall = null;
                        }
                    }
                });
            } else {
                launchBilling(pd);
            }
        };

        if (isClientReady) {
            task.run();
        } else {
            startConnection(task);
        }
    }

    private void launchBilling(ProductDetails pd) {
        try {
            BillingFlowParams.ProductDetailsParams.Builder pdpBuilder = BillingFlowParams.ProductDetailsParams.newBuilder()
                    .setProductDetails(pd);

            if (pd.getProductType().equals(BillingClient.ProductType.SUBS)) {
                if (pd.getSubscriptionOfferDetails() != null && !pd.getSubscriptionOfferDetails().isEmpty()) {
                    String offerToken = pd.getSubscriptionOfferDetails().get(0).getOfferToken();
                    pdpBuilder.setOfferToken(offerToken);
                }
            }

            List<BillingFlowParams.ProductDetailsParams> list = new ArrayList<>();
            list.add(pdpBuilder.build());

            BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(list)
                    .build();

            getActivity().runOnUiThread(() -> {
                BillingResult result = billingClient.launchBillingFlow(getActivity(), billingFlowParams);
                if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    if (activePurchaseCall != null) {
                        activePurchaseCall.reject("Ödeme başlatılamadı: " + result.getDebugMessage());
                        activePurchaseCall = null;
                    }
                }
            });
        } catch (Exception e) {
            if (activePurchaseCall != null) {
                activePurchaseCall.reject("Ödeme akışı hatası: " + e.getMessage());
                activePurchaseCall = null;
            }
        }
    }

    @Override
    public void onPurchasesUpdated(@NonNull BillingResult billingResult, List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase purchase : purchases) {
                handlePurchase(purchase);
            }
        } else if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            Log.i(TAG, "Kullanıcı Google Play ödemesini iptal etti.");
            if (activePurchaseCall != null) {
                activePurchaseCall.reject("Kullanıcı ödeme işlemini iptal etti.");
                activePurchaseCall = null;
            }
        } else {
            Log.e(TAG, "Satın alma hatası: " + billingResult.getDebugMessage());
            if (activePurchaseCall != null) {
                activePurchaseCall.reject("Satın alma tamamlanamadı: " + billingResult.getDebugMessage());
                activePurchaseCall = null;
            }
        }
    }

    private void handlePurchase(Purchase purchase) {
        if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
            List<String> products = purchase.getProducts();
            String firstProduct = products.isEmpty() ? "pro" : products.get(0);

            // 1. Yerel belleğe kaydet (Çevrimdışı iken de PRO kalsın)
            saveProStatus(true, firstProduct, purchase.getPurchaseTime());

            // 2. Google Play'e onayla (Acknowledge)
            if (!purchase.isAcknowledged()) {
                AcknowledgePurchaseParams ackParams = AcknowledgePurchaseParams.newBuilder()
                        .setPurchaseToken(purchase.getPurchaseToken())
                        .build();

                billingClient.acknowledgePurchase(ackParams, billingResult -> {
                    Log.i(TAG, "Satın alma onaylandı (Acknowledged): " + billingResult.getResponseCode());
                });
            }

            // 3. Parti bileti (24 saatlik tüketilebilir ürün) ise consume et ki tekrar alabilsin
            if (firstProduct.equals("pro_party")) {
                ConsumeParams consumeParams = ConsumeParams.newBuilder()
                        .setPurchaseToken(purchase.getPurchaseToken())
                        .build();
                billingClient.consumeAsync(consumeParams, (billingResult, outToken) -> {
                    Log.i(TAG, "Parti bileti tüketildi (Consumed): " + billingResult.getResponseCode());
                });
            }

            // 4. Web arayüzüne bildir
            JSObject res = new JSObject();
            res.put("success", true);
            res.put("productId", firstProduct);
            res.put("orderId", purchase.getOrderId());
            res.put("purchaseToken", purchase.getPurchaseToken());
            res.put("purchaseTime", purchase.getPurchaseTime());

            if (activePurchaseCall != null) {
                activePurchaseCall.resolve(res);
                activePurchaseCall = null;
            }

            notifyListeners("onPurchaseSuccess", res, true);
        }
    }

    @PluginMethod
    public void restorePurchases(PluginCall call) {
        Runnable task = () -> {
            queryExistingPurchasesInternal();
            JSObject current = getProStatus();
            call.resolve(current);
        };

        if (isClientReady) {
            task.run();
        } else {
            startConnection(task);
        }
    }

    @PluginMethod
    public void getSavedProStatus(PluginCall call) {
        call.resolve(getProStatus());
    }

    private void queryExistingPurchasesInternal() {
        if (billingClient == null || !isClientReady) return;

        // INAPP kontrolü
        billingClient.queryPurchasesAsync(
                QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
                (billingResult, list) -> {
                    if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                        for (Purchase p : list) {
                            if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                                String pid = p.getProducts().isEmpty() ? "pro_lifetime" : p.getProducts().get(0);
                                saveProStatus(true, pid, p.getPurchaseTime());
                            }
                        }
                    }
                }
        );

        // SUBS kontrolü
        billingClient.queryPurchasesAsync(
                QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.SUBS).build(),
                (billingResult, list) -> {
                    if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                        for (Purchase p : list) {
                            if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                                String pid = p.getProducts().isEmpty() ? "pro_monthly" : p.getProducts().get(0);
                                saveProStatus(true, pid, p.getPurchaseTime());
                            }
                        }
                    }
                }
        );
    }

    private void saveProStatus(boolean isPro, String tier, long time) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
                .putBoolean(KEY_IS_PRO, isPro)
                .putString(KEY_PRO_TIER, tier)
                .putLong(KEY_PURCHASE_TIME, time)
                .apply();

        JSObject event = new JSObject();
        event.put("isPro", isPro);
        event.put("tier", tier);
        notifyListeners("onProStateChanged", event, true);
    }

    private JSObject getProStatus() {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        boolean isPro = prefs.getBoolean(KEY_IS_PRO, false);
        String tier = prefs.getString(KEY_PRO_TIER, "free");
        long time = prefs.getLong(KEY_PURCHASE_TIME, 0);

        // Eğer 24 saatlik parti biletiyse ve 24 saati geçtiyse iptal et
        if (isPro && "pro_party".equals(tier)) {
            long now = System.currentTimeMillis();
            if (now - time > 24 * 60 * 60 * 1000L) {
                isPro = false;
                saveProStatus(false, "expired", 0);
            }
        }

        JSObject res = new JSObject();
        res.put("isPro", isPro);
        res.put("tier", tier);
        res.put("purchaseTime", time);
        return res;
    }
}
