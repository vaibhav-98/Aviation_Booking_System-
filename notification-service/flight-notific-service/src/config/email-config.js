const  nodemailer = require('nodemailer')

const {Gmail_Email,Gmail_Pass} = require('./server-config')


const mailsender = nodemailer.createTransport({
    service: "Gmail",
    auth: {
       user: Gmail_Email,
       pass: Gmail_Pass
    }
})

module.exports = mailsender