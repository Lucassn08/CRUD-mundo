<?php
session_start();
include_once("connect.php");



$destacarPais = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $acao = $_POST['acao'] ?? '';
    $id_pais = $_POST['id_pais'] ?? '';
    $nome = trim($_POST['nome'] ?? '');
    $continente = trim($_POST['continente'] ?? '');
    $populacao = $_POST['populacao'] ?? '';
    $idioma = trim($_POST['idioma'] ?? '');

    switch ($acao) {
        case 'c': // CREATE
            if (empty($nome) || empty($continente) || empty($populacao) || empty($idioma)) {
                $_SESSION["aviso"] = "Todos os campos devem ser preenchidos!";
            } else {
                $stmt = $con->prepare("INSERT INTO tb_paises (nome, continente, populacao, idioma) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("ssis", $nome, $continente, $populacao, $idioma);

                if ($stmt->execute()) {
                    $_SESSION["aviso"] = "País cadastrado com sucesso!";
                } else {
                    $_SESSION["aviso"] = "Erro ao cadastrar país: " . $stmt->error;
                }
                $stmt->close();
            }
            header("Location: admin.php");
            exit();

        case 'u': // UPDATE
            if (empty($id_pais) || empty($nome) || empty($continente) || empty($populacao) || empty($idioma)) {
                $_SESSION["aviso"] = "Todos os campos devem ser preenchidos!";
            } else {
                $stmt = $con->prepare("UPDATE paises SET nome=?, continente=?, populacao=?, idioma=? WHERE id_pais=?");
                $stmt->bind_param("ssisi", $nome, $continente, $populacao, $idioma, $id_pais);

                if ($stmt->execute()) {
                    $_SESSION["aviso"] = "País atualizado com sucesso!";
                } else {
                    $_SESSION["aviso"] = "Erro ao atualizar país: " . $stmt->error;
                }
                $stmt->close();
            }
            header("Location: admin.php");
            exit();

        case 'd': // DELETE
            if (!empty($id_pais)) {
                $check = $con->prepare("SELECT COUNT(*) FROM tb_cidades WHERE id_pais = ?");
                $check->bind_param("i", $id_pais);
                $check->execute();
                $check->bind_result($qtd);
                $check->fetch();
                $check->close();

                if ($qtd > 0) {
                    $_SESSION["aviso"] = "Não é possível excluir. Existem $qtd cidade(s) vinculada(s) a este país.";
                } else {
                    $stmt = $con->prepare("DELETE FROM tb_paises WHERE cd_pais = ?");
                    $stmt->bind_param("i", $id_pais);
                    if ($stmt->execute()) {
                        $_SESSION["aviso"] = "País excluído com sucesso.";
                    } else {
                        $_SESSION["aviso"] = "Erro ao excluir país: " . $stmt->error;
                    }
                    $stmt->close();
                }
            } else {
                $_SESSION["aviso"] = "ID do país não informado para exclusão.";
            }
            header("Location: admin.php");
            exit();

        case 'r': // READ
            if (!empty($id_pais)) {
                $stmt = $con->prepare("SELECT * FROM tb_paises WHERE cd_pais = ?");
                $stmt->bind_param("i", $id_pais);
                $stmt->execute();
                $res = $stmt->get_result();

                if ($res && $res->num_rows > 0) {
                    $destacarPais = $res->fetch_assoc();
                    $_SESSION["aviso"] = "País encontrado!";
                } else {
                    $_SESSION["aviso"] = "País não encontrado!";
                }
                $stmt->close();
            } else {
                $_SESSION["aviso"] = "ID do país não fornecido!";
            }
            break;
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Painel do Administrador</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

<?php include('includes/header_adm.php'); ?>

<main>
    <h1>Painel do Administrador</h1>

    <div class="admin-container">
        <div class="form-container">
            <h2>Gerenciar Países</h2>
            <form id="f" method="post" action="admin.php">
                <input type="number" name="id_pais" placeholder="ID do País" required><br>
                <input type="text" name="nome" placeholder="Nome do País" required><br>
                <input type="text" name="continente" placeholder="Continente" required><br>
                <input type="number" name="populacao" placeholder="População" required><br>
                <input type="text" name="idioma" placeholder="Idioma" required><br>
                <input type="hidden" name="acao" id="acao"><br>
                <input type="button" value="Criar" onclick="submeterForm('c')">
                <input type="button" value="Consultar" onclick="submeterForm('r')">
                <input type="button" value="Atualizar" onclick="submeterForm('u')">
                <input type="button" value="Deletar" onclick="submeterForm('d')">
            </form>
        </div>

        <div class="table-container">
            <h2>Países Cadastrados</h2>
            <?php
            $res = $con->query("SELECT * FROM tb_paises");

            if ($res && $res->num_rows > 0) {
                echo "<table>";

                if (isset($_SESSION["aviso"])) {
                    echo "<p>" . $_SESSION["aviso"] . "</p>";
                    unset($_SESSION["aviso"]);
                }

                echo "<tr><th>ID</th><th>Nome</th><th>Continente</th><th>População</th><th>Idioma</th></tr>";
                while ($campo = $res->fetch_assoc()) {
                    $highlight = ($destacarPais && $campo['cd_pais'] == $destacarPais['cd_pais']) ? 'class="highlight"' : '';
                    echo "<tr $highlight>";
                    echo "<td>{$campo['cd_pais']}</td>";
                    echo "<td>{$campo['nome']}</td>";
                    echo "<td>{$campo['continente']}</td>";
                    echo "<td>" . number_format($campo['populacao']) . "</td>";
                    echo "<td>{$campo['idioma']}</td>";
                    echo "</tr>";
                }
                echo "</table>";
            } else {
                echo "<p>Nenhum país encontrado.</p>";
            }
            ?>
        </div>
    </div>

    <br>
    <a href="index.php">Voltar</a>
</main>

<footer>
    Loja Virtual - Desenvolvido por Luan Carvalho
</footer>

<script>
    function submeterForm(acao) {
        document.getElementById('acao').value = acao;
        document.getElementById('f').submit();
    }
</script>

</body>
</html>
