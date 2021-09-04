let User = require('../models/UserModel');
let Number = require('../models/Number');
let { NumberCreate, NumberUpdate, GetNumberById, NumberDelete, SetAssignPublisher } = require('../services/number');

module.exports = {
    get: async function (req, res) {
        try {
            const result = await Number.find().populate('publisher').exec();

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (e) {
            return res.status(200).json({
                success: false,
                message: e
            });
        }
    },
    getByPayload: async function (req, res) {
        try {
            const result = await Number.find(req.body);

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (e) {
            return res.status(200).json({
                success: false,
                message: e
            });
        }
    },
    getSignedPublisher: async function (req, res) {
        try {
            let signedPublishers = [];

            const unassignedNumbers = await Number.find({ status: 'Unassigned' });
            const publishers = await User.find({ role: 'publisher' });

            if (unassignedNumbers.length === 0) {
                signedPublishers = publishers;
            } else {
                publishers.forEach(publisher => {
                    unassignedNumbers.forEach(number => {
                        let unsignedPublisher = "";
                        if (number.publisher !== null) {
                            unsignedPublisher = number.publisher[0];
                        }
                        
                        if (!unsignedPublisher.equals(publisher._id)) {
                            signedPublishers.push(publisher);
                        }
                    });
                });
            }

            return res.status(200).json({
                success: true,
                data: signedPublishers
            });
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: e
            });
        }
    },
    create: async function (req, res) {
        // create user
        try {
            const number = await NumberCreate(req.body);
            return res.status(200).json({
                success: true,
                data: await GetNumberById(number._id)
            });
        } catch (err) {
            console.log('create user : ', err);
            return res.status(500).send({
                success: false,
                message: err,
            });
        }
    },
    update: async function (req, res) {
        try {
            const number = await NumberUpdate(req.params.id, req.body);

            return res.status(200).json({
                success: true,
                data: await GetNumberById(number._id)
            });
        } catch (err) {
            console.log('update number : ', err);
            return res.status(500).send({
                success: false,
                message: err,
            });
        }
    },
    delete: async function (req, res) {
        try {
            const result = await NumberDelete(req.params.id);

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            console.log('update number : ', err);
            return res.status(500).send({
                success: false,
                message: err,
            });

        }
    },
    setAssignPublisher: async function (req, res) {
        try {
            const result = await SetAssignPublisher(req.body);

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            console.log('update number : ', err);
            return res.status(500).send({
                success: false,
                message: err,
            });

        }
    }
}