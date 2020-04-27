const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(morgan('combined'))

const Login = require('./Controller/Login')
app.use(Login)
//Report
const Report = require('./Controller/Report')
app.use(Report)

//Admin
const Admin = require('./Controller/Admin')
app.use(Admin)

//Settings
const Setting = require('./Controller/Setting')
app.use(Setting)

//Timings
const Home = require('./Controller/Home')
app.use(Home)

//Leaving


app.listen(3030, ()=>{
    console.log('Server is listening on 3030...')
})