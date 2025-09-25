const {TicketRepository} = require('../repositories')
const {Mailer} = require('../config')

const ticketRepo = new TicketRepository()

async function sendMail(mailFrom, mailTo, subject, text, attachments = []) {
   try {
      const response = await Mailer.sendMail({
         from: mailFrom,
         to: mailTo,
         subject: subject,
         text: text,
         attachments // add attachments support
      });
      return response;
   } catch (error) {
     console.log(error);
     throw error;
   }
}

async function createTickets(data) {
    try {
        const response = await ticketRepo.create(data)
        return response

    } catch (error) {
         console.log(error);
         throw error
    }
}


async function getPendingEmails() {
    try {
        const response = await ticketRepo.getPendingTickets();
        return response
    } catch (error) {
         console.log(error);
         throw error
    }
}


module.exports = {
    sendMail,
    createTickets,
    getPendingEmails
}