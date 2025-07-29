// Email Notification Service
// Her ödeme sonrası otomatik email gönderimi

class EmailNotificationService {
    constructor() {
        // ✅ HEDEF EMAIL ADRESİ
        this.adminEmail = 'inci.bilim00@gmail.com';
        
        // EmailJS konfigürasyonu (bedava email servisi)
        this.emailServiceUrl = 'https://api.emailjs.com/api/v1.0/email/send';
        this.serviceId = 'service_wedding_payments';
        this.templateId = 'template_payment_notification';
        this.publicKey = 'YOUR_EMAILJS_PUBLIC_KEY'; // EmailJS'den alacaksınız
    }

    // Ödeme başarılı bildirimi gönder
    async sendPaymentNotification(paymentData) {
        const emailData = {
            to_email: this.adminEmail,
            subject: '💰 Yeni Wedding Hediye Ödemesi Alındı!',
            amount: paymentData.amount,
            currency: paymentData.currency,
            payment_type: paymentData.paymentType,
            guest_email: paymentData.guestEmail || 'Belirtilmemiş',
            timestamp: new Date().toLocaleString('tr-TR'),
            transaction_id: paymentData.transactionId,
            conversation_id: paymentData.conversationId
        };

        try {
            // EmailJS ile email gönder
            const response = await this.sendEmailViaEmailJS(emailData);
            console.log('✅ Email bildirim gönderildi:', response);
            return response;
        } catch (error) {
            console.error('❌ Email gönderme hatası:', error);
            // Fallback: Webhook ile gönder
            return await this.sendEmailViaWebhook(emailData);
        }
    }

    // EmailJS ile email gönder
    async sendEmailViaEmailJS(emailData) {
        const templateParams = {
            to_email: emailData.to_email,
            subject: emailData.subject,
            message: this.createEmailTemplate(emailData)
        };

        const response = await fetch(this.emailServiceUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: this.serviceId,
                template_id: this.templateId,
                user_id: this.publicKey,
                template_params: templateParams
            })
        });

        return await response.json();
    }

    // Email template oluştur
    createEmailTemplate(data) {
        return `
🎉 YENİ DÜVİN HEDİYESİ ALINDI!

💰 Ödeme Detayları:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 Tutar: ${data.amount} ${data.currency}
🎁 Tip: ${data.payment_type}
📧 Misafir Email: ${data.guest_email}
🆔 İşlem No: ${data.transaction_id}
⏰ Tarih: ${data.timestamp}

🏦 Para 1-2 iş günü içinde hesabınıza yatırılacaktır.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ceyda & Emre Wedding Payment System 💝
        `;
    }

    // Webhook alternatifi (backend gerekli)
    async sendEmailViaWebhook(emailData) {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            return await response.json();
        } catch (error) {
            console.error('Webhook email hatası:', error);
            // Son çare: localStorage'a kaydet (manuel takip için)
            this.saveToLocalStorage(emailData);
        }
    }

    // Offline kayıt (internet bağlantısı olmadığında)
    saveToLocalStorage(emailData) {
        const payments = JSON.parse(localStorage.getItem('pending_notifications') || '[]');
        payments.push({
            ...emailData,
            saved_at: new Date().toISOString()
        });
        localStorage.setItem('pending_notifications', JSON.stringify(payments));
        
        console.log('📱 Email bildirimi offline kaydedildi');
    }

    // Bekleyen bildirimleri gönder
    async sendPendingNotifications() {
        const pending = JSON.parse(localStorage.getItem('pending_notifications') || '[]');
        
        for (const notification of pending) {
            try {
                await this.sendEmailViaEmailJS(notification);
                console.log('✅ Bekleyen bildirim gönderildi');
            } catch (error) {
                console.error('❌ Bekleyen bildirim hatası:', error);
            }
        }
        
        // Başarılı gönderimleri temizle
        localStorage.removeItem('pending_notifications');
    }
}

// Global kullanım için
window.EmailNotificationService = EmailNotificationService;
