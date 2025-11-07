<?php

$servername = "localhost:3307";
$username = "root";
$password = "";
$dbname = "bd_mundo";

// Cria conexão
$con = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($con->connect_error) {
    die("Conexão falhou: " . $con->connect_error);
}

?>
