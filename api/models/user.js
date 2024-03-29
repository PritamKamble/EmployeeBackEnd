const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
    },
    pass: { type: String, required: true },
});

module.exports = mongoose.model('User', Schema);
