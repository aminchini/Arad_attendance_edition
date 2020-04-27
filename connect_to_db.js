const { Pool } = require('pg')

const pool = new Pool({
  user: "db_user",
  host: "localhost",
  database: "arad",
  password: "asdf",
  port: 5432
})

module.exports = pool