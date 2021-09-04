let User = require('../models/UserModel');
let { ValidateUsername, ValidateEmail, UserCreate, UserUpdate, GetUserById } = require('../services/user');

module.exports = {
    get: async function (req, res) { 

    },
    getByPayload: async function (req, res) {
        try {
            const result = await User.find(req.body); 
            
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
    create: async function (req, res) {
        const {
            username,
            email,
        } = req.body;

        // validate email
        const isEmail = await ValidateEmail(email);
        if (isEmail) return res.status(403).json({ success: false, message: 'Email is already registered' });

        // validate username
        const isUsername = await ValidateUsername(username);
        if (isUsername) return res.status(403).json({ success: false, message: 'Username is already registered' });
        
        // create user
        try {
            const user = await UserCreate(req.body);
            
            return res.status(200).json({
                success: true,
                data: await GetUserById(user._id)
            });
        } catch (err) {
            console.log('create user : ', err);
            return res.status(500).json({
                success: false,
                message: err
            });
        }
    },
    update: async function (req, res) {
        const {
            username,
            email,
        } = req.body;
        
        // validate email
        const isEmail = await ValidateEmail(email);
        if (isEmail) return res.status(403).json({ success: false, message: 'Email is already registered' });

        // validate username
        const isUsername = await ValidateUsername(username);
        if (isUsername) return res.status(403).json({ success: false, message: 'Username is already registered' });

        // create user
        try {
            const user = await UserUpdate(req.params.id, req.body);
            
            return res.status(200).json({
                success: true,
                data: await GetUserById(user._id)
            });
        } catch (err) {
            console.log('update user : ', err);
            return res.status(500).send("Update user failed.");
        }
    },
    delete: async function (req, res) {

    }
}