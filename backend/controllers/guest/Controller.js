import { json } from "express";
import pool from "../../db/connection.js";

const now = new Date();

export const createguest = async (req, res)=>{
    try {
        const data = req.body;        
        const query = "INSERT INTO fems.tbl_guest(name, email, mobile, company, designation) VALUES($1, $2, $3, $4, $5)";
        const values= [
            data.guest_name,
            data.guest_email,
            data.guest_mobile,
            data.guest_company,
            data.guest_designation
        ]
        const result = await pool.query(query, values);
        res.status(201).json({message: "Guest is added"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error Occuried"});
    }
}

export const get_guest_details = async (req, res) => {
    const query = "SELECT * FROM fems.tbl_guest ORDER BY id";
    const result = await pool.query(query);
    res.status(200).json(result.rows);
}