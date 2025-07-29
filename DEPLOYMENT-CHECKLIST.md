# Deployment Checklist

## ✅ Canlıya Geçiş Kontrol Listesi

### 1. API Endpoint'leri
- [ ] iyzico API: test → production URL
- [ ] EmailJS: production keys
- [ ] Gold API: rate limiting kontrol

### 2. Güvenlik
- [ ] API keys gizlendi
- [ ] HTTPS zorunlu
- [ ] CORS ayarları

### 3. Test Edilecekler
- [ ] Ödeme akışı test
- [ ] Email bildirimleri
- [ ] Altın fiyatları
- [ ] QR kod çalışıyor
- [ ] Mobil uyumluluk

### 4. Domain & SSL
- [ ] Domain ayarlandı
- [ ] SSL sertifikası aktif
- [ ] QR kod güncellendi

### 5. Son Kontroller
- [ ] Console error'ları temizlendi
- [ ] Performans optimizasyonu
- [ ] SEO meta tagları
- [ ] Favicon eklendi

---

## 🌐 Production URL'ler

### GitHub Pages:
```
https://KULLANICI_ADI.github.io/ceyda-emre-wedding/
```

### Custom Domain (Opsiyonel):
```
https://ceyda-emre-wedding.com
```

---

## 📱 QR Kod Test

Canlıya geçtikten sonra:
1. QR kodu mobilde test et
2. Ödeme akışını tam test et
3. Email bildirimlerini kontrol et

---

## 🚨 Acil Durum

Site çökerse:
1. GitHub'da önceki versiyona dön
2. DNS ayarlarını kontrol et
3. SSL sertifikasını yenile
