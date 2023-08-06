async function authDocProducao(req, res, next) {
    const { senhaDigitada } = req.body;

    // Usuário estando no localhost 
    if(req.headers.host.includes("localhost") || req.originalUrl !== "/doc/"){
        return next();
    }

    // Utilização da senha correta
    if(senhaDigitada === process.env.SWAGGER_SENHA_DOC){
        return next();
    }

    // barramento do usuário com senha incorreta
    if(senhaDigitada){
        res.status(401).set('Content-Type', 'text/html');
        res.send(Buffer.from(`
            <form method="post">
                <p style="color: red;">Senha Errada!</p>
                <label for="senhaDigitada">Senha da documentação:</label>
                <input type="password" name="senhaDigitada" id="senhaDigitada" />
                <button type="submit">Entrar</button>
            </form>
        `))
    } else {
        // Caso o usuário ainda não digitou a senha estando em modo de produção
        res.status(200).set('Content-Type', 'text/html');
        res.send(Buffer.from(`
            <form method="post">
                <label for="senhaDigitada">Senha da documentação:</label>
                <input type="password" name="senhaDigitada" id="senhaDigitada" />
                <button type="submit">Entrar</button>
            </form>
        `))
    }
}

module.exports = authDocProducao;