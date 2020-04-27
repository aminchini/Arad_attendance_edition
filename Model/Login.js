const pool = require('../connect_to_db')

const hash = require('../hash')
const hasher = hash.hasher

var login = function (user, pass, cb){
    
    const query = {
        text: "SELECT * FROM users WHERE username = $1",
        values: [user]
    }

    pool.query(query, (err,res)=>{
        if(err){
            const data = {result:false, type:"Error"}
            cb(err, data) 
            return
        }
        else if(res.rows.length == 0){
            const data = {result:false, type:"User not found!"}
            const er = Error('Error')
            cb(er, data)
            return
        } else {
            if(res.rows[0].password == hasher(pass, res.rows[0].salt)){
                const data = res.rows[0].type
                cb(null, data)
                return
            } else {
                const data = {result:false, type:"Incorrect password"}
                const er = Error('Error')
                cb(er, data)
                return
            }
        }
    })
}

function check(user, email, cb){

    const query = {
        text: "SELECT * FROM users WHERE username = $1",
        values:[user]
    }

    pool.query(query, (err, res)=>{
        if(err){
            const data = "Error"
            cb(err, data) 
            return
        } else {
            if(res.rows[0].email == email){
                const data = true
                cb(null, data)
                return
            } else {
                const data = "Incorrect email!"
                cb(null, data)
                return
            }
        }
    })
}

function change(user, rand_pass, new_salt, cb){
    const password = hasher(rand_pass, new_salt)
    const query = {
        text: 'UPDATE users SET password = $1, salt = $2 WHERE username = $3',
        values: [password, new_salt, user]
    }

    pool.query(query, (err, res)=>{
        if(err){
            const data = 'Error' 
            cb(err, data)
            return
        } else {
            const data = 'Password successfully changed!' 
            cb(null, data)
            return
        }
    })
}

function get_info(user, cb){

    const query = {
        text: "SELECT * FROM users WHERE username = $1",
        values: [user]
    }

    pool.query(query, (err,res)=>{
        if(err){
            const data = "Error"
            cb(err, data) 
            return
        } else {
            const data = res.rows[0]
            cb(null, data)
            return
        }
    })
}

module.exports.get_info = get_info
module.exports.login = login
module.exports.check = check
module.exports.change = change
