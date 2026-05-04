import { json } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../db/connection.js";

    const now = new Date();

export const register = async (req, res)=>{
    try {
        const data = req.body;
        const hashpassword = await bcrypt.hash(data.user_password, 10);
        const query = "INSERT INTO fems.tbl_users(user_name, user_email, user_mobile, user_role, user_department, user_password) VALUES($1,$2,$3,$4,$5,$6)";
        const values = [
            data.user_name,
            data.user_email,
            data.user_mobile,
            data.user_role,
            data.user_department,
            hashpassword
        ]
        const result = await pool.query(query, values);
        res.status(200).json({message: "User Created"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error})
    }
}