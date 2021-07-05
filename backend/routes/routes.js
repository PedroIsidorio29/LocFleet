const { Router } = require('express');
const { Usuario } = require('../models/');
const usuarioRouter = require('./usuario');
const veiculoRouter = require('./veiculo');
const motoristaRouter = require('./motorista');
const autenticacao = require('../middleware/autenticacao')
const jwt = require('jsonwebtoken');
const routes = Router();

routes.get('/', (req, res) => {
    /*  #swagger.tags = ['ROTA PRINCIPAL'] 
        #swagger.description = 'Uma rota básica de teste que retorna uma mensagem:"Rota principal"'
    
        #swaggwe.response[200]={
            schema: {mensagem: 'Rota principal'}
            description: 'Mensagem enviada com sucesso'
        }
    */
    res.status(200).json({ mensagem: "Rota principal"});
})

routes.use('/usuario', usuarioRouter);

routes.use('/veiculo', veiculoRouter);

routes.use('/motorista', motoristaRouter);

routes.post('/login', async (req, res) => {
 /*  #swagger.tags = ['Usuario login/logout'] 
        #swagger.description = 'responsavel por fazer o login do usuario'
    
        #swaggwe.response[200]={
            schema: {application/json}
            description: 'Mensagem enviada com sucesso'
        }
        #swaggwe.response[401]={
            schema: {mensagem: "Usuário não autorizado"}
            description: 'Usuário não autorizado'
        }
    */
    const findUser = await Usuario.findOne({
        where: { email: req.body.email }
    })

    if (findUser) {

        if (req.body.email === findUser.email && req.body.senha === findUser.senha) {

            let id = findUser.id // Id do banco
            const  token = jwt.sign({ id }, process.env.JWT_KEY, {
                expiresIn: "1h"
            })
            return res.status(200).json({
                mensagem: "Usuário autorizado",
                auth: true,
                id,
                token
            })
            
        } else { return res.status(401).json({ mensagem: "Usuário não autorizado" }) }

    } else { return res.status(401).json({ mensagem: "Usuário não autorizado" }) }
});


routes.get('/logout', autenticacao, async (req, res) => {
    /*  #swagger.tags = ['Usuario login/logout'] 
        #swagger.description = 'Responsavel por fazer o logout do usuario'
        #swagger.security = [{"Bearer":[]}]
    
        #swaggwe.response[200]={
            schema: {auth: false, token: null}
            description: 'Retorna a autenticação falsa e zera o token'
        },
    */
    return res.status(200).json({
        auth: false,
        token: null
    })
});

module.exports = routes; 