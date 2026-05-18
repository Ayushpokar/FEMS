import jwt from "jsonwebtoken";
import express from "express";
export const auth = (req, res, next)=>{
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    console.log("reached"+ authHeader);
    if(authHeader)
    {
        token = authHeader;

        if(!token){
            return res.status(401).json({message:"Invalid Token"})
        }

        try {
            console.log("done")

            const decode = jwt.verify(token, "secret key");
            req.user = decode;
            console.log("done");
            next();
        } catch (err) {
            res.status(400).json({status:"fail",message:"Token is not valid"});
        }
    }
};