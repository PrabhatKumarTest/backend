// Moodule Import
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Moongoose Scheme import
const User = require('../modals/User');

//  Router Initilization
const router = express.Router();

// CRUD Operations

// Rout:1 > CreateUser on http://localhost:5000/createuser :: Create
router.post('/createuser', [
    body('name', "name can not be blank").notEmpty(),
    body('email', 'enter a valid email').isEmail(),
    body('password', "password can not be blank").notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    //condition to check if values from response header are valid 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //securing password by adding hashing
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // Creating a user from the value received from request header
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword // Saving the password in hashedform
        })

        // Creating JWT token with user id as the data
        const data = {
            user: {
                id: user.id
            }
        }
        // Signing the JWT token with string from .env
        const jwtToken = jwt.sign(data, process.env.JWT_PVT_KEY)
        res.json({ jwtToken, user })

    } catch (error) {
        res.status(500).json({ error: "Something went wrong" })
    }
})

// Rout:2 > LoginUser on http://localhost:5000/Login : 
router.post('/login',
    [
        body('email', 'enter a valid email').isEmail(),
        body('password', "password can not be blank").notEmpty()
    ], async (req, res) => {
        const errors = validationResult(req);
        //condition to check if values from response header are valid 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { email,  } = req.body;

            // Checking that if user with the email from req.header present in DataBase
            const user = await User.findOne({ email })
            // if user doesnot exists
            if (!user) {
                return res.status(400).json({ msg: "Invalid User" })
            }
            // if user exists we will check for the password to verify
            const comparedPassword = await bcrypt.compare(password, user.password)
            if (!comparedPassword) {
                return res.status(400).json({ msg: "Invalid User Credentials" })
            }
            // after verifing user we will send jwt tokwn in response
            const data = {
                user: {
                    id: user.id
                }
            }
            const jwtToken = jwt.sign(data, process.env.JWT_PVT_KEY)
            res.json({ jwtToken })
        } catch (error) {
            res.status(500).send("somet")
        }
    })

// Rout:3 > GetAllUser on http://localhost:5000/getuser : 

module.exports = router