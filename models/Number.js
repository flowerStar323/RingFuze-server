const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const NumberSchema = new Schema({
    phoneNumber: {
        type: String,
    },
    friendlyName: {
        type: String,
    },
    numberSid: {
        type: String,
    },
    campaign: {
        type: String,
    },
    purchaseDate: {
        type: Date,
    },
    monthlyFee: {
        type: Number,
    },
    renewalDate: {
        type: Date,
    },
    status: {
        type: String,
    },
    publisher: [{
        type: ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});

const NumberModel = mongoose.model('Number', NumberSchema);
module.exports = NumberModel;
