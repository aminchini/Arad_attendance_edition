const pool = require('../connect_to_db')

function get_usernames(cb){

    const query = {
        text: "SELECT username FROM users"
    }

    pool.query(query, (err,res)=>{
        if(err){
            const data = "Error"
            cb(err, data) 
            return
        } else {
            const users = res.rows
            const data = users.map(user=>{
                return user.username
            })
            cb(null, data)
            return
        }
    })
}

function get_names(cb){

    const query = {
        text: "SELECT * FROM users WHERE type <> $1",
        values: ["admin"]
    }

    pool.query(query, (err,res)=>{
        if(err){
            const data = "Error"
            cb(err, data) 
            return
        } else {
            const the_rows = res.rows
            const data = the_rows.map(row =>{
                let name = row.info
                let user_name = row.username
                let status = row.status
                return {name: name, user_name: user_name, status: status}
            })
            cb(null, data)
            return
        }
    })
}

function info(user, cb){

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
            const email = res.rows[0].email
            const name = res.rows[0].info
            cb(null, {email:email, name:name})
            return
        }
    })
}

module.exports.get_names = get_names
module.exports.get_usernames = get_usernames
module.exports.info = info