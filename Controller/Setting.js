const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const setting = require('../Model/Setting')
const check_password = setting.check_password
const change_username = setting.change_username
const change_password = setting.change_password
const existence = setting.existence
const add_email = setting.add_email
const add_user = setting.add_user
const delete_user = setting.delete_user

const salter = require('../salt')
const salt = salter.salt

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization']
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ')
        // Get token from array
        const bearerToken = bearer[1]
        // Set the token
        req.token = bearerToken
        // Next middleware
        next()
    } else {
        // Forbidden
        res.sendStatus(403)
    }  
}

router.post('/add_email', verifyToken, (req, res) =>{
    console.log("Trying to add an email ...")

    var user = req.body.user
    var email = req.body.email
    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else {
            add_email(user, email, (err, result) =>{
                res.json(result)
            })
        }
    })
})

router.post('/change_username', verifyToken, (req, res)=>{
    console.log("Trying to change username...")
    const old_user = req.body.old_user
    const new_user = req.body.new_user
    const pass = req.body.pass
    
    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else {           
            check_password(old_user, pass, (err,result)=>{
                if(err){
                    res.json(result)
                }
                if(result === true){
                    change_username(new_user, old_user, (er,rs)=>{
                        res.json(rs)
                    })
                }
            })
        }
    })
})

router.post('/change_password', verifyToken, (req, res)=>{
    console.log("Trying to check a user...")
    const user = req.body.username
    const old_pass = req.body.old_pass
    const new_pass = req.body.new_pass

    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else {        
            check_password(user, old_pass, (err,result)=>{
                if(err){
                    res.json(result)
                }
                if(result === true){
                    change_password(user, new_pass, salt, (er,rs)=>{
                        res.json(rs)
                    })
                }
            })
        }
    })
})

router.post('/add_user', verifyToken, (req, res) =>{
    console.log("Trying to creat a new user...")

    const userName = req.body.add_user_name
    const passWord = req.body.add_pass_word
    const type = req.body.add_type
    const info = req.body.info

    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
        res.sendStatus(403)
        } 
        else
        {
            existence(userName, (er,rs)=>{
                if(er){
                res.json(rs)
                }
                else 
                {
                    if(rs == false){
                        add_user(userName, passWord, type, info, salt, (err, result) =>{
                        res.json(result)
                        })
                    } 
                    else 
                    {
                        res.json(rs)
                    }
                }
            })
        }
    }) 
})

router.post('/delete_user', verifyToken, (req, res)=>{
    console.log("Trying to delete a user...")

    const user = req.body.user_name

    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else {
            delete_user(user, (err, result)=>{
                res.json(result)
            })
        }
    })
})

module.exports = router