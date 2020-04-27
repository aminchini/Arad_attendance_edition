const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const Home = require('../Model/Home')
const check_started = Home.check_started
const get_info = Home.get_info
const end_time = Home.end_time
const update_status = Home.update_status
const duration = Home.duration
const start_time = Home.start_time
const check_status = Home.check_status
const check_working = Home.check_working
const get_end_time = Home.get_end_time
const get_start_time = Home.get_start_time

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

router.post('/check_started', verifyToken, (req, res)=>{
    console.log("Trying to check for started...")

    const user_name = req.body.user_name
    const date = req.body.today

    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else {           
            get_info(user_name, (er, rs)=>{
                if(er){
                    res.json(rs)
                } else {
                    check_started(rs.user_id, date, (err,result)=>{
                        res.json(result)
                    })
                }
            })
        }
    })
})

router.post('/check_status', verifyToken, (req, res)=>{
    console.log("Trying to check a user status...")
    const user = req.body.username

    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else {           
            check_status(user, (err,result)=>{
                if(err){
                    res.json(result)
                } else {
                    if(result == "on"){
                        res.json(result)
                    }
                    if(result == "off"){
                        res.json(result)
                    }
                }
            })
        }
    })
})

router.post('/check_work', verifyToken, (req, res)=>{
    console.log("Trying to check for working...")

    const user_name = req.body.user_name
    const date = req.body.today

    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else {           
            get_info(user_name, (er, rs)=>{
                if(er){
                    res.json(rs)
                } else {
                    check_working(rs.user_id, date, (err,result)=>{
                        res.json(result)
                    })
                }
            })
        }
    })
})

router.post('/end_time', verifyToken, (req, res)=>{
    console.log("Trying to end time...")

    const user = req.body.user_name
    const e_time = req.body.e_time
    const date = req.body.date
    const the_day = req.body.day
    
    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else {           
            get_info(user, (err, result)=>{
                if(err){
                    res.json(result)
                } else {
                    duration(result.user_id, e_time, date, (err1, res1)=>{
                        if(err1){
                            res.json(result)
                        } else {
                            end_time(e_time, res1, result.user_id, the_day, date, (er, rs)=>{
                                if(er){
                                    res.json(rs)
                                } else {
                                    update_status(result.user_id, "off", (erer,rsrs)=>{
                                        res.json(rsrs)
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

router.post('/start_time', verifyToken, (req, res)=>{
    console.log("Trying to register time...")

    const user = req.body.user_name
    const s_time = req.body.s_time
    const date = req.body.date
    const the_day = req.body.day

    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else {           
            get_info(user, (err, result)=>{
                if(err){
                    res.json(result)
                } else {
                    start_time(s_time, result.user_id, date, the_day, (er, rs)=>{
                        if(er){
                            res.json(rs)
                        } else {
                            update_status(result.user_id, "on", (erer,rsrs)=>{                      
                                res.json(rsrs)
                            })
                        }
                    })
                }
            })
        }
    })
})

router.post('/give_end_time', verifyToken, (req, res)=>{
    console.log("Trying to give end time...")

    const user_name = req.body.user_name
    const date = req.body.today

    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else { 
            get_info(user_name, (er, rs)=>{
                if(er){
                    res.json(rs)
                } else {
                    get_end_time(rs.user_id, date, (err,result)=>{
                        res.json(result)   
                    })
                }
            })          
        }
    })
})

router.post('/give_start_time', verifyToken, (req, res)=>{
    console.log("Trying to give start time...")

    const user_name = req.body.user_name
    const date = req.body.today

    jwt.verify(req.token, 'secretkey', (auth_err, authData) => {
        if(auth_err) {
            res.sendStatus(403)
        } else { 
            get_info(user_name, (er, rs)=>{
                if(er){
                    res.json(rs)
                } else {
                    get_start_time(rs.user_id, date, (err,result)=>{
                        res.json(result)   
                    })
                }
            })          
        }
    })
})

module.exports = router