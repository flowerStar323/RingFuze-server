const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports.FetchInComingNumber = async function (number) {
    await client.incomingPhoneNumbers
      .create({
         smsUrl: 'https://www.your-sms-url.com/example',
         phoneNumber: number
       })
      .then(incoming_phone_number => {
        console.log(incoming_phone_number)
        return incoming_phone_number;
      });
}

module.exports.DeleteInComingNumber = async function (numberSid) {
  await client.incomingPhoneNumbers(numberSid).remove();
}