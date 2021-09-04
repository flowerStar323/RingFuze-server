let bcrypt = require('bcryptjs');

module.exports = {
    comparePasswords: async (userPassword, currentPassword) => {
        return await bcrypt.compare(currentPassword, userPassword);
    }
};