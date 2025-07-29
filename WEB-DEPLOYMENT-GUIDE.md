# 🌐 Web'e Taşıma Rehberi

## 🚀 GitHub Pages ile Ücretsiz Yayınlama (ÖNERİLEN)

### Adım 1: GitHub Hesabı Oluştur
1. https://github.com adresine git
2. Ücretsiz hesap oluştur
3. Email doğrulaması yap

### Adım 2: Repository Oluştur
1. "New repository" butonuna tıkla
2. Repository adı: `ceyda-emre-wedding`
3. ✅ "Public" seç
4. ✅ "Add a README file" işaretle
5. "Create repository" tıkla

### Adım 3: Dosyaları Yükle
1. "uploading an existing file" linkine tıkla
2. Tüm dosyaları sürükle-bırak:
   - index.html
   - payment.js
   - email-service.js
   - gold-price-service.js
   - spotify-service.js
   - excel-export-service.js
   - qr-generator.html
   - test-debug.html
   - README.md
   - package.json
   - .gitignore

### Adım 4: GitHub Pages Aktifleştir
1. Repository'de "Settings" sekmesine git
2. Sol menüden "Pages" seç
3. Source: "Deploy from a branch" seç
4. Branch: "main" seç
5. Folder: "/ (root)" seç
6. "Save" tıkla

### Adım 5: Site Hazır! 🎉
- Site URL: `https://KULLANICI_ADI.github.io/ceyda-emre-wedding`
- 5-10 dakika içinde aktif olur
- Ücretsiz SSL sertifikası dahil

---

## 🌟 Netlify (Alternatif - ÜCRETSİZ)

### Adım 1: Netlify'a Git
1. https://netlify.com adresine git
2. "Sign up" ile ücretsiz hesap oluştur
3. GitHub hesabınla bağlan

### Adım 2: Site Yükle
1. "Sites" sekmesine git
2. Dosya klasörünü sürükle-bırak
3. Site otomatik yayınlanır

### Avantajları:
- ✅ Anlık yayınlama
- ✅ Otomatik SSL
- ✅ CDN dahil
- ✅ Form işleme (ücretsiz plan)

---

## 💰 Hosting Seçenekleri (Ücretli)

### 1. Vercel (Basit)
- Ücretsiz plan mevcut
- GitHub entegrasyonu
- Otomatik deployment

### 2. Hostinger (Ucuz)
- ~2-5$/month
- cPanel dahil
- Email hosting

### 3. DigitalOcean (Gelişmiş)
- ~5$/month
- VPS sunucu
- Tam kontrol

---

## ⚙️ Domain Alma (İsteğe Bağlı)

### Ücretsiz Domain Seçenekleri:
1. **Freenom**: .tk, .ml, .ga (ücretsiz)
2. **GitHub Pages**: .github.io subdomain

### Ücretli Domain:
1. **Godaddy**: ~10-15$/yıl
2. **Namecheap**: ~8-12$/yıl
3. **Turhost**: ~20-30₺/yıl (Türk)

---

## 🔧 Kodda Yapılması Gerekenler

### 1. API Endpoint'leri Güncelle
```javascript
// payment.js dosyasında
this.baseUrl = 'https://api.iyzipay.com'; // Canlı için
```

### 2. Email Service Güncelle
```javascript
// email-service.js dosyasında
// EmailJS public key'leri güncelle
```

### 3. HTTPS Zorunlu
- Ödeme sistemleri sadece HTTPS'de çalışır
- GitHub Pages otomatik HTTPS verir

---

## 📱 QR Kod Güncelleme
Site yayınlandıktan sonra:
1. qr-generator.html dosyasında
2. Yeni domain URL'ini ekle
3. QR kod otomatik güncellenecek

---

## 🛡️ Güvenlik Kontrolleri

### Canlıya Geçmeden Önce:
1. ✅ iyzico API test → production
2. ✅ EmailJS ayarları kontrol
3. ✅ HTTPS aktif olduğundan emin ol
4. ✅ API key'leri gizle (.env kullan)
5. ✅ Error handling test et

---

## 🎯 Hızlı Başlangıç (5 Dakika)

1. **GitHub hesabı oluştur** (2 dk)
2. **Repository oluştur** (1 dk)
3. **Dosyaları yükle** (1 dk)
4. **Pages aktifleştir** (1 dk)
5. **Site hazır!** ✅

**Tahmini Maliyet: 0₺**
**Tahmini Süre: 5-10 dakika**
**Teknik Bilgi: Gerekmiyor**

---

## 📞 Destek

Sorun yaşarsan:
1. GitHub documentation oku
2. YouTube tutorial izle: "GitHub Pages deployment"
3. Stack Overflow'da ara

**En kolay ve güvenilir: GitHub Pages!** 🚀
