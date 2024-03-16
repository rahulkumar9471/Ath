const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.signup = async (req, res) => {
    try{

        const {name, email, password, role} = req.body;

        const existinguser = await User.findOne({email});

        if(existinguser){
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            })
        }

        let hashedPassword

        try{
            hashedPassword = await bcrypt.hash(password, 10)
        }catch(err){
            return res.status(500).json({
                success: false,
                message: 'Error while hashing password',
            })
        }

        const user = await User.create({
            name, email, password: hashedPassword, role
        })

        return res.status(200).json({
            success: true,
            message: 'User created successfully', 
        })

    }catch(e){
        console.error(e);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
} 


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

        // user = user.toObject();
        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours in milliseconds
            httpOnly: true,
        };

        res.cookie('token', token, options).status(200).json({
            success: true,
            token: token,
            user: user,
            message: 'Login successful'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
