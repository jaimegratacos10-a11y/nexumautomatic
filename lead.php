<?php
// lead.php — captura los leads del formulario de contacto y de la calculadora.
// Guarda cada lead en un fichero FUERA de public_html si es posible; si no, en
// datos/ (protegido por datos/.htaccess) dentro del propio sitio. El panel
// (panel.html + panel-data.php) es la única forma de leerlos.

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$PER_MIN = 8;   // envíos por IP y minuto
$PER_DAY = 80;  // envíos por IP y día

function out($arr) { echo json_encode($arr, JSON_UNESCAPED_UNICODE); exit; }

// --- Solo POST ---
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { http_response_code(405); out(['ok' => false, 'reason' => 'method']); }

// --- Guard de mismo origen ---
$host = strtolower($_SERVER['HTTP_HOST'] ?? '');
$srcv = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($srcv !== '') {
  $srcHost = strtolower((string) parse_url($srcv, PHP_URL_HOST));
  if ($srcHost === '' || $srcHost !== $host) { http_response_code(403); out(['ok' => false, 'reason' => 'origin']); }
}

// --- Rate limit por IP ---
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$tmp = sys_get_temp_dir();
$now = time();
$rlFile = $tmp . '/nexum_lead_' . md5($ip) . '.json';
$stamps = is_file($rlFile) ? json_decode(@file_get_contents($rlFile), true) : [];
if (!is_array($stamps)) $stamps = [];
$inMin = array_filter($stamps, function ($t) use ($now) { return $t > $now - 60; });
$inDay = array_filter($stamps, function ($t) use ($now) { return $t > $now - 86400; });
if (count($inMin) >= $PER_MIN) out(['ok' => false, 'reason' => 'rate_min']);
if (count($inDay) >= $PER_DAY) out(['ok' => false, 'reason' => 'rate_day']);

// --- Entrada ---
$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in)) $in = [];

function s($v, $max = 160) { return mb_substr(trim(is_scalar($v) ? (string) $v : ''), 0, $max); }

$origen = s($in['origen'] ?? '', 20);
if (!in_array($origen, ['contacto', 'calculadora'], true)) $origen = 'contacto';

$nombre = s($in['nombre'] ?? '', 80);
$email = s($in['email'] ?? '', 160);
if ($nombre === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  out(['ok' => false, 'reason' => 'datos']);
}

$telefono = preg_replace('/[^0-9+\s]/', '', s($in['telefono'] ?? '', 30));

$row = [
  'fecha'     => date('c'),
  'origen'    => $origen,
  'nombre'    => $nombre,
  'empresa'   => s($in['empresa'] ?? ''),
  'email'     => $email,
  'telefono'  => $telefono,
  'sector'    => s($in['sector'] ?? '', 60),
  'mensaje'   => s($in['mensaje'] ?? '', 600),
  'consultas' => s($in['consultas'] ?? '', 30),
  'ahorro'    => s($in['ahorro'] ?? '', 40),
  'ip'        => $ip,
  'ua'        => s($_SERVER['HTTP_USER_AGENT'] ?? '', 200),
];

// --- Elegir destino de escritura: fuera de public_html si se puede, si no datos/ ---
$fuera = __DIR__ . '/../nexum_leads';
$dentro = __DIR__ . '/datos';
$dir = null;
foreach ([$fuera, $dentro] as $c) {
  if (!is_dir($c)) { @mkdir($c, 0755, true); }
  if (is_dir($c) && is_writable($c)) { $dir = $c; break; }
}

$stored = false;
if ($dir !== null) {
  $jsonl = $dir . '/leads.jsonl';
  $csv   = $dir . '/leads.csv';

  if (@file_put_contents($jsonl, json_encode($row, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX) !== false) $stored = true;

  $newCsv = !is_file($csv);
  $fh = @fopen($csv, 'a');
  if ($fh) {
    if (flock($fh, LOCK_EX)) {
      if ($newCsv) fputcsv($fh, array_keys($row));
      fputcsv($fh, array_values($row));
      flock($fh, LOCK_UN);
      $stored = true;
    }
    fclose($fh);
  }
}

// Registrar el intento en el rate-limit (tras validar)
$stamps[] = $now;
$stamps = array_slice($stamps, -200);
@file_put_contents($rlFile, json_encode(array_values($stamps)), LOCK_EX);

out(['ok' => $stored]);
