const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const Report = require('../Model/Report')
const reporter = Report.reporter
const get_info = Report.get_info

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

router.post('/report', verifyToken, (req, res)=>{
    console.log("Trying to report...")

    const user = req.body.user_name
    const s_date = req.body.s_date
    const e_date = req.body.e_date

    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else {           
            get_info(user, (err, result)=>{
                if(err){
                    res.json(result)
                } else {
                    reporter(result.user_id, s_date, e_date, (er, rs)=>{               
                        res.json(rs)                
                    })
                }
            })
        }
    })
})

module.exports = router