const nodemailer = require("nodemailer")

function emailer (email, title, text, cb) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aradattendance@gmail.com',
        pass: '044004arad'
    }
  })

  const mailOptions = {
    from: 'aradattendance@gmail.com', // sender address
    to: email, // list of receivers
    subject: title, // Subject line
    html: text// plain text body
  }

  try{
    transporter.sendMail(mailOptions, function (err, info) {
      if(err){
          console.log(err)
          cb(err, false)
      } else {
          console.log(info)
          cb (null, true)
      }
    })
  }
  catch(err){
    cb(err, false)
  }
}

module.exports = emailer