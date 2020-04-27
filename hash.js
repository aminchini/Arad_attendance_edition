const crypto = require('crypto')

const sha512 = function(password, salt){
    const hash = crypto.createHmac('sha512', salt)
    hash.update(password)
    const value = hash.digest('hex')
    return value
}

module.exports.hasher = sha512
