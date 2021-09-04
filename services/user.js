const User = require('../models/UserModel');

module.exports.ValidateUsername = async function (username) {
    try {
        const userName = await User.findOne({
            username: username.toLowerCase()
        }, {
            '__v': 0,
            'password': 0,
            'deleted': 0,
            'updated_by': 0,
        }).exec();
        if (userName) {
            return userName;
        }
        return null;
    } catch (err) {
        console.error(err.message);
    }
}

module.exports.ValidateEmail = async function (email) {
    try {
        const result = await User.findOne({
            email: email.toLowerCase()
        }).exec();

        if (result) {
            return result;
        }
        return null;
    } catch (err) {
        console.error(err.message);
    }
}

module.exports.UserCreate = async function (req) {
    const {
        username,
        name,
        phone,
        email,
        password,
        role,
        terms,
    } = req;

    let user = new User();
    user.username = username.toLowerCase();
    user.name = name;
    user.phone = phone;
    user.email = email;
    user.password = password;
    user.role = role;
    user.terms = terms;

    const result = await user.save();
    if (result) {
        return result;
    }
    return result;
}

module.exports.UserUpdate = async function (id, params) {
    const filter = { _id: id };
    const update = params;
    
    const result = await User.findOneAndUpdate(filter, update);
    
    if (result) return result;
    return result;
}

module.exports.GetUserById = async function (id) {
    const result = await User
        .findById({
            _id: id,
            'stats.deleted': false
        }, {
            '__v': 0,
            'stats': 0,
            'password': 0,
            'login_attempts': 0,
            'lock_until': 0,
            'account.stats': 0,
            'account.__v': 0,
            'account.default_contact': 0
        })
        .populate('account')
        .exec();
    if (result) {
        return result;
    }
    return null;
}