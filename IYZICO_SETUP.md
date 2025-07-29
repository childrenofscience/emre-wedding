# 🏦 iyzico Hesap Açma ve Kurulum Rehberi

## 📝 **1. iyzico Hesap Açma (Adım Adım)**

### **Websiteye Git**
🌐 [iyzico.com](https://iyzico.com) → "Ücretsiz Başla"

### **Hesap Bilgileri**
```
✅ Email: inci.bilim00@gmail.com
✅ İşletme Adı: Ceyda & Emre Wedding
✅ İş Türü: E-ticaret/Hizmet
✅ Telefon: +90...
✅ TC/Vergi No: ...
```

### **Gerekli Belgeler**
📄 Yüklemeniz gerekenler:
- Kimlik fotokopisi
- Banka hesap cüzdanı
- İmza sirküleri (opsiyonel)

### **Banka Hesabı**
💳 Para transferi için:
- IBAN numaranız
- Hesap sahibi adı
- Banka şubesi

## 🔧 **2. API Bilgilerini Alma**

Hesap onaylandıktan sonra:

### **iyzico Paneline Giriş**
1. 🔐 [merchant.iyzipay.com](https://merchant.iyzipay.com) → Giriş
2. 📊 Dashboard'a geçin

### **API Ayarları**
1. 🛠️ "Geliştirici" sekmesi → "API ve Webhook"
2. 📋 Şu bilgileri kopyalayın:

```javascript
// Test ortamı bilgileri
TEST_API_KEY = "sandbox-xxxxxxxxxx"
TEST_SECRET_KEY = "sandbox-xxxxxxxxxx"

// Canlı ortam bilgileri (dikkatli!)
LIVE_API_KEY = "xxxxxxxxxx" 
LIVE_SECRET_KEY = "xxxxxxxxxx"
```

## ⚙️ **3. Konfigürasyon Güncellemesi**

### **payment.js Dosyasını Düzenleyin:**

```javascript
// 1. Test ortamı ile başlayın
this.apiKey = 'BURAYA_TEST_API_KEY_YAZIN';
this.secretKey = 'BURAYA_TEST_SECRET_KEY_YAZIN';
this.baseUrl = 'https://sandbox-api.iyzipay.com';
this.isProduction = false;

// 2. Test başarılı olduktan sonra canlıya geçin
// this.apiKey = 'BURAYA_CANLI_API_KEY_YAZIN';
// this.secretKey = 'BURAYA_CANLI_SECRET_KEY_YAZIN';
// this.baseUrl = 'https://api.iyzipay.com';
// this.isProduction = true;
```

## 🔒 **4. Webhook Kurulumu**

### **iyzico Panelinde:**
1. 🛠️ "Geliştirici" → "Webhook"
2. 📝 Webhook URL: `https://yourdomain.com/webhook`
3. ✅ Etkinlikleri seçin:
   - Payment Success
   - Payment Failed

### **Webhook Endpoint (PHP):**
```php
<?php
// webhook.php
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($data['eventType'] === 'PAYMENT_SUCCESS') {
    // Email gönder
    mail('inci.bilim00@gmail.com', 'Ödeme Alındı!', 
         'Yeni ödeme: ' . $data['paymentAmount'] . ' TL');
    
    // Log kaydet
    file_put_contents('payments.log', 
        date('Y-m-d H:i:s') . " - " . json_encode($data) . "\n", 
        FILE_APPEND);
}

http_response_code(200);
echo "OK";
?>
```

## 📧 **5. Email Bildirimi Kurulumu**

### **EmailJS Ücretsiz Servis:**
1. 🌐 [emailjs.com](https://emailjs.com) → Kayıt olun
2. 📧 Email servisi oluşturun
3. 🔧 Template ayarlayın

### **Konfigürasyon:**
```javascript
// email-service.js dosyasında
this.serviceId = 'service_xxxxxxx';      // EmailJS'den alın
this.templateId = 'template_xxxxxxx';    // EmailJS'den alın  
this.publicKey = 'xxxxxxxxxxxxxxx';     // EmailJS'den alın
```

## 💰 **6. Komisyon ve Ödeme Bilgileri**

### **iyzico Komisyon Oranları:**
| Kart Türü | Komisyon | Sabit Ücret |
|-----------|----------|--------------|
| Kredi Kartı | %2.9 | 0.25₺ |
| Banka Kartı | %1.9 | 0.25₺ |

### **Ödeme Takvimi:**
- 🕐 **Ödeme Saati**: Anında (müşteriden)
- 🏦 **Hesaba Geçiş**: 1-2 iş günü
- 📊 **Raporlama**: Günlük/haftalık

### **Örnek Hesaplama:**
```
Müşteri Ödemesi: 1000₺
iyzico Komisyon: 29₺ + 0.25₺ = 29.25₺
Sizin Aldığınız: 970.75₺
```

## 🧪 **7. Test Senaryoları**

### **Test Kartları:**
```
✅ Başarılı Ödeme:
Kart: 5528790000000008
Tarih: 12/30, CVC: 123

❌ Başarısız Ödeme:
Kart: 5528790000000016
Tarih: 12/30, CVC: 123
```

### **Test Checklist:**
- [ ] Test kartı ile ödeme
- [ ] Email bildirimi geldi mi?
- [ ] iyzico panelinde görünüyor mu?
- [ ] Webhook çalışıyor mu?
- [ ] Para hesaba geçti mi? (test ortamında geçmez)

## 🚀 **8. Canlıya Geçiş**

### **Hazırlık:**
1. ✅ Test ortamında her şey çalışıyor
2. ✅ SSL sertifikası kurulu
3. ✅ Domain yönlendirmesi yapıldı
4. ✅ Webhook URL'i canlı

### **Geçiş:**
```javascript
// payment.js dosyasında
this.baseUrl = 'https://api.iyzipay.com';      // Canlı API
this.isProduction = true;                       // Canlı mod
this.apiKey = 'CANLI_API_KEY';                  // Canlı key
this.secretKey = 'CANLI_SECRET_KEY';            // Canlı secret
```

## 📞 **9. Destek ve Yardım**

### **iyzico Destek:**
- 📧 Email: destek@iyzico.com
- 📞 Telefon: 0850 260 00 00
- 📚 Dokümantasyon: [dev.iyzipay.com](https://dev.iyzipay.com)

### **Teknik Destek:**
- 🐛 Hata kodları: [docs](https://dev.iyzipay.com/tr/api/hata-kodlari)
- 💬 Forum: [community.iyzico.com](https://community.iyzico.com)

---

## ⚠️ **ÖNEMLİ NOTLAR:**

🔴 **Test ortamında para çekilmez!**  
🟡 **Canlı ortamda gerçek para transferi olur!**  
🔒 **API key'lerinizi kimseyle paylaşmayın!**  
📧 **Her ödeme için email bildirimi gelecek!**  

**Başarılar! 🎉**
