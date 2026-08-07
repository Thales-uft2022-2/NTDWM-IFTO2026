<?php
$pageTitle = 'Arquitetura | Acadêmico Monolítico';
$basePath = '';
require 'partials_header.php';
?>
<section class="page-header">
    <div class="container">
        <span class="eyebrow">ESTUDO TEÓRICO</span>
        <h1>Arquitetura Monolítica</h1>
        <p>Conceito, características, vantagens, limitações e estudo de caso.</p>
    </div>
</section>

<section class="section">
<div class="container content-grid">
    <article class="panel">
        <h2>O que é uma aplicação monolítica?</h2>
        <p>
            É uma aplicação desenvolvida, executada e implantada como uma única unidade.
            Interface, regras de negócio, módulos e acesso ao banco de dados ficam integrados
            no mesmo sistema.
        </p>
    </article>

    <article class="panel">
        <h2>Principais características</h2>
        <ul class="check-list">
            <li>Uma única base de código.</li>
            <li>Módulos executados no mesmo processo.</li>
            <li>Banco de dados compartilhado.</li>
            <li>Implantação conjunta.</li>
            <li>Comunicação interna direta entre módulos.</li>
        </ul>
    </article>
</div>

<div class="container">
    <div class="architecture-full">
        <div class="arch-block interface">
            <span>CAMADA 1</span>
            <h3>🖥️ Interface</h3>
            <p>Página inicial • Dashboard • Alunos • Disciplinas • Matrículas</p>
            <small>HTML + CSS + JavaScript</small>
        </div>
        <div class="arch-link">↓ chamadas internas ↓</div>
        <div class="arch-block logic">
            <span>CAMADA 2</span>
            <h3>⚙️ Lógica de negócio</h3>
            <p>CRUD • Validações • Regras de matrícula • Consultas</p>
            <small>PHP</small>
        </div>
        <div class="arch-link">↓ PDO / SQL ↓</div>
        <div class="arch-block database">
            <span>CAMADA 3</span>
            <h3>🗄️ Banco de dados</h3>
            <p>alunos • disciplinas • matriculas</p>
            <small>MySQL</small>
        </div>
        <div class="monolith-label">UM ÚNICO SISTEMA / UMA ÚNICA IMPLANTAÇÃO</div>
    </div>
</div>
</section>

<section class="section section-alt">
<div class="container three-grid">
    <article class="info-card">
        <h3>✅ Vantagens</h3>
        <p>Simplicidade inicial, desenvolvimento rápido, implantação fácil, menor complexidade operacional e depuração mais direta.</p>
    </article>
    <article class="info-card">
        <h3>⚠️ Limitações</h3>
        <p>Maior acoplamento, dificuldade de escalar módulos isoladamente, manutenção mais complexa em sistemas grandes e implantação conjunta.</p>
    </article>
    <article class="info-card">
        <h3>🎯 Quando utilizar?</h3>
        <p>Projetos pequenos, MVPs, protótipos, trabalhos acadêmicos, sistemas internos e equipes pequenas.</p>
    </article>
</div>
</section>
<?php require 'partials_footer.php'; ?>