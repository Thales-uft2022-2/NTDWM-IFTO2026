<?php
require 'config/database.php';

$pageTitle = 'Dashboard | Acadêmico Monolítico';
$basePath = '';

$totalAlunos = $pdo->query("SELECT COUNT(*) FROM alunos")->fetchColumn();
$totalDisciplinas = $pdo->query("SELECT COUNT(*) FROM disciplinas")->fetchColumn();
$totalMatriculas = $pdo->query("SELECT COUNT(*) FROM matriculas")->fetchColumn();

$ultimas = $pdo->query("
    SELECT m.id, a.nome AS aluno, d.nome AS disciplina, m.data_matricula
    FROM matriculas m
    JOIN alunos a ON a.id = m.aluno_id
    JOIN disciplinas d ON d.id = m.disciplina_id
    ORDER BY m.id DESC LIMIT 5
")->fetchAll();

require 'partials_header.php';
?>
<section class="page-header">
    <div class="container">
        <span class="eyebrow">VISÃO GERAL</span>
        <h1>Dashboard</h1>
        <p>Dados centralizados da aplicação monolítica.</p>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="stats-grid">
            <div class="stat-card"><span>👨‍🎓</span><strong><?= $totalAlunos ?></strong><small>Alunos cadastrados</small></div>
            <div class="stat-card"><span>📚</span><strong><?= $totalDisciplinas ?></strong><small>Disciplinas</small></div>
            <div class="stat-card"><span>📝</span><strong><?= $totalMatriculas ?></strong><small>Matrículas</small></div>
        </div>

        <div class="panel">
            <div class="panel-header"><h2>Últimas matrículas</h2></div>
            <div class="table-responsive">
                <table>
                    <thead><tr><th>Aluno</th><th>Disciplina</th><th>Data</th></tr></thead>
                    <tbody>
                    <?php if (!$ultimas): ?>
                        <tr><td colspan="3" class="empty">Nenhuma matrícula realizada.</td></tr>
                    <?php else: foreach ($ultimas as $m): ?>
                        <tr>
                            <td><?= htmlspecialchars($m['aluno']) ?></td>
                            <td><?= htmlspecialchars($m['disciplina']) ?></td>
                            <td><?= date('d/m/Y H:i', strtotime($m['data_matricula'])) ?></td>
                        </tr>
                    <?php endforeach; endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>
<?php require 'partials_footer.php'; ?>