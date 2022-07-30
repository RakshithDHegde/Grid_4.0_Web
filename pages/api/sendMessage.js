import twilio from "twilio";

export default function sendMessage(req, res) {
  const accountSid = "AC8fa3c6d77dd3c437f01d41ee8fa5b26c";
  const token = "3023b11c7ed1504c11f8a9afd6e2b471";
  const client = twilio(accountSid, token);
  const { phone, message } = req.body;
  // console.log(phone, message);
  client.messages
    .create({
      body: message,
      from: "+12182741603",
      to: phone,
    })
    .then((message) =>
      res.json({
        success: true,
      })
    )
    .catch((error) => {
      console.log(error);
      res.json({
        success: false,
      });
    });
}
