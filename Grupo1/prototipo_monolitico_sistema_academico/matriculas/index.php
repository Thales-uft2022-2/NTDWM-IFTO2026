<?php
require '../config/database.php';
$pageTitle='Matrículas | Acadêmico Monolítico';
$basePath='../';

if($_SERVER['REQUEST_METHOD']==='POST'){
    try{
        $pdo->prepare("INSERT INTO matriculas(aluno_id,disciplina_id) VALUES(?,?)")
            ->execute([(int)$_POST['aluno_id'],(int)$_POST['disciplina_id']]);
        header('Location:index.php?ok=1');
    }catch(PDOException $e){
        header('Location:index.php?duplicada=1');
    }
    exit;
}
if(isset($_GET['excluir'])){
    $pdo->prepare("DELETE FROM matriculas WHERE id=?")->execute([(int)$_GET['excluir']]);
    header('Location:index.php?deleted=1');exit;
}

$alunos=$pdo->query("SELECT * FROM alunos ORDER BY nome")->fetchAll();
$disciplinas=$pdo->query("SELECT * FROM disciplinas ORDER BY nome")->fetchAll();
$matriculas=$pdo->query("SELECT m.id,a.nome aluno,d.nome disciplina,m.data_matricula FROM matriculas m JOIN alunos a ON a.id=m.aluno_id JOIN disciplinas d ON d.id=m.disciplina_id ORDER BY m.id DESC")->fetchAll();

require '../partials_header.php';
?>
<section class="page-header"><div class="container"><span class="eyebrow">MÓDULO</span><h1>Matrículas</h1><p>Relacionamento entre alunos e disciplinas.</p></div></section>
<section class="section"><div class="container form-grid">
<div class="panel"><h2>Nova matrícula</h2>
<?php if(!$alunos||!$disciplinas):?><div class="notice">Cadastre pelo menos um aluno e uma disciplina primeiro.</div>
<?php else:?><form method="post" class="form">
<label>Aluno<select name="aluno_id" required><?php foreach($alunos as $a):?><option value="<?=$a['id']?>"><?=htmlspecialchars($a['nome'])?></option><?php endforeach;?></select></label>
<label>Disciplina<select name="disciplina_id" required><?php foreach($disciplinas as $d):?><option value="<?=$d['id']?>"><?=htmlspecialchars($d['nome'])?></option><?php endforeach;?></select></label>
<button class="btn btn-primary">Realizar matrícula</button></form><?php endif;?>
<?php if(isset($_GET['duplicada'])):?><div class="notice warning">Esse aluno já está matriculado nessa disciplina.</div><?php endif;?>
</div>
<div class="panel"><div class="panel-header"><h2>Matrículas realizadas</h2><span><?=count($matriculas)?> registro(s)</span></div>
<div class="table-responsive"><table><thead><tr><th>Aluno</th><th>Disciplina</th><th>Data</th><th>Ação</th></tr></thead><tbody>
<?php if(!$matriculas):?><tr><td colspan="4" class="empty">Nenhuma matrícula realizada.</td></tr>
<?php else:foreach($matriculas as $m):?><tr><td><?=htmlspecialchars($m['aluno'])?></td><td><?=htmlspecialchars($m['disciplina'])?></td><td><?=date('d/m/Y',strtotime($m['data_matricula']))?></td>
<td><a class="delete" data-confirm="Remover esta matrícula?" href="?excluir=<?=$m['id']?>">Remover</a></td></tr><?php endforeach;endif;?>
</tbody></table></div></div></div></section>
<?php require '../partials_footer.php'; ?>