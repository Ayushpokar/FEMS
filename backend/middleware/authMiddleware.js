import jwt from "jsonwebtoken";
import express from "express";
export const auth = (req, res, next)=>{
    const token = req.cookies.auth_token;
    if(!token){
        return res.status(401).json({message: "No token, authorization denied"});   
    }
    console.log(token);
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        res.status(400).json({message: "Token is not valid"});

    }
};


export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: "Access Denied."});
        }
        next();
    }
}