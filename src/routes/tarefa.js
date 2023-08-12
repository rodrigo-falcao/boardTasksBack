const express = require('express');
const conectarBancoDados = require('../midlewares/conectarBD');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados');
const EsquemaTarefa = require('../models/tarefa');
const authUser = require('../midlewares/authUser');
const router = express.Router();

/* GET users listing. */
router.post('/criar', authUser, conectarBancoDados, async function(req, res) {
try {
    // #swagger.tag = ['tarefa']
    let {posicao, titulo, descricao, status, dataEntrega} = req.body;
    const usuarioCriador = req.usuarioJwt
    const respostaBD = await EsquemaTarefa.create({posicao, titulo, descricao, status, dataEntrega});

    res.status(200).json({
    status: "OK",
    statusMensagem: "Usuário criado com sucesso.",
    resposta: respostaBD
    })
} catch (error) {
    if(String(error).includes("email_1 dup key")){
    return tratarErrosEsperados(res, "Error: Já existe uma conta com esse e-mail!")
    }
    return tratarErrosEsperados(res, error)
}
});

router.put('/editar/:id', authUser, conectarBancoDados, async function (req, res) {
    try {
    // #swagger.tags = ['Tarefa']
    let idTarefa = req.params.id;
    let { posicao, titulo, descricao, status, dataEntrega } = req.body;
    const usuarioLogado = req.usuarioJwt.id;

    const checkTarefa = await EsquemaTarefa.findOne({ _id: idTarefa, usuarioCriador: usuarioLogado });
    if (!checkTarefa) {
        throw new Error("Tarefa não encontrada ou pertence a outro usuário");
    }

    const tarefaAtualizada = await EsquemaTarefa.updateOne({ _id: idTarefa }, { posicao, titulo, descricao, status, dataEntrega });
    if (tarefaAtualizada?.modifiedCount > 0) {
        const dadosTarefa = await EsquemaTarefa.findOne({ _id: idTarefa }).populate('usuarioCriador');

        res.status(200).json({
        status: "OK",
        statusMensagem: "Tarefa atualizada com sucesso.",
        resposta: dadosTarefa
        })
    }
    } catch (error) {
    return tratarErrosEsperados(res, error);
    }
});

router.get('/obter/usuario', authUser, conectarBancoDados, async function (req, res) {
    try {
        // #swagger.tags = ['Tarefa']
        // #swagger.description = "Endpoint para obter todas tarefas do usuario logado."
        const usuarioLogado = req.usuarioJwt.id;
        const respostaBD = await EsquemaTarefa.find({ usuarioCriador: usuarioLogado }).populate('usuarioCriador');

        res.status(200).json({
        status: "OK",
        statusMensagem: "Tarefas listadas na respota com sucesso.",
        resposta: respostaBD
        })

    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
    });

router.delete('/deletar/:id', authUser, conectarBancoDados, async function (req, res) {
    try {
        // #swagger.tags = ['Tarefa']
        const idTarefa = req.params.id;
        const usuarioLogado = req.usuarioJwt.id;
    
        const checkTarefa = await EsquemaTarefa.findOne({ _id: idTarefa, usuarioCriador: usuarioLogado });
        if (!checkTarefa) {
        throw new Error("Tarefa não encontrada ou pertence a outro usuário");
        }
    
        const respostaBD = await EsquemaTarefa.deleteOne({ _id: idTarefa });
        res.status(200).json({
        status: "OK",
        statusMensagem: "Tarefa deletada com sucesso.",
        resposta: respostaBD
        })
    
    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
    });

module.exports = router;
