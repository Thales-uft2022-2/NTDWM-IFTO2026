<?php
require '../config/database.php';
$pageTitle = 'Alunos | Acadêmico Monolítico';
$basePath = '../';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = (int)($_POST['id'] ?? 0);
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $curso = trim($_POST['curso'] ?? '');

    if ($id > 0) {
        $stmt = $pdo->prepare("UPDATE alunos SET nome=?, email=?, curso=? WHERE id=?");
        $stmt->execute([$nome, $email, $curso, $id]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO alunos(nome,email,curso) VALUES(?,?,?)");
        $stmt->execute([$nome, $email, $curso]);
    }
    header('Location: index.php?ok=1'); exit;
}

if (isset($_GET['excluir'])) {
    $id = (int)$_GET['excluir'];
    $pdo->prepare("DELETE FROM matriculas WHERE aluno_id=?")->execute([$id]);
    $pdo->prepare("DELETE FROM alunos WHERE id=?")->execute([$id]);
    header('Location: index.php?deleted=1'); exit;
}

$edit = null;
if (isset($_GET['editar'])) {
    $stmt = $pdo->prepare("SELECT * FROM alunos WHERE id=?");
    $stmt->execute([(int)$_GET['editar']]);
    $edit = $stmt->fetch();
}

$alunos = $pdo->query("SELECT * FROM alunos ORDER BY id DESC")->fetchAll();
require '../partials_header.php';
?>
<section class="page-header"><div class="container"><span class="eyebrow">MÓDULO</span><h1>Alunos</h1><p>Cadastro e gerenciamento dos estudantes.</p></div></section>
<section class="section"><div class="container form-grid">
<div class="panel">
<h2><?= $edit ? 'Editar aluno' : 'Novo aluno' ?></h2>
<form method="post" class="form">
<input type="hidden" name="id" value="<?= $edit['id'] ?? '' ?>">
<label>Nome completo<input name="nome" required value="<?= htmlspecialchars($edit['nome'] ?? '') ?>"></label>
<label>E-mail<input type="email" name="email" required value="<?= htmlspecialchars($edit['email'] ?? '') ?>"></label>
<label>Curso<input name="curso" required value="<?= htmlspecialchars($edit['curso'] ?? '') ?>"></label>
<button class="btn btn-primary" type="submit"><?= $edit ? 'Salvar alterações' : 'Cadastrar aluno' ?></button>
</form>
</div>
<div class="panel">
<div class="panel-header"><h2>Alunos cadastrados</h2><span><?= count($alunos) ?> registro(s)</span></div>
<div class="table-responsive"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Curso</th><th>Ações</th></tr></thead><tbody>
<?php if (!$alunos): ?><tr><td colspan="4" class="empty">Nenhum aluno cadastrado.</td></tr>
<?php else: foreach ($alunos as $a): ?><tr>
<td><?= htmlspecialchars($a['nome']) ?></td><td><?= htmlspecialchars($a['email']) ?></td><td><?= htmlspecialchars($a['curso']) ?></td>
<td class="actions-table"><a href="?editar=<?= $a['id'] ?>">Editar</a><a class="delete" data-confirm="Excluir este aluno?" href="?excluir=<?= $a['id'] ?>">Excluir</a></td>
</tr><?php endforeach; endif; ?>
</tbody></table></div></div></div></section>
<?php require '../partials_footer.php'; ?>