
const express = require("express");
const router = express.Router();
const AuthController = require('../controllers/auth');
const multer=require('multer');

router.post("/register", multer().single(), AuthController.register);

router.post('/login', multer().single(),AuthController.login);

module.exports = router;