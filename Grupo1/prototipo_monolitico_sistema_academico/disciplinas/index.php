<?php
require '../config/database.php';
$pageTitle = 'Disciplinas | Acadêmico Monolítico';
$basePath = '../';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = (int)($_POST['id'] ?? 0);
    $nome = trim($_POST['nome'] ?? '');
    $carga = (int)($_POST['carga_horaria'] ?? 0);
    if ($id > 0) {
        $pdo->prepare("UPDATE disciplinas SET nome=?, carga_horaria=? WHERE id=?")->execute([$nome,$carga,$id]);
    } else {
        $pdo->prepare("INSERT INTO disciplinas(nome,carga_horaria) VALUES(?,?)")->execute([$nome,$carga]);
    }
    header('Location: index.php?ok=1'); exit;
}

if (isset($_GET['excluir'])) {
    $id=(int)$_GET['excluir'];
    $pdo->prepare("DELETE FROM matriculas WHERE disciplina_id=?")->execute([$id]);
    $pdo->prepare("DELETE FROM disciplinas WHERE id=?")->execute([$id]);
    header('Location: index.php?deleted=1'); exit;
}

$edit=null;
if(isset($_GET['editar'])){
    $s=$pdo->prepare("SELECT * FROM disciplinas WHERE id=?");$s->execute([(int)$_GET['editar']]);$edit=$s->fetch();
}
$disciplinas=$pdo->query("SELECT * FROM disciplinas ORDER BY id DESC")->fetchAll();
require '../partials_header.php';
?>
<section class="page-header"><div class="container"><span class="eyebrow">MÓDULO</span><h1>Disciplinas</h1><p>Cadastro das disciplinas ofertadas.</p></div></section>
<section class="section"><div class="container form-grid">
<div class="panel"><h2><?= $edit?'Editar disciplina':'Nova disciplina' ?></h2>
<form method="post" class="form"><input type="hidden" name="id" value="<?= $edit['id']??'' ?>">
<label>Nome da disciplina<input name="nome" required value="<?= htmlspecialchars($edit['nome']??'') ?>"></label>
<label>Carga horária<input type="number" min="1" name="carga_horaria" required value="<?= htmlspecialchars($edit['carga_horaria']??'') ?>"></label>
<button class="btn btn-primary"><?= $edit?'Salvar alterações':'Cadastrar disciplina' ?></button></form></div>
<div class="panel"><div class="panel-header"><h2>Disciplinas cadastradas</h2><span><?= count($disciplinas) ?> registro(s)</span></div>
<div class="table-responsive"><table><thead><tr><th>Disciplina</th><th>Carga horária</th><th>Ações</th></tr></thead><tbody>
<?php if(!$disciplinas):?><tr><td colspan="3" class="empty">Nenhuma disciplina cadastrada.</td></tr>
<?php else:foreach($disciplinas as $d):?><tr><td><?=htmlspecialchars($d['nome'])?></td><td><?=$d['carga_horaria']?>h</td>
<td class="actions-table"><a href="?editar=<?=$d['id']?>">Editar</a><a class="delete" data-confirm="Excluir esta disciplina?" href="?excluir=<?=$d['id']?>">Excluir</a></td></tr>
<?php endforeach;endif;?></tbody></table></div></div></div></section>
<?php require '../partials_footer.php'; ?>