const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    name: {
        type: String,
        required: false,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: false,
        minlength: 5,
        maxlength: 1024
    },
    role: {
        type: String,
        minlength: 5,
        maxlength: 10,
    },
    terms: {
        type: Boolean,
    },
    company: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    phone: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    website: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    dob: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    address: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    city: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    state: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    zipcode: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    country: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    timezone: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    twitter: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    facebook: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    youtube: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    linkedin: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    instagram: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    interest: {
        type: String,
        minlength: 3,
        maxlength: 50,
    },
    twilloSubAccountSid: {
        type: String,
    },
    created: {
        type: Date,
    },
    createdBy: {
        type: String,
    },
    updatedBy: {
        type: String,
    },
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});

const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR || 10;

UserSchema.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
  
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
  
        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });  
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
