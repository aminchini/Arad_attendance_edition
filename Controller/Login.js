const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const Login = require('../Model/Login')
const login = Login.login
const check = Login.check
const change = Login.change
const get_info = Login.get_info

const salter = require('../salt')
const rand_pass = salter.salt
const new_salt = salter.salt

const emailer = require('../email')
router.post('/login', (req, res)=>{
    console.log("Trying to check a user...")

    const userName = req.body.user_name
    const passWord = req.body.pass_word
    const user = {
        user_name : userName,
        pass_word: passWord
    }
    login(userName, passWord, (err1,result)=>{
        if(err1){
        res.json(result)
        } else {
            jwt.sign({user}, 'secretkey', { expiresIn: 60 * 15 }, (err, token) => {
                res.json({
                    token: token,
                    result:true,
                    type: result
                })
            })
        }
    })
})

router.post('/forget_pass', (req, res)=>{
    console.log("Trying for forget password...")

    const user = req.body.user_name
    const email = req.body.email

    get_info(user, (err, result)=>{
        if(err){
            res.json(result)
        } else {
            check(user, email, (errr, resu)=>{
                if(errr){
                    res.json(resu)
                } else {
                    if (resu === true){
                        change(user, rand_pass, new_salt, (er, rs)=>{
                            if(er){
                                res.json(rs)
                            } else {
                                emailer(
                                    result.email,
                                    "تغییر رمز عبور",
                                    `<!DOCTYPE html>
                                    <html lang="en">
                                    <head>
                                        <meta charset="UTF-8">
                                        <title>Title</title>
                                    </head>
                                    <body>
                                    <div id="message_box" dir="rtl" style="text-align: center;">
                                        <img src="https://drive.google.com/open?id=1s_C5zKdU_SG0TI1kOPYdxr_SZqYSw--D" alt="" style="width: 250px;">
                                        <h1>کاربر عزیز سلام</h1>
                                        <center>
                                            <div id="password_box" style="background: #541b7a;
                                            width: 250px;">
                                                <h4 style=" width: 100%;
                                                background: #ed0036;
                                                color: #ffffff;">گذرواژه جدید شما: </h4>
                                                <h5 style="color: #ffffff;">
                                                    ${rand_pass}
                                                </h5>
                                            </div>
                                        </center>
                                    </div>
                                    </body>
                                    </html>`,
                                    (eror, respond)=>{
                                    if(respond == false){
                                        res.json("Error")
                                    } else {
                                        res.json("success")
                                    }
                                })
                            }
                        })
                    } else {
                        res.json(resu)
                    }
                }
            })
        }
    })
})

module.exports = router