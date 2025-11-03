<?php
session_start();
include_once("connect.php");

if (!isset($_SESSION["adm"])) {
    header("location: login.php");
    exit();
}

$destacarCidade = null;

// Pega os países para o select
$paises = $con->query("SELECT id_pais, nome FROM paises ORDER BY nome");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $acao = $_POST['acao'] ?? '';
    $id_cidade = $_POST['id_cidade'] ?? '';
    $nome = trim($_POST['nome'] ?? '');
    $populacao = $_POST['populacao'] ?? '';
    $pais_id = $_POST['pais_id'] ?? '';

    switch ($acao) {
        case 'c': // CREATE
            if (empty($nome) || empty($populacao) || empty($pais_id)) {
                $_SESSION["aviso"] = "Todos os campos devem ser preenchidos!";
            } else {
                $stmt = $con->prepare("INSERT INTO cidades (nome, populacao, pais_id) VALUES (?, ?, ?)");
                $stmt->bind_param("sii", $nome, $populacao, $pais_id);

                if ($stmt->execute()) {
                    $_SESSION["aviso"] = "Cidade cadastrada com sucesso!";
                } else {
                    $_SESSION["aviso"] = "Erro ao cadastrar cidade: " . $stmt->error;
                }
                $stmt->close();
            }
            header("Location: cidades.php");
            exit();

        case 'u': // UPDATE
            if (empty($id_cidade) || empty($nome) || empty($populacao) || empty($pais_id)) {
                $_SESSION["aviso"] = "Todos os campos devem ser preenchidos!";
            } else {
                $stmt = $con->prepare("UPDATE cidades SET nome=?, populacao=?, pais_id=? WHERE id_cidade=?");
                $stmt->bind_param("siii", $nome, $populacao, $pais_id, $id_cidade);

                if ($stmt->execute()) {
                    $_SESSION["aviso"] = "Cidade atualizada com sucesso!";
                } else {
                    $_SESSION["aviso"] = "Erro ao atualizar cidade: " . $stmt->error;
                }
                $stmt->close();
            }
            header("Location: cidades.php");
            exit();

        case 'd': // DELETE
            if (!empty($id_cidade)) {
                $stmt = $con->prepare("DELETE FROM cidades WHERE id_cidade = ?");
                $stmt->bind_param("i", $id_cidade);
                if ($stmt->execute()) {
                    $_SESSION["aviso"] = "Cidade excluída com sucesso.";
                } else {
                    $_SESSION["aviso"] = "Erro ao excluir cidade: " . $stmt->error;
                }
                $stmt->close();
            } else {
                $_SESSION["aviso"] = "ID da cidade não informado para exclusão.";
            }
            header("Location: cidades.php");
            exit();

        case 'r': // READ
            if (!empty($id_cidade)) {
                $stmt = $con->prepare("SELECT * FROM cidades WHERE id_cidade = ?");
                $stmt->bind_param("i", $id_cidade);
                $stmt->execute();
                $res = $stmt->get_result();

                if ($res && $res->num_rows > 0) {
                    $destacarCidade = $res->fetch_assoc();
                    $_SESSION["aviso"] = "Cidade encontrada!";
                } else {
                    $_SESSION["aviso"] = "Cidade não encontrada!";
                }
                $stmt->close();
            } else {
                $_SESSION["aviso"] = "ID da cidade não fornecido!";
            }
            break;
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Gerenciar Cidades</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

<?php include('includes/header_adm.php'); ?>

<main>
    <h1>Painel de Cidades</h1>

    <div class="admin-container">
        <div class="form-container">
            <h2>Gerenciar Cidades</h2>
            <form id="f" method="post" action="cidades.php">
                <input type="number" name="id_cidade" placeholder="ID da Cidade" value="<?php echo $destacarCidade['id_cidade'] ?? ''; ?>"><br>
                <input type="text" name="nome" placeholder="Nome da Cidade" value="<?php echo htmlspecialchars($destacarCidade['nome'] ?? ''); ?>"><br>
                <input type="number" name="populacao" placeholder="População" value="<?php echo $destacarCidade['populacao'] ?? ''; ?>"><br>

                <select name="pais_id" required>
                    <option value="">Selecione o País</option>
                    <?php
                    $paises = $con->query("SELECT id_pais, nome FROM paises ORDER BY nome");
                    if ($paises && $paises->num_rows > 0) {
                        while ($pais = $paises->fetch_assoc()) {
                            $selected = ($destacarCidade && $pais['id_pais'] == $destacarCidade['pais_id']) ? 'selected' : '';
                            echo "<option value='{$pais['id_pais']}' $selected>{$pais['nome']}</option>";
                        }
                    }
                    ?>
                </select><br>

                <input type="hidden" name="acao" id="acao"><br>

                <input type="button" value="Criar" onclick="submeterForm('c')">
                <input type="button" value="Consultar" onclick="submeterForm('r')">
                <input type="button" value="Atualizar" onclick="submeterForm('u')">
                <input type="button" value="Deletar" onclick="submeterForm('d')">
            </form>
        </div>

        <div class="table-container">
            <h2>Cidades Cadastradas</h2>
            <?php
            $res = $con->query("SELECT c.id_cidade, c.nome AS cidade, c.populacao, p.nome AS pais 
                                FROM cidades c
                                JOIN paises p ON c.pais_id = p.id_pais
                                ORDER BY c.nome");

            if ($res && $res->num_rows > 0) {
                echo "<table>";

                if (isset($_SESSION["aviso"])) {
                    echo "<p>" . $_SESSION["aviso"] . "</p>";
                    unset($_SESSION["aviso"]);
                }

                echo "<tr><th>ID</th><th>Nome</th><th>População</th><th>País</th></tr>";
                while ($campo = $res->fetch_assoc()) {
                    $highlight = ($destacarCidade && $campo['id_cidade'] == $destacarCidade['id_cidade']) ? 'class="highlight"' : '';
                    echo "<tr $highlight>";
                    echo "<td>{$campo['id_cidade']}</td>";
                    echo "<td>" . htmlspecialchars($campo['cidade']) . "</td>";
                    echo "<td>" . number_format($campo['populacao']) . "</td>";
                    echo "<td>" . htmlspecialchars($campo['pais']) . "</td>";
                    echo "</tr>";
                }
                echo "</table>";
            } else {
                echo "<p>Nenhuma cidade cadastrada.</p>";
            }
            ?>
        </div>
    </div>

    <br>
    <a href="admin.php">Voltar</a>
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
