const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const {
    ValidateEmail,
} = require('../services/user');
const { comparePasswords } = require('../shared/utils');

module.exports = {
    login: async function (req, res) {
        const {
            email,
            password
        } = req.body;

        try {
            const user = await ValidateEmail(email);
            if (!user) {
                return res.status(403).send({
                    success: false,
                    message: 'Email does not exist!'
                });
            }

            // compare password
            const areEqual = await comparePasswords(user.password, password);
            if (!areEqual) {
                return res.status(403).send({
                    success: false,
                    message: 'Password is not correct!'
                });
            }

            const token = jwt.sign({id: user._id}, process.env.SECRET_KEY, {
                expiresIn: 36000 //expires in 24 hours
            });

            const payload = {
                access_token: token,
                expires_in: 36000,
                refresh_token: "",
                token_type: "Bearer"
            };

            return res.status(200).send({success: true, data: {
                user,
                token: payload
            }});

        } catch (error) {
            console.log('login : ', error);
            res.status(500).send(error);
        }
    },
}