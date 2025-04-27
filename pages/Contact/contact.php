<?php
// Validate and sanitize input
$name = filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING);
$email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
$message = htmlspecialchars(trim($_POST['message']));

// Spam honeypot check
if (!empty($_POST['website']) || !$name || !$email || empty($message)) {
    echo "Invalid submission.";
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Update these paths to reflect the actual location of PHPMailer
require '/var/www/html/global/PHPMailer-master/src/Exception.php';
require '/var/www/html/global/PHPMailer-master/src/PHPMailer.php';
require '/var/www/html/global/PHPMailer-master/src/SMTP.php';

// Load SMTP credentials from an external file
$config = require '/var/www/html/resources/config.php';

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;           // Enable SMTP authentication
    $mail->Username = $config['smtp_username']; // Load from config
    $mail->Password = $config['smtp_password']; // Load from config
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption, `PHPMailer::ENCRYPTION_SMTPS` for SSL
    $mail->Port = 587;                // TCP port to connect to

    // Set email fields
    $mail->setFrom('noreply@mathsheetgen.com', 'MathSheetGen Contact');
    $mail->addReplyTo($email, $name);
    $mail->addAddress('Derek.Dreblow@gmail.com');  // Add a recipient

    // Content
    $mail->isHTML(false);  // Set email format to plain text
    $mail->Subject = 'Dreblow Designs New contact message from ' . $name;
    $mail->Body    = "Name: $name\nEmail: $email\n\nMessage:\n$message";

    $mail->send();
    
    // Return a response for AJAX
    header("Location: /pages/Contact/thank-you.html");
    exit;
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>