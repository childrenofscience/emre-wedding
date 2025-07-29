// Wedding Payment Integration
// iyzico Test API Configuration

class WeddingPayment {
    constructor() {
        // GERÇEK iyzico API Bilgileri
        // İlk önce test ortamında deneyin, sonra canlıya geçin
        
        // ⚠️ BU SATIRLARI KENDİ BİLGİLERİNİZLE DEĞİŞTİRİN:
        this.apiKey = 'sandbox-BURAYA_IYZICO_SANDBOX_API_KEY_YAPISTIIRIN'; 
        this.secretKey = 'sandbox-BURAYA_IYZICO_SANDBOX_SECRET_KEY_YAPISTIIRIN'; 
        
        // Test ortamı (şimdilik güvenli - para çekilmez)
        this.baseUrl = 'https://sandbox-api.iyzipay.com';
        this.isProduction = false;
        
        // Canlı ortam (gerçek para - sonra aktif edeceğiz)
        // this.baseUrl = 'https://api.iyzipay.com';
        // this.isProduction = true;
        
        this.conversationId = this.generateConversationId();
        
        // Email servisi başlat
        this.emailService = new EmailNotificationService();
        
        // Mod bilgisi
        if (this.isProduction) {
            console.warn('🔴 CANLI MOD: Gerçek para transferi aktif!');
        } else {
            console.warn('🟡 TEST MODU: Para çekilmez, test amaçlı');
        }
        
        // API key kontrolü
        if (this.apiKey.includes('BURAYA')) {
            console.error('⚠️ HATA: iyzico API bilgilerini girmediniz!');
            alert('📋 iyzico panelinden API bilgilerini kopyalayıp buraya yapıştırın!');
        } else {
            console.log('✅ iyzico API bilgileri yüklendi');
        }
    }

    generateConversationId() {
        return 'wedding-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Ödeme isteği oluştur
    async createPaymentRequest(paymentData) {
        const requestData = {
            locale: 'tr',
            conversationId: this.conversationId,
            price: paymentData.amount,
            paidPrice: paymentData.amount,
            currency: paymentData.currency || 'TRY',
            basketId: this.generateBasketId(),
            paymentGroup: 'PRODUCT',
            callbackUrl: window.location.origin + '/payment-callback',
            enabledInstallments: [1, 2, 3, 6, 9],
            buyer: paymentData.buyer,
            shippingAddress: paymentData.shippingAddress,
            billingAddress: paymentData.billingAddress,
            basketItems: paymentData.basketItems
        };

        try {
            const response = await this.makeApiRequest('/payment/iyzipos/checkoutform/initialize/auth/ecom', requestData);
            return response;
        } catch (error) {
            console.error('Payment request failed:', error);
            throw error;
        }
    }

    generateBasketId() {
        return 'W' + Date.now();
    }

    // API isteği gönder - GERÇEK IYZICO API
    async makeApiRequest(endpoint, data) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substr(2, 9);
        
        // API key kontrolü
        if (this.apiKey.includes('BURAYA')) {
            console.error('❌ iyzico API bilgileri eksik!');
            return {
                status: 'failure',
                errorCode: 'API_KEY_MISSING',
                errorMessage: 'iyzico API bilgilerini payment.js dosyasına girmeniz gerekiyor!'
            };
        }
        
        console.log('🔄 iyzico API çağrısı yapılıyor...');
        console.log('📊 Ödeme verileri:', data);
        
        try {
            // Gerçek API çağrısı
            const requestBody = JSON.stringify(data);
            const signature = await this.generateSignature(requestBody, randomString);
            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `IYZWS ${this.apiKey}:${signature}`,
                'x-iyzi-rnd': randomString,
                'x-iyzi-client-version': 'iyzipay-js-2.0.0'
            };

            const response = await fetch(this.baseUrl + endpoint, {
                method: 'POST',
                headers: headers,
                body: requestBody,
                mode: 'cors'
            });

            const result = await response.json();
            
            console.log('📡 iyzico API Yanıtı:', result);
            
            // Başarılı ödeme durumunda email gönder
            if (result.status === 'success') {
                await this.sendPaymentNotification(data, result);
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ API Hatası:', error);
            
            // CORS hatası durumunda backend kullanımı öner
            if (error.message.includes('CORS')) {
                console.warn('🔒 CORS hatası: Backend kullanmanız önerilir');
                return {
                    status: 'failure',
                    errorCode: 'CORS_ERROR',
                    errorMessage: 'Güvenlik nedeniyle backend kullanmanız gerekiyor'
                };
            }
            
            throw error;
        }
    }

    // iyzico signature oluştur
    async generateSignature(requestBody, randomString) {
        const hashString = this.apiKey + randomString + this.secretKey + requestBody;
        
        try {
            // Modern browser SHA1 hash
            const encoder = new TextEncoder();
            const data = encoder.encode(hashString);
            const hashBuffer = await crypto.subtle.digest('SHA-1', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
            return hashBase64;
        } catch (error) {
            console.error('Signature oluşturma hatası:', error);
            throw error;
        }
    }

    // Ödeme başarı bildirimi gönder
    async sendPaymentNotification(requestData, responseData) {
        try {
            const notificationData = {
                amount: requestData.price,
                currency: requestData.currency,
                paymentType: this.getPaymentTypeFromBasket(requestData.basketItems),
                guestEmail: requestData.buyer.email,
                transactionId: responseData.token || 'N/A',
                conversationId: requestData.conversationId
            };
            
            await this.emailService.sendPaymentNotification(notificationData);
            console.log('📧 Email bildirimi gönderildi');
            
        } catch (error) {
            console.error('📧 Email gönderme hatası:', error);
        }
    }

    // Sepet içeriğinden ödeme türünü belirle
    getPaymentTypeFromBasket(basketItems) {
        if (!basketItems || basketItems.length === 0) return 'Bilinmeyen';
        
        const item = basketItems[0];
        if (item.category1 === 'Altın') {
            return `${item.name} (Altın)`;
        } else {
            return 'Düğün Hediyesi (Nakit)';
        }
    }

    // Mock ödeme formu oluştur (Demo amaçlı)
    generateMockCheckoutForm(data) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>iyzico Test Ödeme</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
                    .payment-form { background: white; padding: 30px; border-radius: 10px; max-width: 400px; margin: 0 auto; }
                    .form-group { margin-bottom: 15px; }
                    label { display: block; margin-bottom: 5px; font-weight: bold; }
                    input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
                    button { width: 100%; padding: 15px; background: #4facfe; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; }
                    .test-info { background: #fff3cd; padding: 10px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #ffeaa7; }
                </style>
            </head>
            <body>
                <div class="payment-form">
                    <h2>🎉 Test Ödeme Formu</h2>
                    <div class="test-info">
                        <strong>💡 Test Kartı:</strong><br>
                        Kart: 5528790000000008<br>
                        Tarih: 12/30, CVC: 123
                    </div>
                    <div class="form-group">
                        <label>Kart Numarası</label>
                        <input type="text" value="5528790000000008" />
                    </div>
                    <div class="form-group">
                        <label>Son Kullanma (MM/YY)</label>
                        <input type="text" value="12/30" />
                    </div>
                    <div class="form-group">
                        <label>CVC</label>
                        <input type="text" value="123" />
                    </div>
                    <div class="form-group">
                        <label>Kart Sahibi</label>
                        <input type="text" value="Test Kullanıcı" />
                    </div>
                    <p><strong>Tutar:</strong> ${data.price} ${data.currency}</p>
                    <button onclick="completePayment()">💳 Ödemeyi Tamamla</button>
                </div>
                <script>
                    function completePayment() {
                        alert('✅ Test ödeme başarılı!');
                        window.opener.postMessage({type: 'payment_success', amount: '${data.price}', currency: '${data.currency}'}, '*');
                        window.close();
                    }
                </script>
            </body>
            </html>
        `;
    }

    // Ödeme verilerini hazırla
    preparePaymentData(selectedCurrency, selectedAmount, selectedGold) {
        let amount, currency, basketItems;

        if (selectedCurrency === 'gold') {
            // Altın için örnek fiyatlar (gerçek uygulamada API'den çekilmeli)
            const goldPrices = {
                'gram': 1800,
                'ceyrek': 450,
                'trabzon': 900,
                'yarim': 900
            };
            amount = goldPrices[selectedGold];
            currency = 'TRY';
            basketItems = [{
                id: 'GOLD_' + selectedGold.toUpperCase(),
                name: this.getGoldName(selectedGold),
                category1: 'Altın',
                itemType: 'PHYSICAL',
                price: amount
            }];
        } else {
            amount = selectedAmount;
            currency = selectedCurrency === 'tl' ? 'TRY' : selectedCurrency.toUpperCase();
            basketItems = [{
                id: 'WEDDING_GIFT',
                name: 'Düğün Hediyesi',
                category1: 'Hediye',
                itemType: 'VIRTUAL',
                price: amount
            }];
        }

        // Örnek müşteri bilgileri (gerçek uygulamada form'dan alınmalı)
        const buyer = {
            id: 'GUEST_' + Date.now(),
            name: 'Misafir',
            surname: 'Kullanıcı',
            gsmNumber: '+905350000000',
            email: 'guest@wedding.com',
            identityNumber: '74300864791',
            lastLoginDate: new Date().toISOString().split('T')[0] + ' 12:00:00',
            registrationDate: new Date().toISOString().split('T')[0] + ' 12:00:00',
            registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            ip: '85.34.78.112',
            city: 'Istanbul',
            country: 'Turkey',
            zipCode: '34732'
        };

        const address = {
            contactName: 'Ceyda & Emre',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34732'
        };

        return {
            amount: amount,
            currency: currency,
            buyer: buyer,
            shippingAddress: address,
            billingAddress: address,
            basketItems: basketItems
        };
    }

    getGoldName(goldType) {
        const goldNames = {
            'gram': 'Gram Altın',
            'ceyrek': 'Çeyrek Altın',
            'trabzon': 'Trabzon Burması',
            'yarim': 'Yarım Gram Altın'
        };
        return goldNames[goldType] || 'Altın';
    }

    // Ödeme formunu aç
    openPaymentForm(checkoutFormContent) {
        // iyzico'nun sağladığı popup'ı aç
        if (checkoutFormContent) {
            const popup = window.open('', 'iyzico', 'width=600,height=600');
            popup.document.write(checkoutFormContent);
        }
    }
}

// Global olarak kullanılabilir hale getir
window.WeddingPayment = WeddingPayment;
