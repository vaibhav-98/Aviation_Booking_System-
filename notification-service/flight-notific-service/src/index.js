const express = require("express");
const amqplib = require("amqplib");
const { EmailService } = require("./services");

async function connectQueue() {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("noti-queue");

    channel.consume("noti-queue", async (data) => {
      const object = JSON.parse(`${Buffer.from(data.content)}`);
      console.log("📩 Message received from queue:", object);

      let attachments = [];

      //  Case 1: If booking service sent base64 encoded PDF
      if (object.ticketPdfBase64) {
        attachments.push({
          filename: `ticket-${object.meta?.bookingId || "booking"}.pdf`,
          content: Buffer.from(object.ticketPdfBase64, "base64"),
          contentType: "application/pdf",
        });
      }

      //  Case 2: If booking service sent "attachments" array with serialized Buffers
      if (object.attachments && Array.isArray(object.attachments)) {
        attachments = object.attachments.map(att => {
          let content = att.content;
          if (content && content.type === "Buffer" && Array.isArray(content.data)) {
            content = Buffer.from(content.data); // rehydrate buffer
          }
          return {
            filename: att.filename || `ticket-${object.meta?.bookingId || "booking"}.pdf`,
            content,
            contentType: att.contentType || "application/pdf",
          };
        });
      }

      //  Send email with attachments
      await EmailService.sendMail(
        "abc@gmail.com",
        object.recepientEmail,
        object.subject,
        object.text,
        attachments
      );

      channel.ack(data);
    });
  } catch (error) {
    console.error("Queue connection error:", error);
  }
}

const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");
const mailsender = require("./config/email-config");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, async () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
  await connectQueue();
  //   try {
  //      const response = await mailsender.sendMail({
  //          from: ServerConfig.Gmail_Email,
  //          to: "vaibhav.tripathi@pw.live",
  //          subject: 'Is the service working ?',
  //          text: 'Yes working ✅'
  //        });

  //  console.log(response);
  //   } catch (error) {
  //      console.log(error);

  //   }
});
