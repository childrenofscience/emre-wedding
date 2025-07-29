// GERÇEK iyzico API Entegrasyonu
// Bu dosyayı kendi API bilgilerinizle güncelleyin

class RealWeddingPayment {
    constructor() {
        // GERÇEK iyzico API Bilgileri
        this.apiKey = 'BURAYA_KENDI_API_KEY_INIZI_YAZIN'; 
        this.secretKey = 'BURAYA_KENDI_SECRET_KEY_INIZI_YAZIN';
        
        // Test ortamı (para çekilmez)
        this.baseUrl = 'https://sandbox-api.iyzipay.com';
        
        // Canlı ortam (gerçek para transferi)
        // this.baseUrl = 'https://api.iyzipay.com';
        
        this.conversationId = this.generateConversationId();
        
        console.log('💳 Gerçek iyzico entegrasyonu aktif!');
    }

    generateConversationId() {
        return 'wedding-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Gerçek API isteği gönder
    async makeApiRequest(endpoint, data) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substr(2, 9);
        
        // ⚠️ GÜVENLİK: Bu kısım backend'de yapılmalı!
        console.warn('🔒 Güvenlik: API key\'ler backend\'de saklanmalı!');
        
        // Signature oluştur (iyzico gereksinimi)
        const requestBody = JSON.stringify(data);
        const signature = await this.generateSignature(requestBody, randomString);
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `IYZWS ${this.apiKey}:${signature}`,
            'x-iyzi-rnd': randomString,
            'x-iyzi-client-version': 'iyzipay-js-2.0.0'
        };

        try {
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'POST',
                headers: headers,
                body: requestBody
            });

            const result = await response.json();
            
            // API yanıtını logla
            console.log('📡 iyzico API Yanıtı:', result);
            
            return result;
        } catch (error) {
            console.error('❌ API Hatası:', error);
            throw error;
        }
    }

    // iyzico signature oluştur
    async generateSignature(requestBody, randomString) {
        const hashString = this.apiKey + randomString + this.secretKey + requestBody;
        
        // SHA1 hash oluştur
        const encoder = new TextEncoder();
        const data = encoder.encode(hashString);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
        
        return hashBase64;
    }

    // Ödeme başarı durumunu kontrol et
    async checkPaymentStatus(token) {
        const requestData = {
            locale: 'tr',
            conversationId: this.conversationId,
            token: token
        };

        try {
            const response = await this.makeApiRequest('/payment/iyzipos/checkoutform/auth/ecom/detail', requestData);
            return response;
        } catch (error) {
            console.error('Payment status check failed:', error);
            throw error;
        }
    }
}

// Gerçek API kullanımı örneği
window.RealWeddingPayment = RealWeddingPayment;
