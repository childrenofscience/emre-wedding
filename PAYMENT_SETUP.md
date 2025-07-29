# 💳 Ödeme Entegrasyonu Kurulum Rehberi

## 🚀 Hızlı Başlangıç

### 1. iyzico Hesabı Açın
1. [iyzico.com](https://iyzico.com) adresinden ücretsiz hesap açın
2. Test ortamı API bilgilerinizi alın:
   - **API Key** (sandbox-xxx...)
   - **Secret Key** (sandbox-xxx...)

### 2. API Bilgilerini Güncelleyin

**payment.js** dosyasında aşağıdaki değerleri kendi bilgilerinizle değiştirin:

```javascript
this.apiKey = 'sandbox-your-api-key'; // Buraya kendi API key'inizi yazın
this.secretKey = 'sandbox-your-secret-key'; // Buraya kendi secret key'inizi yazın
```

### 3. Test Kartları

iyzico test ortamında kullanabileceğiniz kartlar:

| Kart Numarası | Son Kullanma | CVC | 3D Secure |
|---------------|--------------|-----|-----------|
| 5528790000000008 | 12/30 | 123 | Var |
| 4766620000000001 | 12/30 | 123 | Yok |
| 4603450000000000 | 12/30 | 123 | Var |

## 🏗️ Teknik Detaylar

### Ödeme Akışı

1. **Müşteri** ödeme seçeneğini belirler
2. **Frontend** ödeme verilerini hazırlar
3. **Backend** iyzico API'sine istek gönderir
4. **iyzico** ödeme formunu döner
5. **Müşteri** ödeme bilgilerini girer
6. **iyzico** sonucu callback URL'e gönderir
7. **Backend** ödeme sonucunu işler

### Güvenlik Önlemleri

⚠️ **ÖNEMLİ**: Şu anki kod sadece demo amaçlıdır!

**Gerçek uygulamada yapılması gerekenler:**

1. **API Key'leri Backend'de Saklayın**
   ```javascript
   // ❌ YANLIŞ - Frontend'de API key
   this.apiKey = 'sandbox-xxx';
   
   // ✅ DOĞRU - Backend endpoint'i kullan
   const response = await fetch('/api/create-payment', {
       method: 'POST',
       body: JSON.stringify(paymentData)
   });
   ```

2. **HTTPS Kullanın**
   - SSL sertifikası zorunlu
   - Tüm API çağrıları şifreli olmalı

3. **Input Validation**
   ```php
   // Backend'de mutlaka doğrulama yapın
   if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
       throw new Exception('Invalid email');
   }
   ```

### Backend Entegrasyonu

**PHP ile örnek:**
```php
// payment-backend.php dosyasını kullanın
$payment = new IyzicoPayment();
$result = $payment->createCheckoutForm($requestData);
```

**Node.js ile örnek:**
```javascript
const iyzipay = require('iyzipay');

const payment = {
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: 'https://sandbox-api.iyzipay.com'
};
```

## 🌐 Canlı Ortama Geçiş

### 1. Canlı API Bilgileri
```javascript
// Test ortamı
this.baseUrl = 'https://sandbox-api.iyzipay.com';

// Canlı ortam
this.baseUrl = 'https://api.iyzipay.com';
```

### 2. SSL Sertifikası
- Domain için geçerli SSL sertifikası
- iyzico callback URL'leri HTTPS olmalı

### 3. Webhook URL'leri
```javascript
callbackUrl: 'https://yourdomain.com/payment-callback',
```

## 💰 Komisyon Oranları

### iyzico Test Oranları
- **Kredi Kartı**: %2.9 + 0.25₺
- **Banka Kartı**: %1.9 + 0.25₺
- **3D Secure**: Ekstra güvenlik

### Diğer Alternatifler
- **PayTR**: %1.99 (Türkiye)
- **Stripe**: %2.9 + $0.30 (Global)
- **Garanti Virtual POS**: Banka komisyonu

## 🔧 Test Senaryoları

### Başarılı Ödeme Testi
1. Uygulamayı açın
2. Para birimi seçin (TL)
3. Tutar girin (500 TL)
4. Test kartı ile ödeme yapın
5. Callback sayfasını kontrol edin

### Hata Durumu Testi
1. Geçersiz kart numarası girin
2. Hata mesajını kontrol edin
3. Tekrar deneme butonunu test edin

## 📊 İstatistikler ve Raporlama

### Ödeme Logları
```php
// payment_logs.json dosyasında saklanır
{
    "timestamp": "2025-07-29 15:30:00",
    "conversation_id": "wedding-123456",
    "amount": 500,
    "currency": "TRY",
    "status": "success"
}
```

### Admin Paneli
Gelecekte eklenecek özellikler:
- Ödeme raporları
- Hediye istatistikleri
- Gelir takibi
- Müşteri bilgileri

## 🆘 Sorun Giderme

### Sık Karşılaşılan Hatalar

**1. CORS Hatası**
```javascript
// Backend'de CORS başlıkları ekleyin
header('Access-Control-Allow-Origin: *');
```

**2. SSL Hatası**
```javascript
// Test ortamında SSL doğrulamayı kapatın
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
```

**3. Signature Hatası**
```javascript
// API key ve secret key'i kontrol edin
console.log('API Key:', this.apiKey);
```

### Loglama
```javascript
// Detaylı log için
console.log('Payment Request:', requestData);
console.log('Payment Response:', response);
```

## 📞 Destek

- **iyzico Dokümantasyon**: [dev.iyzipay.com](https://dev.iyzipay.com)
- **iyzico Destek**: destek@iyzico.com
- **Test Kartları**: [Test kartları listesi](https://dev.iyzipay.com/tr/test-kartlari)

---

**Sonraki Adımlar:**
1. ✅ Test ortamında deneyin
2. ✅ Backend'i güvenli hale getirin  
3. ✅ Canlı ortama geçin
4. ✅ SSL sertifikası kurun
5. ✅ Webhook'ları test edin
