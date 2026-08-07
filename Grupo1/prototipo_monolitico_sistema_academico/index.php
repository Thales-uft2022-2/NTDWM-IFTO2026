<?php
$pageTitle = 'Acadêmico Monolítico | Início';
$basePath = '';
require 'partials_header.php';
?>
<section class="hero">
    <div class="container hero-grid">
        <div class="hero-content">
            <span class="eyebrow">06/08 • Grupo 1 • Sistemas Monolíticos</span>
            <h1>Protótipo de <span>Sistema Acadêmico Monolítico</span></h1>
            <p>
                Aplicação acadêmica desenvolvida como uma única unidade, reunindo
                interface, regras de negócio e acesso ao banco de dados no mesmo projeto.
            </p>
            <div class="hero-buttons">
                <a class="btn btn-primary" href="dashboard.php">Abrir protótipo</a>
                <a class="btn btn-outline" href="arquitetura.php">Ver arquitetura</a>
            </div>
            <div class="tech-list">
                <span>PHP</span><span>HTML5</span><span>CSS3</span><span>JavaScript</span><span>MySQL</span>
            </div>
        </div>

        <div class="architecture-preview">
            <div class="preview-title">Arquitetura em camadas</div>
            <div class="preview-layer">
                <strong>🖥️ Interface</strong>
                <small>HTML • CSS • JavaScript</small>
            </div>
            <div class="preview-arrow">↓</div>
            <div class="preview-layer">
                <strong>⚙️ Lógica de negócio</strong>
                <small>PHP</small>
            </div>
            <div class="preview-arrow">↓</div>
            <div class="preview-layer">
                <strong>🗄️ Banco de dados</strong>
                <small>MySQL</small>
            </div>
            <p>Todos os módulos pertencem à mesma aplicação.</p>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="section-heading">
            <span>DEMONSTRAÇÃO</span>
            <h2>Funcionalidades do protótipo</h2>
            <p>Um sistema pequeno, funcional e adequado para demonstrar o acoplamento de uma arquitetura monolítica.</p>
        </div>

        <div class="feature-grid">
            <a class="feature-card" href="alunos/index.php">
                <div class="feature-icon">👨‍🎓</div>
                <h3>Alunos</h3>
                <p>Cadastrar, listar, editar e excluir alunos.</p>
                <strong>Acessar módulo →</strong>
            </a>

            <a class="feature-card" href="disciplinas/index.php">
                <div class="feature-icon">📚</div>
                <h3>Disciplinas</h3>
                <p>Gerenciar disciplinas e suas cargas horárias.</p>
                <strong>Acessar módulo →</strong>
            </a>

            <a class="feature-card" href="matriculas/index.php">
                <div class="feature-icon">📝</div>
                <h3>Matrículas</h3>
                <p>Relacionar alunos às disciplinas disponíveis.</p>
                <strong>Acessar módulo →</strong>
            </a>

            <a class="feature-card" href="dashboard.php">
                <div class="feature-icon">📊</div>
                <h3>Dashboard</h3>
                <p>Acompanhar os principais números da aplicação.</p>
                <strong>Acessar módulo →</strong>
            </a>
        </div>
    </div>
</section>

<section class="section section-alt">
    <div class="container explanation">
        <div>
            <span class="eyebrow">ESTUDO DE CASO</span>
            <h2>Por que este sistema é monolítico?</h2>
        </div>
        <p>
            Os módulos de alunos, disciplinas, matrículas e dashboard utilizam o mesmo
            projeto PHP, o mesmo banco de dados e são publicados juntos. Não existem
            microsserviços independentes. Isso facilita o desenvolvimento inicial, mas
            aumenta o acoplamento à medida que a aplicação cresce.
        </p>
    </div>
</section>
<?php require 'partials_footer.php'; ?>