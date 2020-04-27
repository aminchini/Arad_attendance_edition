const pool = require('../connect_to_db')
const moment = require('moment')

function check_started  (id, date, cb){
    
    const query = {
        text: "SELECT * FROM timing WHERE user_id = $1 AND date = $2 ",
        values: [id, date]
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
        } else {
            const data = true
            cb(null, data)
            return
        }       
    })
}

function check_status (user, cb){

    const query = {
        text: "SELECT * FROM users WHERE username = $1",
        values: [user]
    }

    pool.query(query, (err,res)=>{
        if(err){
            const data = "Error"
            cb(err, data) 
            return
        }
        else if(res.rows.length == 0){
            const data = "User not found!"
            const er = Error('Error')
            cb(er, data)
            return
        }
        else{
            if(res.rows[0].status == "on"){
                const data = "on"
                cb(null, data)
                return
            }if(res.rows[0].status == "off"){
                const data = "off"
                cb(null, data)
                return
            }
        }
    })
}

function check_working (id, date, cb){
    
    const query = {
        text: "SELECT * FROM timing WHERE user_id = $1 AND date = $2 ",
        values: [id, date]
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
            if(res.rows[0].end_time !== null){
                const data = true
                cb(null, data)
                return
            } else {
                const data = false
                cb(null, data)
                return
            }
        }
    })
}

function duration (id, e_time, date, cb){
    const query = {
        text: "SELECT * FROM timing WHERE user_id = $1 AND date = $2",
        values: [id, date]
    }
    pool.query(query, (err, res)=>{
        if(err){
            const data = "Error"
            cb(err, data)
            return
        } else {
            const s_time = res.rows[0].start_time
            const startTime = moment(s_time, "HH:mm")
            const endTime = moment(e_time, "HH:mm")
            const duration = moment.duration(endTime.diff(startTime))
            const hours = parseInt(duration.asHours())
            const minutes = parseInt(duration.asMinutes())%60
            const data = hours + ":" + minutes
            cb(null, data)
            return
        }
    })
}

function end_time (e_time, duration, id, the_day, date, cb){
    query = {
        text: "UPDATE timing SET end_time = $1, total_time = $2, the_day = $3 WHERE user_id = $4 AND date = $5",
        values: [e_time, duration, the_day, id, date]
    }
    pool.query(query, (err, res)=>{
        if(err){
            const data = "Error"
            cb(err, data)
            return
        } else {
            const data = "success"
            cb(null, data)
            return
        }
    })
}

function update_status(id, status, cb){
    user_query = {
        text: "UPDATE users SET status = $1 WHERE user_id = $2",
        values:[status, id]
    }
    pool.query(user_query, (err, res)=>{
        if(err){
            const data = "Error"
            cb(err, data)
            return 
        } else {
            const data = status
            cb(null, data)
            return
        }
    })
}

function start_time (s_time, id, date, the_day, cb){
    const time_query = {
        text: "INSERT INTO timing (start_time, user_id, date, the_day) VALUES($1, $2, $3, $4)",
        values: [s_time, id, date, the_day]
    }
    pool.query(time_query, (err, res)=>{
        if(err){
            const data = "Error"
            cb(err, data)
            return
        } else {
            const data = "success"
            cb(null, data)
            return
        }
    })
}

function get_end_time(id, date, cb){

    const query = {
        text: "SELECT * FROM timing WHERE user_id= $1 AND date = $2",
        values: [id, date]
    }

    pool.query(query, (err,res)=>{
        if(err){
            const data = "Error"
            cb(err, data) 
            return
        } else {
            if (res.rows.length == 0){
                const data = null
                cb(null, data)
                return
            } else {
                const data = res.rows[0].end_time
                cb(null, data)
                return
            }
        }
    })
}

function get_start_time(id, date, cb){

    const query = {
        text: "SELECT * FROM timing WHERE user_id= $1 AND date = $2",
        values: [id, date]
    }

    pool.query(query, (err,res)=>{
        if(err){
            const data = "Error"
            cb(err, data) 
            return
        } else {
            if (res.rows.length == 0){
                const data = null
                cb(null, data)
                return
            } else {
                const data = res.rows[0].start_time
                cb(null, data)
                return
            }
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

module.exports.get_start_time = get_start_time
module.exports.get_end_time = get_end_time
module.exports.get_info = get_info
module.exports.start_time = start_time
module.exports.check_working = check_working
module.exports.end_time = end_time
module.exports.check_status = check_status
module.exports.duration = duration
module.exports.check_started = check_started
module.exports.update_status = update_status