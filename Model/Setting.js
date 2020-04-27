const pool = require('../connect_to_db')

const hash = require('../hash')
const hasher = hash.hasher

function check_password (user_name, password, cb){

    const query = {
        text: "SELECT * FROM users WHERE username = $1",
        values: [user_name]
    }

    pool.query(query, (err,res)=>{
        if(err){
            const data = 'Error'
            cb(err, data) 
            return
        }
        else if(res.rows.length == 0){
            const data = 'User not found!'
            const er = Error('Error')
            cb(er, data)
            return
        }
        else{
            if(res.rows[0].password === hasher(password, res.rows[0].salt)){
                const data = true
                cb(null, data)
                return
            } else {
                const data = "Incorrect password!"
                const er = Error('Error')
                cb(er, data)
                return
            }
        }
    })
}

function add_email (username, email, cb){
    const query = {
        text:'UPDATE users SET email=$1::text WHERE username=$2::text',
        values:[email, username]
    }
    pool.query(query, (err, res)=>{
        if(err){
            const data = 'Error'
            cb(err, data)
            return
        } else {
            const data = 'Email successfully added!'
            cb(null, data)
            return
        }
    })
}

function change_username (new_username, old_username, cb){
    const query = {
        text: 'UPDATE users SET username = $1 WHERE username = $2',
        values: [new_username, old_username]
    }
    pool.query(query, (err, res)=>{
        if(err){
            const data = 'Error'
            cb(err, data)
            return
        } else {
            const data = 'User name successfully changed!'
            cb(null, data)
            return
        }
    })
}

function change_password (user_name, new_password, salt, cb){
    const password = hasher(new_password, salt)
    const query = {
        text: 'UPDATE users SET password = $1, salt = $2 WHERE username = $3',
        values: [password, salt, user_name]
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

function existence (user_name, cb){
    
    const query = {
        text: "SELECT * FROM users WHERE username = $1 ",
        values: [user_name]
    }

    pool.query(query, (err,res)=>{
        if(err){
            const data = "Error in query!"
            cb(err, data) 
            return
        }
        if(res.rows.length == 0){
            const data = false
            cb(null, data)
            return
        }
        if(res.rows.length !== 0){
            const data = "User exist!"
            cb(null, data)
            return
        }
    })
}

function add_user (username, pass, type, info, salt, cb){
    var password = hasher(pass, salt)

    if(type == 'admin'){
        let query = {
            text: ` INSERT INTO users
                    (username, password, salt, type, email, info, status)
                    VALUES($1, $2, $3, $4, $5, $6, $7)`,
            values: [username, password, salt, type, '', info, 'off']
        }
        pool.query(query, (err, res) =>{
            if(err){
                const data = "Error"
                cb(null, data)
                return
            } else {
                const data = 'User added'
                cb(null, data)
                return
            }
        })
    }
    
    if(type == 'user'){
        let query = {
            text: ` INSERT INTO users
                    (username, password, salt, type, info, email, status) 
                    VALUES($1, $2, $3, $4, $5, $6, $7)`,
            values: [username, password, salt, type, info, '', 'off']
        }
        pool.query(query, (err, res) =>{
            if(err){
                const data = "Error"
                cb(null, data)
                return
            } else {
                const data = 'User added'
                cb(null, data)
                return
            }
        })
    }
}

function delete_user (user_name, cb){
    const query = {
        text: "DELETE FROM users WHERE username= $1",
        values: [user_name]
    }
    pool.query(query, (err, res)=>{
        if(err){
            const data = "Error"
            cb(err, data)
            return
        } else {
            cb(null, "Success")
            return
        }
    })
}

module.exports.check_password = check_password
module.exports.change_username = change_username
module.exports.change_password = change_password
module.exports.existence = existence
module.exports.add_email = add_email
module.exports.add_user = add_user
module.exports.delete_user = delete_user