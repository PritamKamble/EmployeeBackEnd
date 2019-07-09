const mongoose = require("mongoose");
const Emp = require("../models/employee");
const fs = require("fs");


exports.emp_get_all = (req, res, next) => {
    Emp.find()
        .exec()
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                pathofmethod: 'api_ctrl_employee_emp_get_all()',
                error: err
            });
        });
};

exports.emp_create_emp = (req, res, next) => {
    console.log(req.body);

    const emp = new Emp({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        age: req.body.age,
        salary: req.body.salary,
        address: req.body.address,
        contact: req.body.contact,
        hobbies: req.body.hobbies,
        state: req.body.state,
        city: req.body.city,
        employeeImage: (req.file ? req.file.path : "uploads/default-avatar.png")
    });
    emp.save()
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({
                pathofmethod: 'api_ctrl_employee_emp_create_emp()',
                error: err
            });
        });
};

exports.emp_get_emp = (req, res, next) => {
    const id = req.params.empId;
    Emp.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    emp: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/employee/" + doc._id
                    }
                });
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            res.status(500).json({
                pathofmethod: 'api_ctrl_employee_emp_get_emp()',
                error: err
            });
        });
};

exports.emp_update_emp = (req, res, next) => {
    const id = req.params.empId;
    updateOps = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        age: req.body.age,
        salary: req.body.salary,
        address: req.body.address,
        contact: req.body.contact,
        hobbies: req.body.hobbies,
        state: req.body.state,
        city: req.body.city
    };



    // updateOps['firstName'] = req.body.firstName;
    // updateOps['lastName'] = req.body.lastName;
    // updateOps['email'] = req.body.email;
    // updateOps['gender'] = req.body.gender;
    // updateOps['age'] = req.body.age;
    // updateOps['salary'] = req.body.salary;
    // updateOps['address'] = req.body.address;
    // updateOps['contact'] = req.body.contact;
    // updateOps['hobbies'] = req.body.hobbies;
    // updateOps['state'] = req.body.state;
    // updateOps['city'] = req.body.city;

    // if (req.file) {
    //     updateOps['employeeImage'] = req.file.path;
    // }


    Emp.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Employee updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/employee/" + id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                pathofmethod: 'api_ctrl_employee_emp_update_emp()',
                error: err
            });
        });
};

exports.emp_delete = (req, res, next) => {

    const id = req.params.empId;
    Emp.findById(id)
        .exec()
        .then(result => {
            if (result.employeeImage != "uploads/default-avatar.png") {
                fs.unlinkSync(result.employeeImage);
            }
        });
    Emp.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Employee deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/employee/" + id,
                    body: { firstName: "String", lastName: "String" },
                    result: result
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                pathofmethod: 'api_ctrl_employee_emp_delete_emp()',
                error: err
            });
        });
};