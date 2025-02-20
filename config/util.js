const jwt = require('jsonwebtoken');
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Movies = require('../models/movieModel');


// /function to generate token
module.exports.generateToken = (id) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '24h' }); 
    return token;
};
// function to handle error
module.exports.errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
};

// function to handle verify token
module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization; 

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return next(module.exports.errorHandler(401, 'Unauthorized'));
    } 
    const token = authHeader.split(' ')[1]; 

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) { 
            return next(module.exports.errorHandler(403, 'Forbidden'));
        } 
        req.user = user; 
        next();
    });
}; 

