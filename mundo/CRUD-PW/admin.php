<?php
session_start();
include_once("connect.php");

$sql = "SELECT * FROM tb_paises";

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
                $check = $con->prepare("SELECT COUNT(*) FROM tb_paises WHERE nome = ?");
                $check->bind_param("s", $nome);
                $check->execute();
                $check->bind_result($qtd);
                $check->fetch();
                $check->close();
                if($qtd == 0){
                    $stmt = $con->prepare("INSERT INTO tb_paises (nome, continente, populacao, idioma) VALUES (?, ?, ?, ?)");
                    $stmt->bind_param("ssis", $nome, $continente, $populacao, $idioma);
                    if ($stmt->execute()) {
                        $_SESSION["aviso"] = "País cadastrado com sucesso!";
                    } else {
                        $_SESSION["aviso"] = "Erro ao cadastrar país: " . $stmt->error;
                    }
                $stmt->close();
                } else{
                    $_SESSION["aviso"] = "País já cadastrado no sistema";
                }
                
            }
            header("Location: admin.php");
            exit();

        case 'u': // UPDATE
            if (empty($nome) || empty($continente) || empty($populacao) || empty($idioma)) {
                $_SESSION["aviso"] = "Todos os campos devem ser preenchidos!";
            } else {
                $stmt = $con->prepare("UPDATE tb_paises SET nome=?, continente=?, populacao=?, idioma=? WHERE nome=?");
                $stmt->bind_param("ssiss", $nome, $continente, $populacao, $idioma, $nome);

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
            if (!empty($nome)) {
                $idcatch = $con->prepare("SELECT cd_pais FROM tb_paises WHERE nome = ?");
                $idcatch->bind_param("s", $nome);
                $idcatch->execute();
                $idcatch->bind_result($cd_pais);
                $idcatch->fetch();
                $idcatch->close();

                $check = $con->prepare("SELECT COUNT(*) FROM tb_cidades WHERE id_pais = ?");
                $check->bind_param("i", $cd_pais);
                $check->execute();
                $check->bind_result($qtd);
                $check->fetch();
                $check->close();

                if ($qtd > 0) {
                    $_SESSION["aviso"] = "Não é possível excluir. Existem $qtd cidade(s) vinculada(s) a este país.";
                } else {
                    $stmt = $con->prepare("DELETE FROM tb_paises WHERE nome = ?");
                    $stmt->bind_param("s", $nome);
                    if ($stmt->execute()) {
                        $_SESSION["aviso"] = "País excluído com sucesso.";
                    } else {
                        $_SESSION["aviso"] = "Erro ao excluir país: " . $stmt->error;
                    }
                    $stmt->close();
                }
            } else {
                $_SESSION["aviso"] = "nome do país não informado para exclusão.";
            }
            header("Location: admin.php");
            exit();

        case 'r': // READ
            if (!empty($nome)) {
                $sql = "SELECT * FROM tb_paises WHERE nome = '".$nome."'";
                $stmt = $con->prepare("SELECT * FROM tb_paises WHERE nome = ?");
                $stmt->bind_param("s", $nome);
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
                $_SESSION["aviso"] = "nome do país não fornecido!";
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

    <div class="admin-container">
        <div class="form-container">
            <h2>Gerenciar Países</h2>
            <form id="f" method="post" action="admin.php">
                <input type="text" name="nome" placeholder="Nome do País" required value ="<?php echo htmlspecialchars($destacarPais['nome'] ?? ''); ?>"><br>
                <input type="number" name="populacao" placeholder="População" required value ="<?php echo $destacarPais['populacao'] ?? ''; ?>"><br>
                <input type="text" name="idioma" placeholder="Idioma" required value ="<?php echo $destacarPais['idioma'] ?? ''; ?>"><br>
                <input type="hidden" name="acao" id="acao"><br>
                <select name ="continente" required>
                    <option value="">Selecione o continente</option>
                    <option value="América do Sul">América do Sul</option>
                    <option value="América do Norte">América do Norte</option>
                    <option value="Europa">Europa</option>
                    <option value="África">África</option>
                    <option value="Ásia">Ásia</option>
                    <option value="Oceania">Oceania</option>
                </select><br><br>
                <input type="button" value="Criar" onclick="submeterForm('c')">
                <input type="button" value="Consultar" onclick="submeterForm('r')">
                <input type="button" value="Atualizar" onclick="submeterForm('u')">
                <input type="button" value="Deletar" onclick="submeterForm('d')">
            </form>
        </div>

        <div class="table-container">
            <h2>Países Cadastrados</h2>
            <?php
            $res = $con->query($sql);

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
