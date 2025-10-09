<?php
require __DIR__ . '/../../global/PHPMailer-master/src/PHPMailer.php';
require __DIR__ . '/../../global/PHPMailer-master/src/SMTP.php';
require __DIR__ . '/../../global/PHPMailer-master/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$config = include __DIR__ . '/../config.php';

$mail = new PHPMailer(true);
$mail->SMTPDebug = 3; // verbose output
$mail->isSMTP();
$mail->Host       = $config['smtp_host'] ?? 'smtp.gmail.com';
$mail->SMTPAuth   = true;
$mail->Username   = $config['smtp_username'];
$mail->Password   = $config['smtp_password'];
$mail->SMTPSecure = $config['smtp_secure'] ?? PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port       = $config['smtp_port'] ?? 587;

$mail->setFrom($config['smtp_username'], 'Container test');
$mail->addAddress($config['smtp_username']);
$mail->Subject = 'PHPMailer test from container';
$mail->Body    = 'Testing outbound mail connectivity from the container.';

try {
    $mail->send();
    echo "✅  Mail sent successfully\n";
} catch (Exception $e) {
    echo "❌  Mail failed: {$mail->ErrorInfo}\n";
}