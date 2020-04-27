const pool = require('../connect_to_db')

function reporter (id, s_date, e_date, cb){
    const query = {
        text: "SELECT start_time, end_time, total_time, date, the_day FROM timing WHERE user_id = $1 AND date >= $2 AND date <= $3 ORDER BY time_id DESC",
        values: [id, s_date, e_date]
    }
    pool.query(query, (err, res)=>{
        if(err){
            const data = "Error"
            cb(err, data)
            return
        } else {
            const data = res.rows
            const total_time_array = data.map(time=>{
                return time.total_time
            })
            var hours = 0;
            var minutes = 0;
            for (let times of total_time_array){
                let index = times.lastIndexOf(":");
                hours += parseInt(times.slice(0, index));
                minutes += parseInt(times.substr(index+1));
            }
            const remainder_hours = Math.floor(minutes/60)
            const the_hours = remainder_hours + hours
            const the_minutes = minutes % 60
            const total = the_hours + ":" + the_minutes
            data.push(total)
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
module.exports.reporter = reporter