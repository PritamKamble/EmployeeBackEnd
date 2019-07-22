const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');



exports.register = (req, res, next) => {
    console.log(req.body);
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail Already exists"
                });
            } else {
                bcrypt.hash(req.body.pass, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            pass: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                const token = jwt.sign(
                                    {
                                        email: result.email,
                                        userId: result._id
                                    },
                                    "secret",
                                    {
                                        expiresIn: "1h"
                                    }
                                );
                                return res.status(201).json({
                                    message: "User created",
                                    token: token
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
};

exports.login = (req, res, next) => {
    console.log(req.body.email);



    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.pass, user[0].pass, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        "secret",
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.reset = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Mail doesn\'t Exist"
                });
            }

            var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
            var key = user[0].pass;
            var text = user[0]._id + 'time:' + new Date();
            var cipher = crypto.createCipher(algorithm, key);
            var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

            var finalChipher = crypto.createCipher('aes256', 'password');
            var finalEncrypt = finalChipher.update(encrypted + 'email:' + user[0].email, 'utf8', 'hex') + finalChipher.final('hex');

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '7208436929.pk@gmail.com',
                    pass: 'pritpk1234'
                }
            });
            var mailOptions = {
                from: '7208436929.pk@gmail.com',
                to: req.body.email,
                subject: 'Please reset your password',
                text: 'http://localhost:4200/auth/reset/' + finalEncrypt
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(201).json({
                        res: 'Email Sent'
                    });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.changePassword = async(req, res, next) => {

    var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
    var key = 'password';
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(req.params.id, 'hex', 'utf8') + decipher.final('utf8');

    var id = decrypted.split('email:')[0];
    var email = decrypted.split('email:')[1];
    console.log('email is', email);
    console.log('id is', id);
    
    User.find({ email: email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Mail doesn\'t Exist"
                });
            }

            console.log(user[0].pass);
            
            

            var finalDecipher = crypto.createDecipher('aes256', user[0].pass);
            var finalDecrypted = finalDecipher.update(id, 'hex', 'utf8') + finalDecipher.final('utf8');

            console.log(new Date());
            console.log(new Date(finalDecrypted.split('time:')[1]));
            
            
            var t = (new Date().getTime() - new Date(finalDecrypted.split('time:')[1]).getTime());

            // console.log(new Date(0, 0, 0, ));

            // bcrypt.hash(req.body.pass, 10, (err, hash) => {
            //     if (err) {
            //         return res.status(500).json({
            //             error: err
            //         });
            //     } else {
            //         User.update({ _id: finalDecrypted.split('time:')[0] }, { pass: hash })
            //             .exec()
            //             .then(result => {
            //                 res.status(201).json({
            //                     new: result
            //                 });
            //             })
            //             .catch(err => {
            //                 res.status(500).json({
            //                     error: err
            //                 });
            //             });
            //     }
            // });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Link is Expired'
            });
        });
};