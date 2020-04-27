const crypto = require('crypto')

const genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,length)
}

const outer_salt = genRandomString(16) 

module.exports.salt = outer_salt 