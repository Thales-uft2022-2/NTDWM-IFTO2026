<?php
if (!isset($pageTitle)) $pageTitle = 'Acadêmico Monolítico';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Protótipo de Sistema Acadêmico com Arquitetura Monolítica">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    <link rel="stylesheet" href="<?= $basePath ?? '' ?>assets/css/style.css">
</head>
<body>
<header class="header">
    <div class="container nav">
        <a class="logo" href="<?= $basePath ?? '' ?>index.php">
            <span class="logo-icon">🎓</span>
            <span>Acadêmico <b>Monolítico</b></span>
        </a>

        <button class="menu-toggle" id="menuToggle" aria-label="Abrir menu">☰</button>

        <nav id="mainMenu">
            <a href="<?= $basePath ?? '' ?>index.php">Início</a>
            <a href="<?= $basePath ?? '' ?>dashboard.php">Dashboard</a>
            <a href="<?= $basePath ?? '' ?>alunos/index.php">Alunos</a>
            <a href="<?= $basePath ?? '' ?>disciplinas/index.php">Disciplinas</a>
            <a href="<?= $basePath ?? '' ?>matriculas/index.php">Matrículas</a>
            <a href="<?= $basePath ?? '' ?>arquitetura.php">Arquitetura</a>
        </nav>
    </div>
</header>
<main>