import { json } from "express";
import pool from "../../db/connection.js";

const now = new Date();

export const createparticipate = async (req, res)=>{
    try {
        const data = req.body;
        const query = "INSERT INTO fems.tbl_participate(name,email,mobile,employment_status, organisation_name, city) VALUES($1,$2,$3,$4,$5,$6) RETURNING id";
        const values =[
            data.name,
            data.email || null,
            data.mobile || null,
            data.employment_status || null,
            data.organisation_name || null,
            data.city || null
        ]
        const participate_id = await pool.query(query, values);
        const query_for_master = "INSERT INTO fems.tbl_participate_master(participate_id, event_id) VALUES($1, $2)";
        const result = await pool.query(query_for_master, [participate_id.rows[0].id, data.event_id]);
        res.status(200).json({message: "Registration done"});
    } catch (error) {
        console.log(error);
    }
}