# 🚀 İNCİ İÇİN iyzico KURULUM REHBERİ

## 📋 **ADIM 1: iyzico API Bilgilerini Almak**

### 1️⃣ iyzico Paneline Giriş
🌐 [merchant.iyzipay.com](https://merchant.iyzipay.com) adresine gidin ve giriş yapın

### 2️⃣ API Anahtarlarını Bulun
Sol menüden: **Ayarlar** → **API Anahtarları** sekmesine gidin

### 3️⃣ Test Bilgilerini Kopyalayın
```
📋 SANDBOX API KEY: sandbox-xxxxxxxxx
📋 SANDBOX SECRET KEY: sandbox-xxxxxxxxx
```

Bu bilgileri kopyalayın! 👆

---

## 🔧 **ADIM 2: Kodlara API Bilgilerini Yazmak**

### 1️⃣ payment.js Dosyasını Açın
VS Code'da `payment.js` dosyasını açın

### 2️⃣ Bu Satırları Bulun (7-8. satırlar):
```javascript
this.apiKey = 'sandbox-BURAYA_IYZICO_SANDBOX_API_KEY_YAPISTIIRIN'; 
this.secretKey = 'sandbox-BURAYA_IYZICO_SANDBOX_SECRET_KEY_YAPISTIIRIN';
```

### 3️⃣ Kendi Bilgilerinizle Değiştirin:
```javascript
this.apiKey = 'sandbox-SIZIN_API_KEY_INIZ'; 
this.secretKey = 'sandbox-SIZIN_SECRET_KEY_INIZ';
```

**⚠️ ÖNEMLİ:** Tırnak işaretlerini silmeyin, sadece içerisini değiştirin!

---

## 📧 **ADIM 3: Email Servisi Kurulumu (İsteğe Bağlı)**

### 1️⃣ EmailJS Hesabı Açın
🌐 [emailjs.com](https://emailjs.com) → "Sign Up Free"

### 2️⃣ Email Template Oluşturun
- Service: Gmail seçin
- Template: "Yeni Ödeme Bildirimi" adında template oluşturun

### 3️⃣ API Bilgilerini Alın
EmailJS panelinden:
- Service ID
- Template ID  
- Public Key

---

## 🧪 **ADIM 4: Test Etmek**

### 1️⃣ Uygulamayı Açın
`index.html` dosyasını çift tıklayarak açın

### 2️⃣ Test Ödemesi Yapın
1. Kredi Kartı seçin
2. Türk Lirası → 100 TL
3. "Ödeme Yap" butonuna tıklayın

### 3️⃣ Sonucu Kontrol Edin
- Browser Console'da (F12) logları kontrol edin
- "✅ iyzico API bilgileri yüklendi" mesajını görmelisiniz

### 4️⃣ Test Kartı Bilgileri
```
Kart No: 5528790000000008
Tarih: 12/30
CVC: 123
```

---

## 🔥 **ADIM 5: Canlı Ortama Geçiş (İleride)**

### ⚠️ ŞİMDİLİK YAPMAYIN! Önce test edin.

Test başarılı olduktan sonra:

1️⃣ **Canlı API Bilgilerini Alın**
iyzico panelinden LIVE API bilgilerini alın

2️⃣ **payment.js'te Değişiklik**
```javascript
// Bu satırları comment'ten çıkarın:
this.baseUrl = 'https://api.iyzipay.com';
this.isProduction = true;

// Test satırlarını comment'leyin:
// this.baseUrl = 'https://sandbox-api.iyzipay.com';
// this.isProduction = false;
```

3️⃣ **SSL Sertifikası**
Website'inizi HTTPS yapmak zorunlu

---

## 💰 **Para Transferi Nasıl Çalışır?**

```
1. Misafir ödeme yapar → iyzico
2. iyzico komisyon keser (%2.9 + 0.25₺)
3. Kalan para sizin hesabınıza 1-2 gün sonra yatar
```

**Örnek:** 1000₺ ödeme → Komisyon: 29.25₺ → Size: 970.75₺

---

## 🆘 **Sorun Giderme**

### ❌ "API bilgileri eksik" Hatası
➡️ payment.js dosyasında API key'leri doğru yazdığınızdan emin olun

### ❌ CORS Hatası
➡️ Normal, backend gerekebilir. Test için simülasyon çalışır.

### ❌ Email Gitmiyor
➡️ EmailJS kurulumunu yapın veya offline backup'ları kontrol edin

---

## 📞 **Destek**

- iyzico Destek: [iyzico.com/destek](https://iyzico.com/destek)
- Bu proje için: Console'daki hata mesajlarını kontrol edin

---

## ✅ **Kontrol Listesi**

- [ ] iyzico hesabım var
- [ ] API bilgilerini aldım
- [ ] payment.js'e yazdım
- [ ] Test ödeme yaptım
- [ ] Console'da hata yok
- [ ] Email bildirimi çalışıyor
- [ ] Gerçek ödeme için hazırım

**Tüm adımlar tamamlandıktan sonra gerçek ödeme almaya başlayabilirsiniz! 🎉**
