const Number = require('../models/Number');
let { GetUserById } = require('../services/user');

module.exports.GetNumberById = async function (id) {
    const result = await Number
        .findById({
            _id: id,
        })
        .exec();
    if (result) {
        return result;
    }
    return null;
}

module.exports.NumberCreate = async function (req) {
    const {
        publisherId,
        friendlyName,
        phoneNumber,
        numberSid,
        monthlyFee,
        purchaseDate,
        status,
    } = req;

    let number = new Number();
    number.phoneNumber = phoneNumber;
    number.friendlyName = friendlyName;
    number.numberSid = numberSid;
    number.publisher = publisherId;
    number.monthlyFee = monthlyFee;
    number.purchaseDate = purchaseDate;
    number.status = status;

    const result = await number.save();
    if (result) {
        return result;
    }
    return result;
}

module.exports.NumberUpdate = async function (id, params) {
    const filter = { _id: id };
    const update = params;

    const result = await Number.findOneAndUpdate(filter, { $set: update });

    if (result) return result;
    return result;
}

module.exports.NumberDelete = async function (id) {
    const result = await Number.findById(id)
        .then(e => {
            if (e) {
                e.friendlyName = "";
                e.save().then(re => res.json(re));
            }
        });

    if (result) return result;
    return result;
}
module.exports.SetAssignPublisher = async function (data) {
    const { id, publisher } = data
    const result = await Number.findById(id)
        .then(e => {
            if (e) {
                e.status = "Paused";
                e.publisher = [];
                e.publisher.push(publisher);
                e.save().then(re => res.json(re));
            }
        });

    if (result) return result;
    return result;
}