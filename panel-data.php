<?php
// panel-data.php — comprueba el inicio de sesión con Google y devuelve los leads.
// El navegador manda el "id_token" que entrega Google al iniciar sesión; este
// fichero se lo valida directamente a Google (nunca confía en lo que diga el
// navegador) y solo si el email viene en panel-config.php devuelve los datos.

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function out($arr, $code = 200) { http_response_code($code); echo json_encode($arr, JSON_UNESCAPED_UNICODE); exit; }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { out(['ok' => false, 'reason' => 'method'], 405); }

// --- Guard de mismo origen ---
$host = strtolower($_SERVER['HTTP_HOST'] ?? '');
$srcv = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($srcv !== '') {
  $srcHost = strtolower((string) parse_url($srcv, PHP_URL_HOST));
  if ($srcHost === '' || $srcHost !== $host) { out(['ok' => false, 'reason' => 'origin'], 403); }
}

// --- Rate limit ligero por IP ---
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$tmp = sys_get_temp_dir();
$now = time();
$rlFile = $tmp . '/nexum_panel_' . md5($ip) . '.json';
$stamps = is_file($rlFile) ? json_decode(@file_get_contents($rlFile), true) : [];
if (!is_array($stamps)) $stamps = [];
$inMin = array_filter($stamps, function ($t) use ($now) { return $t > $now - 60; });
if (count($inMin) >= 20) { out(['ok' => false, 'reason' => 'rate'], 429); }
$stamps[] = $now;
@file_put_contents($rlFile, json_encode(array_values(array_slice($stamps, -100))), LOCK_EX);

// --- Leer el token que manda el navegador ---
$in = json_decode(file_get_contents('php://input'), true);
$idToken = is_array($in) ? trim((string) ($in['id_token'] ?? '')) : '';
if ($idToken === '') { out(['ok' => false, 'reason' => 'sin_token'], 401); }

// --- Validar el token directamente contra Google ---
function google_tokeninfo($idToken) {
  $url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($idToken);
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($body === false || $code !== 200) return null;
    return json_decode($body, true);
  }
  $body = @file_get_contents($url, false, stream_context_create(['http' => ['timeout' => 8]]));
  if ($body === false) return null;
  return json_decode($body, true);
}

$info = google_tokeninfo($idToken);
if (!is_array($info) || empty($info['email']) || ($info['email_verified'] ?? 'false') !== 'true') {
  out(['ok' => false, 'reason' => 'token_invalido'], 401);
}

$email = strtolower(trim((string) $info['email']));

// --- Comprobar que el email está autorizado ---
$config = is_file(__DIR__ . '/panel-config.php') ? include __DIR__ . '/panel-config.php' : [];
$owners = array_map('strtolower', $config['owners'] ?? []);
if (!in_array($email, $owners, true)) { out(['ok' => false, 'reason' => 'no_autorizado'], 403); }

// --- Leer los leads guardados por lead.php ---
function leer_jsonl($path) {
  if (!is_file($path)) return [];
  $out = [];
  foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    $row = json_decode($line, true);
    if (is_array($row)) $out[] = $row;
  }
  return $out;
}

$candidatos = [__DIR__ . '/../nexum_leads/leads.jsonl', __DIR__ . '/datos/leads.jsonl'];
$leads = [];
foreach ($candidatos as $c) { $leads = array_merge($leads, leer_jsonl($c)); }

// Más recientes primero, máximo 500
usort($leads, function ($a, $b) { return strcmp($b['fecha'] ?? '', $a['fecha'] ?? ''); });
$leads = array_slice($leads, 0, 500);

out(['ok' => true, 'email' => $email, 'leads' => $leads]);
