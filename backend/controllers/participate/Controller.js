import { json } from "express";
import pool from "../../db/connection.js";

const now = new Date();

export const createparticipate = async (req, res)=>{
    try {
        const data = req.body;
        console.log(data);
        
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


export const attendence = async (req, res) => {
    try{
        const payload = req.body
        const event_id = payload.id;
        const email = payload.email;
        // log
        const query_for_email_check = `
        SELECT 
            p.id as id
        FROM fems.tbl_participate_master pm
        LEFT JOIN fems.tbl_participate p ON pm.participate_id = p.id 
        WHERE p.email = $1 AND pm.event_id = $2`;

        const result = await pool.query(query_for_email_check,[email, event_id]);
        // console.log(result.rows[0].id);
        
        if(result.rowCount >= 1 ){
            const update_attendence = "UPDATE fems.tbl_participate_master SET is_attended = $1, attended_at = CURRENT_TIMESTAMP WHERE participate_id = $2";
            await pool.query(update_attendence, [true, result.rows[0].id]);
            return res.status(200).json({message: "User found and marked"});
            
        }
        else{
            return res.status(404).json({message: "User is not registered for this event"});
        }
    }
catch(error){
    console.log(error);
}
}