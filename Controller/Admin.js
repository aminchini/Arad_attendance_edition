const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const Admin = require('../Model/Admin')
const get_names = Admin.get_names
const get_usernames = Admin.get_usernames
const info = Admin.info

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

router.post('/give_user_name', verifyToken, (req, res)=>{
    console.log("Trying to give username...")

    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else {         
            get_usernames((err, result)=>{
                res.json(result)
            })
        }
    })
})

router.post('/give_users_info', verifyToken, (req, res)=>{
    console.log("Trying to give users info...")

    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else {           
            get_names((err,result)=>{
                res.json(result)   
            })
        }
    })
})

router.post('/info', verifyToken, (req, res)=>{
        console.log("Trying for getting user information...")

        const user = req.body.user_name
        
        jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else {         
            info(user, (err, result)=>{
                res.json(result)
            })
        }
    })
})

module.exports = router