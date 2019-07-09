const mongoose = require('mongoose');

const empSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: String, required: true },
    salary: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    hobbies: {},
    state: { type: String, required: true },
    city: { type: String, required: true },
    employeeImage: { type: String, required: true }
});

module.exports = mongoose.model('Emp', empSchema);
