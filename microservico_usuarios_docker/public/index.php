<?php
require_once __DIR__ . '/../src/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$path = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

function respond(array $data, int $status=200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}
function body(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    if (!is_array($data)) respond(['erro'=>'JSON inválido.'], 400);
    return $data;
}

if ($path === '') respond([
    'servico'=>'Microserviço de Usuários',
    'status'=>'online',
    'endpoints'=>[
        'GET /api/usuarios',
        'GET /api/usuarios/{id}',
        'POST /api/usuarios',
        'PUT /api/usuarios/{id}',
        'DELETE /api/usuarios/{id}'
    ]
]);

if ($path === '/health') respond(['status'=>'ok','servico'=>'usuarios']);

if ($path === '/api/usuarios' && $method === 'GET') {
    $rows = $pdo->query("SELECT * FROM usuarios ORDER BY id DESC")->fetchAll();
    respond(['total'=>count($rows),'dados'=>$rows]);
}

if ($path === '/api/usuarios' && $method === 'POST') {
    $d = body();
    $nome = trim($d['nome'] ?? '');
    $email = trim($d['email'] ?? '');
    if (!$nome || !$email) respond(['erro'=>'nome e email são obrigatórios.'], 422);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(['erro'=>'E-mail inválido.'], 422);

    try {
        $st = $pdo->prepare("INSERT INTO usuarios(nome,email) VALUES(?,?)");
        $st->execute([$nome,$email]);
        $id = (int)$pdo->lastInsertId();
        $st = $pdo->prepare("SELECT * FROM usuarios WHERE id=?");
        $st->execute([$id]);
        respond(['mensagem'=>'Usuário criado com sucesso.','dados'=>$st->fetch()], 201);
    } catch (PDOException $e) {
        respond(['erro'=>'E-mail já cadastrado ou dados inválidos.'], 409);
    }
}

if (preg_match('#^/api/usuarios/(\d+)$#', $path, $m)) {
    $id = (int)$m[1];

    if ($method === 'GET') {
        $st = $pdo->prepare("SELECT * FROM usuarios WHERE id=?");
        $st->execute([$id]);
        $u = $st->fetch();
        if (!$u) respond(['erro'=>'Usuário não encontrado.'],404);
        respond(['dados'=>$u]);
    }

    if ($method === 'PUT') {
        $st = $pdo->prepare("SELECT * FROM usuarios WHERE id=?");
        $st->execute([$id]);
        $u = $st->fetch();
        if (!$u) respond(['erro'=>'Usuário não encontrado.'],404);

        $d = body();
        $nome = trim($d['nome'] ?? $u['nome']);
        $email = trim($d['email'] ?? $u['email']);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(['erro'=>'E-mail inválido.'],422);

        try {
            $st = $pdo->prepare("UPDATE usuarios SET nome=?,email=? WHERE id=?");
            $st->execute([$nome,$email,$id]);
            $st = $pdo->prepare("SELECT * FROM usuarios WHERE id=?");
            $st->execute([$id]);
            respond(['mensagem'=>'Usuário atualizado com sucesso.','dados'=>$st->fetch()]);
        } catch (PDOException $e) {
            respond(['erro'=>'Não foi possível atualizar.'],409);
        }
    }

    if ($method === 'DELETE') {
        $st = $pdo->prepare("DELETE FROM usuarios WHERE id=?");
        $st->execute([$id]);
        if ($st->rowCount() === 0) respond(['erro'=>'Usuário não encontrado.'],404);
        respond(['mensagem'=>'Usuário removido com sucesso.']);
    }
}
respond(['erro'=>'Endpoint não encontrado.'],404);
