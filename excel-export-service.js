// Excel Export Service
// Ödeme ve şarkı isteklerini Excel dosyasına kaydeder

class ExcelExportService {
    constructor() {
        this.payments = [];
        this.songRequests = [];
        this.storageKey = 'wedding_data';
        
        // Local storage'dan veriyi yükle
        this.loadData();
        
        console.log('📊 Excel Export Service başlatıldı');
    }

    // Local storage'dan verileri yükle
    loadData() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                const data = JSON.parse(savedData);
                this.payments = data.payments || [];
                this.songRequests = data.songRequests || [];
                console.log(`📊 ${this.payments.length} ödeme, ${this.songRequests.length} şarkı isteği yüklendi`);
            }
        } catch (error) {
            console.error('Veri yükleme hatası:', error);
        }
    }

    // Verileri local storage'a kaydet
    saveData() {
        try {
            const data = {
                payments: this.payments,
                songRequests: this.songRequests,
                lastUpdate: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('💾 Veriler kaydedildi');
        } catch (error) {
            console.error('Veri kaydetme hatası:', error);
        }
    }

    // Yeni ödeme ekle
    addPayment(paymentData) {
        const payment = {
            id: 'PAY_' + Date.now(),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('tr-TR'),
            time: new Date().toLocaleTimeString('tr-TR'),
            amount: paymentData.amount,
            currency: paymentData.currency,
            paymentType: paymentData.paymentType || 'Bilinmiyor',
            paymentMethod: paymentData.paymentMethod || 'Kredi Kartı',
            guestEmail: paymentData.guestEmail || 'Bilinmiyor',
            transactionId: paymentData.transactionId || 'N/A',
            status: 'Başarılı'
        };

        this.payments.push(payment);
        this.saveData();
        
        console.log('💰 Yeni ödeme eklendi:', payment);
        return payment;
    }

    // Yeni şarkı isteği ekle
    addSongRequest(songData, paymentId = null) {
        const songRequest = {
            id: 'SONG_' + Date.now(),
            paymentId: paymentId,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('tr-TR'),
            time: new Date().toLocaleTimeString('tr-TR'),
            songTitle: songData.name || 'Bilinmiyor',
            artist: songData.artists?.[0]?.name || 'Bilinmiyor',
            album: songData.album?.name || 'Bilinmiyor',
            spotifyId: songData.id || 'N/A',
            spotifyUrl: songData.external_urls?.spotify || 'N/A',
            imageUrl: songData.album?.images?.[0]?.url || 'N/A',
            duration: songData.duration_ms ? Math.round(songData.duration_ms / 1000) : 0,
            popularity: songData.popularity || 0
        };

        this.songRequests.push(songRequest);
        this.saveData();
        
        console.log('🎵 Yeni şarkı isteği eklendi:', songRequest);
        return songRequest;
    }

    // CSV formatında export (Excel'de açılabilir)
    exportToCSV() {
        try {
            // Ödeme verileri CSV
            const paymentHeaders = [
                'Tarih', 'Saat', 'Tutar', 'Para Birimi', 'Ödeme Türü', 
                'Ödeme Yöntemi', 'Email', 'İşlem ID', 'Durum'
            ];
            
            const paymentRows = this.payments.map(payment => [
                payment.date,
                payment.time,
                payment.amount,
                payment.currency,
                payment.paymentType,
                payment.paymentMethod,
                payment.guestEmail,
                payment.transactionId,
                payment.status
            ]);

            const paymentCSV = this.arrayToCSV([paymentHeaders, ...paymentRows]);

            // Şarkı istekleri CSV
            const songHeaders = [
                'Tarih', 'Saat', 'Şarkı Adı', 'Sanatçı', 'Albüm', 
                'Süre (sn)', 'Popülerlik', 'Spotify URL'
            ];
            
            const songRows = this.songRequests.map(song => [
                song.date,
                song.time,
                song.songTitle,
                song.artist,
                song.album,
                song.duration,
                song.popularity,
                song.spotifyUrl
            ]);

            const songCSV = this.arrayToCSV([songHeaders, ...songRows]);

            // İki CSV'yi birleştir
            const combinedCSV = `ÖDEMELER\n${paymentCSV}\n\nŞARKI İSTEKLERİ\n${songCSV}`;

            // Dosyayı indir
            this.downloadCSV(combinedCSV, `ceyda-emre-wedding-data-${new Date().toISOString().split('T')[0]}.csv`);
            
            console.log('📊 Excel dosyası oluşturuldu');
            return true;

        } catch (error) {
            console.error('Excel export hatası:', error);
            return false;
        }
    }

    // Array'i CSV formatına çevir
    arrayToCSV(data) {
        return data.map(row => 
            row.map(field => 
                typeof field === 'string' && field.includes(',') 
                    ? `"${field}"` 
                    : field
            ).join(',')
        ).join('\n');
    }

    // CSV dosyasını indir
    downloadCSV(csvContent, filename) {
        // UTF-8 BOM ekle (Türkçe karakter desteği için)
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // JSON formatında export (backup için)
    exportToJSON() {
        const data = {
            exportDate: new Date().toISOString(),
            summary: {
                totalPayments: this.payments.length,
                totalAmount: this.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
                totalSongRequests: this.songRequests.length
            },
            payments: this.payments,
            songRequests: this.songRequests
        };

        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `wedding-backup-${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // İstatistikler
    getStatistics() {
        const totalAmount = this.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        const avgAmount = this.payments.length > 0 ? totalAmount / this.payments.length : 0;
        
        return {
            totalPayments: this.payments.length,
            totalAmount: totalAmount,
            avgAmount: Math.round(avgAmount),
            totalSongRequests: this.songRequests.length,
            lastPayment: this.payments.length > 0 ? this.payments[this.payments.length - 1].date : 'Henüz ödeme yok',
            lastSong: this.songRequests.length > 0 ? this.songRequests[this.songRequests.length - 1].songTitle : 'Henüz şarkı isteği yok'
        };
    }

    // Verileri temizle
    clearAllData() {
        if (confirm('Tüm verileri silmek istediğinizden emin misiniz?')) {
            this.payments = [];
            this.songRequests = [];
            localStorage.removeItem(this.storageKey);
            console.log('🗑️ Tüm veriler silindi');
            return true;
        }
        return false;
    }

    // Manuel veri ekleme (test için)
    addTestData() {
        // Test ödeme
        this.addPayment({
            amount: 500,
            currency: 'TRY',
            paymentType: 'Test Ödeme',
            paymentMethod: 'Kredi Kartı',
            guestEmail: 'test@example.com',
            transactionId: 'TEST_' + Date.now()
        });

        // Test şarkı
        this.addSongRequest({
            name: 'Test Şarkısı',
            artists: [{ name: 'Test Sanatçı' }],
            album: { name: 'Test Albüm' },
            duration_ms: 210000,
            popularity: 85
        });

        console.log('🧪 Test verileri eklendi');
    }
}

// Global olarak kullanılabilir hale getir
window.ExcelExportService = ExcelExportService;
