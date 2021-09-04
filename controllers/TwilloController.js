const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const secretKey = process.env.TWILIO_SECRET_KEY;
const client = require('twilio')(accountSid, authToken);
const VoiceResponse = require('twilio').twiml.VoiceResponse;
// const client = require('twilio')(apiKey, secretKey, { accountSid: accountSid });

let { GetUserById, UserUpdate } = require('../services/user');
let { DeleteInComingNumber } = require('../services/twillo');

module.exports = {
    getPhoneNumbers: async function (req, res) {
        const {
            country, type, prefix, contains
        } = req.body;

        try {
            if (type === 'local') {
                await client.availablePhoneNumbers(country)
                    .local
                    .list({ areaCode: prefix })
                    .then(local => {
                        // console.log(local)
                        return res.status(200).json({
                            success: true,
                            data: local
                        });
                    });
            } else if (type === 'tollFree') {
                await client.availablePhoneNumbers(country)
                    .tollFree
                    .list({ areaCode: prefix })
                    .then(tollFree => {
                        // console.log(tollFree);
                        return res.status(200).json({
                            success: true,
                            data: tollFree
                        });
                    });
            }
        }
        catch (e) {
            return res.status(500).json({
                success: false,
                message: e
            });
        }
    },
    pricingNumber: async function (req, res) {
        const { isoCountry } = req.body;
        try {
            await client.pricing.v1.phoneNumbers
                .countries(isoCountry)
                .fetch()
                .then(country => {
                    console.log(country.country)
                    return res.status(200).json({
                        success: true,
                        data: country
                    });
                });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e
            });
        }
    },
    purchaseNumber: async function (req, res) {
        const {
            friendlyName,
            phoneNumber,
            areaCode,
            subAccountSid
        } = req.body;
        // console.log(req.body);
        try {
            // purchase phone number with parent account
            await client.incomingPhoneNumbers
                .create({
                    phoneNumber: phoneNumber,
                    voiceUrl: 'http://demo.twilio.com/docs/voice.xml',
                    areaCode: areaCode
                })
                .then(incoming_phone_number => {
                    // console.log(incoming_phone_number);

                    // transfer phone number to sub account

                    client.incomingPhoneNumbers(incoming_phone_number.sid)
                        .update({ accountSid: subAccountSid })
                        .then(e => {
                            e.friendlyName = friendlyName;
                            e.phoneNumber = phoneNumber;
                            return res.status(200).json({
                                success: true,
                                data: e
                            });
                        });
                });

        } catch (e) {
            console.log(e);
            return res.status(500).json({
                success: false,
                message: e
            });
        }
    },
    releaseNumber: async function (req, res) {
        const { number } = req.body;

        try {
            client.incomingPhoneNumbers
                .create({
                    smsUrl: 'https://www.your-sms-url.com/example',
                    phoneNumber: number
                })
                .then(async (incoming_phone_number) => {
                    console.log(incoming_phone_number.sid)

                    await DeleteInComingNumber(incoming_phone_number.sid);

                    return res.status(200).json({
                        success: true,
                        data: incoming_phone_number
                    });
                });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e
            });
        }
    },
    createSubAccounts: async function (req, res) {
        const { userId, username } = req.body;

        try {
            await client.api.accounts.create({ friendlyName: username })
                .then(async (account) => {
                    console.log(account.sid);

                    const user = await UserUpdate(userId, { twilloSubAccountSid: account.sid });

                    return res.status(200).json({
                        success: true,
                        data: await GetUserById(user._id)
                    });
                });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e
            });
        }
    },
    transferNumbersToSubAccount: async function (req, res) {
        const { subAccountSid, phoneNumberSid } = req.body;

        try {
            await client.incomingPhoneNumbers(phoneNumberSid)
                .update({ accountSid: subAccountSid })
                .then(incoming_phone_number => {
                    console.log(incoming_phone_number)

                    return res.status(200).json({
                        success: true,
                        data: incoming_phone_number
                    });
                });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e
            })
        }
    },
    acceptIncomingClientCall: async function (req, res) {
        try {
            await client.Device.on('incoming', function (conn) {
                console.log('Incoming connection from ' + conn.parameters.From);
                // accept the incoming connection and start two-way audio
                conn.accept();

                return res.status(200).json({
                    success: true,
                    message: 'Accepted'
                });
            });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e
            })
        }
    },
    rejectIncomingClientCall: async function (req, res) {
        const { phoneNumber } = req.body;

        try {
            // await client.Device.on('incoming', function(conn) {
            //     console.log('Incoming connection from ' + conn.parameters.From);
            //     // const archEnemyPhoneNumber = '+15417280966';

            //     if (conn.parameters.From === phoneNumber) {
            //       conn.reject();

            //         return res.status(200).json({
            //             success: true,
            //             message: 'Rejected' 
            //         });
            //     } else {
            //       // accept the incoming connection and start two-way audio
            //       conn.accept();

            //       return res.status(200).json({
            //           success: true,
            //           message: 'Accepted'
            //       });
            //     }
            // });
            // console.log(phoneNumber);

            exports.handler = function (context, event, callback) {
                // List all blocked phone numbers in quotes and E.164 formatting, separated by a comma
                let numberBlock = event.block || [phoneNumber];
                let twiml = VoiceResponse;
                let blocked = true;
                if (numberBlock.length > 0) {
                    if (numberBlock.indexOf(event.From) === -1) {
                        blocked = false;
                    }
                }
                if (blocked) {
                    twiml.reject();

                    return res.status(200).json({
                        success: true,
                        message: "Rejected"
                    });
                }
                else {
                    // if the caller's number is not blocked, redirect to your existing webhook
                    twiml.redirect("https://demo.twilio.com/docs/voice.xml");

                    return res.status(400).json({
                        success: true,
                        message: "Not Rejected"
                    });
                }
                callback(null, twiml);
            };
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e
            })
        }
    }
}