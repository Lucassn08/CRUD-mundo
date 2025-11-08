<?php
session_start();
include_once("connect.php");

$sql = "SELECT c.cd_cidade, c.nome AS cidade, c.populacao, p.nome AS pais 
                                FROM tb_cidades c
                                JOIN tb_paises p ON c.id_pais = p.cd_pais
                                ORDER BY c.cd_cidade";

$destacarCidade = null;

// Pega os países para o select
$paises = $con->query("SELECT cd_pais, nome FROM tb_paises ORDER BY nome");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $acao = $_POST['acao'] ?? '';
    $nome = trim($_POST['nome'] ?? '');
    $populacao = $_POST['populacao'] ?? '';
    $pais_id = $_POST['id_pais'] ?? '';

    switch ($acao) {
        case 'c': // CREATE
            if (empty($nome) || empty($populacao) || empty($pais_id)) {
                $_SESSION["aviso"] = "Todos os campos devem ser preenchidos!";
            } else {
                
                $stmt = $con->prepare("INSERT INTO tb_cidades (nome, populacao, id_pais) VALUES (?, ?, ?)");
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
            if (empty($nome) || empty($populacao) || empty($pais_id)) {
                $_SESSION["aviso"] = "Todos os campos devem ser preenchidos!";
            } else {
                $stmt = $con->prepare("UPDATE tb_cidades SET nome=?, populacao=?, id_pais=? WHERE nome=?");
                $stmt->bind_param("siis", $nome, $populacao, $pais_id, $nome);

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
            if (!empty($nome)) {
                $stmt = $con->prepare("DELETE FROM tb_cidades WHERE nome = ?");
                $stmt->bind_param("s", $nome);
                if ($stmt->execute()) {
                    $_SESSION["aviso"] = "Cidade excluída com sucesso.";
                } else {
                    $_SESSION["aviso"] = "Erro ao excluir cidade: " . $stmt->error;
                }
                $stmt->close();
            } else {
                $_SESSION["aviso"] = "nome da cidade não informado para exclusão.";
            }
            header("Location: cidades.php");
            exit();

        case 'r': // READ
            if (!empty($nome)) {
                $sql = "SELECT c.cd_cidade, c.nome AS cidade, c.populacao, p.nome AS pais 
                                FROM tb_cidades c
                                JOIN tb_paises p ON c.id_pais = p.cd_pais
                                WHERE c.nome = '".$nome."'
                                ORDER BY c.cd_cidade";
                $stmt = $con->prepare("SELECT * FROM tb_cidades WHERE nome = ?");
                $stmt->bind_param("s", $nome);
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
                $_SESSION["aviso"] = "nome da cidade não fornecido!";
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
    <div class="admin-container">
        <div class="form-container">
            <h2>Gerenciar Cidades</h2>
            <form id="f" method="post" action="cidades.php">
                <input type="text" name="nome" placeholder="Nome da Cidade" value="<?php echo htmlspecialchars($destacarCidade['nome'] ?? ''); ?>"><br>
                <input type="number" name="populacao" min = "1" placeholder="População" value="<?php echo $destacarCidade['populacao'] ?? ''; ?>"><br>

                <select name="id_pais" required>
                    <option value="">Selecione o País</option>
                    <?php
                    $paises = $con->query("SELECT cd_pais, nome FROM tb_paises ORDER BY nome");
                    if ($paises && $paises->num_rows > 0) {
                        while ($pais = $paises->fetch_assoc()) {
                            $selected = ($destacarCidade && $pais['cd_pais'] == $destacarCidade['id_pais']) ? 'selected' : '';
                            echo "<option value='{$pais['cd_pais']}' $selected>{$pais['nome']}</option>";
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
            $res = $con->query($sql);

            if ($res && $res->num_rows > 0) {
                echo "<table>";

                if (isset($_SESSION["aviso"])) {
                    echo "<p>" . $_SESSION["aviso"] . "</p>";
                    unset($_SESSION["aviso"]);
                }

                echo "<tr><th>ID</th><th>Nome</th><th>População</th><th>País</th></tr>";
                while ($campo = $res->fetch_assoc()) {
                    $highlight = ($destacarCidade && $campo['cd_cidade'] == $destacarCidade['cd_cidade']) ? 'class="highlight"' : '';
                    echo "<tr $highlight>";
                    echo "<td>{$campo['cd_cidade']}</td>";
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

    
</main>

 <?php include('includes/footer.php'); ?>

<script>
    function submeterForm(acao) {
        document.getElementById('acao').value = acao;
        document.getElementById('f').submit();
    }
</script>

</body>
</html>
