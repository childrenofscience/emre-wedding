<?php
/**
 * Wedding Payment Backend
 * iyzico Test Integration
 * 
 * Bu dosya gerçek uygulamada kullanılacak backend kodunun örneğidir.
 * API key'leri güvenli bir şekilde saklar ve ödeme işlemlerini yönetir.
 */

// CORS başlıkları (test için)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// OPTIONS isteği için
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// iyzico konfigürasyonu
define('IYZICO_API_KEY', 'sandbox-your-api-key');
define('IYZICO_SECRET_KEY', 'sandbox-your-secret-key');
define('IYZICO_BASE_URL', 'https://sandbox-api.iyzipay.com');

class IyzicoPayment {
    private $apiKey;
    private $secretKey;
    private $baseUrl;

    public function __construct() {
        $this->apiKey = IYZICO_API_KEY;
        $this->secretKey = IYZICO_SECRET_KEY;
        $this->baseUrl = IYZICO_BASE_URL;
    }

    public function createCheckoutForm($requestData) {
        $url = $this->baseUrl . '/payment/iyzipos/checkoutform/initialize/auth/ecom';
        
        $request = json_encode($requestData);
        $randomString = $this->generateRandomString();
        $signature = $this->generateSignature($request, $randomString);

        $headers = [
            'Authorization: IYZWS ' . $this->apiKey . ':' . $signature,
            'Content-Type: application/json',
            'x-iyzi-rnd: ' . $randomString,
            'x-iyzi-client-version: iyzipay-php-2.0.0'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($ch);
        
        if (curl_error($ch)) {
            throw new Exception('cURL Error: ' . curl_error($ch));
        }
        
        curl_close($ch);
        
        return json_decode($response, true);
    }

    private function generateRandomString($length = 10) {
        return substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)))), 1, $length);
    }

    private function generateSignature($request, $randomString) {
        $hashStr = $this->apiKey . $randomString . $this->secretKey . $request;
        return base64_encode(sha1($hashStr, true));
    }
}

// Ana işlem
try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            throw new Exception('Invalid JSON input');
        }

        $payment = new IyzicoPayment();
        $result = $payment->createCheckoutForm($input);

        // Log ödeme isteği (gerçek uygulamada veritabanına kaydet)
        $logData = [
            'timestamp' => date('Y-m-d H:i:s'),
            'request' => $input,
            'response' => $result,
            'conversation_id' => $input['conversationId'] ?? 'unknown'
        ];
        
        file_put_contents('payment_logs.json', json_encode($logData) . "\n", FILE_APPEND);

        echo json_encode($result);
    } else {
        echo json_encode(['error' => 'Only POST method allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
