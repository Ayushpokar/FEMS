import { json } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../db/connection.js";
const now = new Date();

export const register = async (req, res) => {
    try {
        const data = req.body;
        console.log("data");
        
        const hashpassword = await bcrypt.hash(data.user_password, 10);
        const query = "INSERT INTO fems.tbl_users(user_name, user_email, user_mobile, user_role, user_department, user_password) VALUES($1,$2,$3,$4,$5,$6)";
        const values = [
            data.user_name,
            data.user_email,
            data.user_mobile,
            data.user_role || 'faculty',
            data.user_department,
            hashpassword
        ]
        const result = await pool.query(query, values);
        res.status(201).json({ message: "User Created" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);


        const checkquery = "SELECT * FROM fems.tbl_users WHERE user_email=$1";
        const result = await pool.query(checkquery, [email]);
        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user_password = result.rows[0].user_password;

        const isMatch = await bcrypt.compare(password, user_password);
        console.log(isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const user = result.rows[0];
        const token = jwt.sign(
            {
                id: result.rows[0].id,
                role: result.rows[0].user_role,
                name: result.rows[0].user_name
            }, process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
        res.cookie('auth_token', token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 60 * 60 * 1000
        });
        console.log(token);

        res.status(200).json({
            message: "Login Successful",
            user: {
                id: user.id,
                role: user.user_role
            }
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({ status: "fail", message: "Something went wrong" });
    }
}

export const me = (req, res) => {
    res.status(200).json({
        id: req.user.id,
        role: req.user.role
    });
};


export const logout = async (req, res) => {
    try {
        res.clearCookie("auth_token");
        res.json({message: "Logged out"});
    } catch (error) {
        console.log(error);
        
    }
}