// Altın Fiyatları API Servisi
// Gerçek zamanlı altın fiyatlarını çeker

class GoldPriceService {
    constructor() {
        // Türkiye Cumhuriyet Merkez Bankası API'si (ücretsiz)
        this.tcmbApiUrl = 'https://evds2.tcmb.gov.tr/service/evds/';
        
        // Altın API'si (alternatif)
        this.goldApiUrl = 'https://api.metals.live/v1/spot/gold';
        
        // Backup altın fiyatları (API çalışmazsa)
        this.backupPrices = {
            'gram': 1820,
            'ceyrek': 465,
            'trabzon': 920,
            'yarim': 910
        };
        
        // Cache için
        this.lastUpdate = null;
        this.cachedPrices = null;
        this.cacheTimeout = 5 * 60 * 1000; // 5 dakika
    }

    // Ana altın fiyatları fonksiyonu
    async getGoldPrices() {
        try {
            // Cache kontrolü
            if (this.isCacheValid()) {
                console.log('📊 Cache\'den altın fiyatları alınıyor');
                return this.cachedPrices;
            }

            console.log('🔄 Güncel altın fiyatları çekiliyor...');
            
            // Önce TCMB'den dene
            let prices = await this.fetchFromTCMB();
            
            // TCMB çalışmazsa alternatif API
            if (!prices) {
                prices = await this.fetchFromGoldAPI();
            }
            
            // Her ikisi de çalışmazsa backup kullan
            if (!prices) {
                console.warn('⚠️ API\'ler çalışmıyor, backup fiyatlar kullanılıyor');
                prices = this.backupPrices;
            }

            // Cache'e kaydet
            this.cachedPrices = prices;
            this.lastUpdate = Date.now();
            
            console.log('✅ Altın fiyatları güncellendi:', prices);
            return prices;
            
        } catch (error) {
            console.error('❌ Altın fiyatı hatası:', error);
            return this.backupPrices;
        }
    }

    // Cache geçerli mi kontrol et
    isCacheValid() {
        return this.cachedPrices && 
               this.lastUpdate && 
               (Date.now() - this.lastUpdate) < this.cacheTimeout;
    }

    // TCMB'den altın fiyatı çek
    async fetchFromTCMB() {
        try {
            // TCMB altın fiyatı endpoint'i
            const response = await fetch('https://api.genelpara.com/embed/altin.json');
            
            if (!response.ok) throw new Error('TCMB API hatası');
            
            const data = await response.json();
            
            // Gram altın fiyatını al
            const gramGold = parseFloat(data.GA);
            
            if (isNaN(gramGold)) throw new Error('Geçersiz altın fiyatı');
            
            // Diğer altın türlerini hesapla
            return {
                'gram': Math.round(gramGold),
                'ceyrek': Math.round(gramGold * 0.25),
                'trabzon': Math.round(gramGold * 0.5),
                'yarim': Math.round(gramGold * 0.5)
            };
            
        } catch (error) {
            console.warn('⚠️ TCMB API hatası:', error.message);
            return null;
        }
    }

    // Alternatif Gold API'den çek
    async fetchFromGoldAPI() {
        try {
            const response = await fetch('https://api.metals.live/v1/spot/gold');
            
            if (!response.ok) throw new Error('Gold API hatası');
            
            const data = await response.json();
            
            // USD/Ounce → TRY/Gram dönüşümü
            const usdPrice = data.price; // USD per ounce
            const tryRate = 32; // Approximate USD/TRY rate
            const gramPrice = Math.round((usdPrice / 31.1035) * tryRate);
            
            return {
                'gram': gramPrice,
                'ceyrek': Math.round(gramPrice * 1.6),  // Çeyrek altın (~1.6 gram)
                'yarim': Math.round(gramPrice * 3.5),   // Yarım altın (~3.5 gram)
                'tam': Math.round(gramPrice * 7.2),     // Tam altın (~7.2 gram)
                'ajda': Math.round(gramPrice * 10)      // Ajda bilezik (gram altının 10 katı)
            };
            
        } catch (error) {
            console.warn('⚠️ Gold API hatası:', error.message);
            return null;
        }
    }

    // Altın türü açıklamalarını getir
    getGoldDescription(goldType) {
        const descriptions = {
            'gram': '1 Gram 22 Ayar Cumhuriyet Altını',
            'ceyrek': '¼ Altın (Çeyrek Cumhuriyet Altını)',
            'yarim': '½ Altın (Yarım Cumhuriyet Altını)', 
            'tam': '1 Tam Altın (Cumhuriyet Altını)',
            'ajda': 'Ajda Bilezik (Özel Tasarım)'
        };
        return descriptions[goldType] || 'Altın';
    }

    // Son güncelleme zamanını getir
    getLastUpdateTime() {
        if (!this.lastUpdate) return 'Henüz güncellenmedi';
        
        const now = new Date();
        const updateTime = new Date(this.lastUpdate);
        const diffMinutes = Math.floor((now - updateTime) / (1000 * 60));
        
        if (diffMinutes === 0) return 'Az önce güncellendi';
        if (diffMinutes === 1) return '1 dakika önce güncellendi';
        return `${diffMinutes} dakika önce güncellendi`;
    }

    // Fiyat değişim yüzdesini hesapla
    calculatePriceChange(oldPrice, newPrice) {
        if (!oldPrice || !newPrice) return 0;
        return ((newPrice - oldPrice) / oldPrice * 100).toFixed(2);
    }

    // Manuel fiyat güncelleme
    async forceUpdatePrices() {
        this.lastUpdate = null;
        this.cachedPrices = null;
        return await this.getGoldPrices();
    }
}

// Global olarak kullanılabilir hale getir
window.GoldPriceService = GoldPriceService;
