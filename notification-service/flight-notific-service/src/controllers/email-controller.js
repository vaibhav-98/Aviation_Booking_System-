const {EmailService} = require('../services')

async function create(req,res) {
   try {
     const response = await EmailService.createTickets({
        subject: req.body.subject,
        content: req.body.content,
        recepientEmail: req.body.recepientEmail
     })
      return res.status(201).json({data:response})
   } catch (error) {
      return res.status(500).json({error:error})
   }
}

module.exports = {
   create
}