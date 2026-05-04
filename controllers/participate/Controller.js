import { json } from "express";
import pool from "../../db/connection.js";

const now = new Date();

export const participate = async (req, res)=>{
    try {
        const data = req.body;
        const query = "INSERT INTO fems.tbl_participate(name,email,mobile,employment_status, organisation_name, city) VALUES($1,$2,$3,$4,$5,$6)";
        const values =[
            data.name,
            data.email,
            data.mobile,
            data.employment_status,
            data.organisation_name,
            data.city
        ]
        const result = await pool.query(query, values)
        res.status(200).json({message: "Registration done"});
    } catch (error) {
        console.log(error);
    }
}