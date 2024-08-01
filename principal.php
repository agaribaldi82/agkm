<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="/static/style1.css">
    <title>AG Krav Maga - Login</title>
</head>
<body>
    <div class="logo_kmg">
        <img  id="logo" src="static/logo_grande.jpeg" alt="">
    </div>
    <div id="formu">
        <form  method="POST" id="form">
            <div class="email">
            <input type="text" class="etiqueta" id="email" name="usuario" placeholder="Usuario">
            </div>
            <div class="contraseña">
            <input type="password" class="etiqueta" id="pwd" name="password" placeholder="Contraseña">
            </div>
            <div class="checkbox">
            <label class="remember"><input type="checkbox"> Remember me</label>
            </div>
            <button type="submit" class="submit">Ingresar</button>
        </form>
    </div>
    <?php
    include ("login.php")
?>
</body>
</html>