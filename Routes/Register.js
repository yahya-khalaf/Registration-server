const express = require('express');
const registerController = require('../Controllers/Register');

const router = express.Router();

router.post('', registerController.patientRegister);

module.exports = router;