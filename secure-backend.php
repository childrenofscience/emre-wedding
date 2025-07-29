<?php
/**
 * GÜVENLİ iyzico Backend Entegrasyonu
 * Gerçek para transferi için kullanın
 */

// Çevre değişkenlerinden API bilgilerini al (güvenlik)
$apiKey = $_ENV['IYZICO_API_KEY'] ?? 'BURAYA_API_KEY';
$secretKey = $_ENV['IYZICO_SECRET_KEY'] ?? 'BURAYA_SECRET_KEY';

// Test/Canlı ortam seçimi
$isProduction = $_ENV['IYZICO_PRODUCTION'] ?? false;
$baseUrl = $isProduction 
    ? 'https://api.iyzipay.com'          // CANLI - Gerçek para
    : 'https://sandbox-api.iyzipay.com'; // TEST - Para çekilmez

class SecureIyzicoPayment {
    private $apiKey;
    private $secretKey;
    private $baseUrl;

    public function __construct($apiKey, $secretKey, $baseUrl) {
        $this->apiKey = $apiKey;
        $this->secretKey = $secretKey;
        $this->baseUrl = $baseUrl;
    }

    public function createPayment($paymentData) {
        // Güvenlik: Input validation
        $this->validatePaymentData($paymentData);
        
        // iyzico API çağrısı
        $response = $this->makeApiCall('/payment/iyzipos/checkoutform/initialize/auth/ecom', $paymentData);
        
        // Ödeme logunu kaydet
        $this->logPayment($paymentData, $response);
        
        return $response;
    }

    private function validatePaymentData($data) {
        if (!isset($data['price']) || $data['price'] <= 0) {
            throw new Exception('Geçersiz ödeme tutarı');
        }
        
        if (!isset($data['buyer']['email']) || !filter_var($data['buyer']['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Geçersiz email adresi');
        }
        
        // Daha fazla validasyon...
    }

    private function logPayment($request, $response) {
        $logData = [
            'timestamp' => date('Y-m-d H:i:s'),
            'amount' => $request['price'],
            'currency' => $request['currency'],
            'status' => $response['status'] ?? 'unknown',
            'conversation_id' => $request['conversationId'],
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
        ];
        
        // Veritabanına kaydet
        // $this->saveToDatabase($logData);
        
        // Log dosyasına kaydet
        file_put_contents('payment_logs.json', json_encode($logData) . "\n", FILE_APPEND | LOCK_EX);
    }

    private function makeApiCall($endpoint, $data) {
        $request = json_encode($data);
        $randomString = $this->generateRandomString();
        $signature = $this->generateSignature($request, $randomString);

        $headers = [
            'Authorization: IYZWS ' . $this->apiKey . ':' . $signature,
            'Content-Type: application/json',
            'x-iyzi-rnd: ' . $randomString,
            'x-iyzi-client-version: iyzipay-php-2.0.0'
        ];

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->baseUrl . $endpoint,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $request,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => true, // Güvenlik
            CURLOPT_TIMEOUT => 30
        ]);

        $response = curl_exec($ch);
        
        if (curl_error($ch)) {
            throw new Exception('cURL Error: ' . curl_error($ch));
        }
        
        curl_close($ch);
        
        return json_decode($response, true);
    }

    private function generateSignature($request, $randomString) {
        $hashStr = $this->apiKey . $randomString . $this->secretKey . $request;
        return base64_encode(sha1($hashStr, true));
    }

    private function generateRandomString($length = 10) {
        return substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)))), 1, $length);
    }
}

// API endpoint
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $payment = new SecureIyzicoPayment($apiKey, $secretKey, $baseUrl);
        $input = json_decode(file_get_contents('php://input'), true);
        
        $result = $payment->createPayment($input);
        
        header('Content-Type: application/json');
        echo json_encode($result);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
