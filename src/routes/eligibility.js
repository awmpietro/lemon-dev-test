const express = require('express');

const Eligibility = express.Router();

module.exports = Eligibility;

const { verifyEligibility } = require('../controllers/eligibilityController');

Eligibility.post('/verify-eligibility', verifyEligibility);
