const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req,res,next) => {
    try{
        const token = req.body.token;
        if(!token){
            return res.status(401).json({
                success: false,
                message: 'Please provide token',
            })
        }

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded); 
            req.user = decoded;
        }catch(e){
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            })
        }

        next();
       
    }catch(e){
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success: false,
                message: 'You are not a student',
            })
        }
        next();
    }catch(e){
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role!== "Admin"){
            return res.status(401).json({
                success: false,
                message: 'You are not an admin',
            })
        }
        next();
    }catch(e){
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}