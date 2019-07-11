const mongoose = require('mongoose');

const empSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String },
    age: { type: String },
    dateOfBirth: { type: String },
    salary: { type: String },
    address: { type: String },
    contact: { type: String },
    hobbies: {},
    techSkills: {},
    state: { type: String },
    city: { type: String },
    zipCode: { type: Number },
    employeeImage: { type: String, required: true }
});

module.exports = mongoose.model('Emp', empSchema);
