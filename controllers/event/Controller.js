import { json } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../db/connection.js";

const now = new Date();



export const createevent = async (req, res) => {
    try {
        const payload = req.body;
        const query1 = "INSERT INTO fems.tbl_events(name,descrp,venue,category,mode_of_event,registration_fee,start_date,end_date,total_cost,audience_size) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id"

        const values = [
            payload.event_name,
            payload.event_descrption,
            payload.event_venue,
            payload.event_category,
            payload.event_mode,
            payload.event_fee || 0,
            payload.event_start_time,
            payload.event_end_time,
            payload.total_cost || null,
            payload.audience_size || null
        ]

        const result = await pool.query(query1, values);
        const query2 = "INSERT INTO fems.tbl_event_status(event_id,user_id, description) VALUES($1, $2, $3)";
        const values2 = [
            result.rows[0].id,
            1,
            null
        ]
        const result2 = await pool.query(query2, values2);
        const query3 = "INSERT INTO fems.tbl_event_details(event_id, guest_id, user_id, group_id) VALUES($1,$2,$3,$4)";
        const values3 = [
            result.rows[0].id,
            payload.guest_id || null,
            1,
            payload.group_id || null
        ]
        console.log(values3)
        const result3 = await pool.query(query3, values3);
        console.log(result.rows[0].id);
    } catch (error) {
        console.log(error)
        res.status(403).json({ status: "fail", message: "Something went wrong" });
    }
}

export const get_events_details = async (req, res) => {
    try {
        // const query = "SELECT * FROM fems.tbl_event_details WHERE 1=1";
        // const result = await pool.query(query);
        // console.log(result.rows);
        // let data =[];
        // console.log(result.rowCount)

        const query1 = `
        SELECT DISTINCT ON (ev.id) 
			ev.id as event_id,
            ev.name as event_name,
            ev.descrp,
            ev.venue,
            ev.start_date,
            ev.end_date,
            vg.name as group_name , 
            g.name as guest_name,
            es.status
        FROM fems.tbl_event_details e
        LEFT JOIN fems.tbl_volunteer_group vg ON e.group_id = vg.id
        LEFT JOIN fems.tbl_guest g ON e.guest_id = g.id
        LEFT JOIN fems.tbl_events ev ON e.event_id = ev.id
        LEFT JOIN fems.tbl_event_status es ON e.event_id = es.event_id 
		ORDER BY ev.id ,es.created_at DESC
	;
        `;
        const data = await pool.query(query1);
        res.status(200).json(data.rows);
    } catch (error) {
        console.error(error);
        res.status(404).json({status:"fail", message: "Something went wrong"});
    }
}
// get_events_details()

export const getevent = async (req, res)=>{
    try {
        const event_id = req.params.id;
        const query = `
            SELECT 
            e.*,
            g.name as guest_name,
            g.id as guest_id,
            vg.id as group_id,
            vg.name as group_name
            FROM 
            fems.tbl_event_details ed
            LEFT JOIN fems.tbl_events e ON ed.event_id = e.id
            LEFT JOIN fems.tbl_guest g ON ed.guest_id = g.id
            LEFT JOIN fems.tbl_volunteer_group vg ON ed.group_id = vg.id
            WHERE e.id = $1
            `;
        const guest_query = `SELECT id, name 
            FROM fems.tbl_guest 
            WHERE id NOT IN (
                SELECT guest_id 
                FROM fems.tbl_event_details 
                WHERE event_id = $1 AND guest_id IS NOT NULL
            );
            `;

        const group_query = `SELECT id, name 
            FROM fems.tbl_volunteer_group 
            WHERE id NOT IN (
                SELECT group_id 
                FROM fems.tbl_event_details 
                WHERE event_id = $1 AND group_id IS NOT NULL
            );
            `;
        const result = await pool.query(query, [event_id]);
        const guests = await pool.query(guest_query, [event_id]);
        const groups = await pool.query(group_query, [event_id]);
        res.status(200).json({"values":result.rows, "guests": guests.rows, "groups":groups.rows});
        // console.log(result.rows);
    } catch (error) {
        console.log(error);
        res.status(403).json({status:"fail",message:"This event is not found"});
    }
}

export const updateevent = async (req, res)=>{
    try {
        const event_id = req.params.id;
        const payload = req.body;
        console.log(payload);
// const query1 = "INSERT INTO fems.tbl_events(name,descrp,venue,category,mode_of_event,registration_fee,start_date,end_date,total_cost,audience_size) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id"

        const query1 = "UPDATE fems.tbl_events SET name=$1,descrp=$2,venue=$3, category=$4,mode_of_event=$5,registration_fee=$6, start_date=$7, end_date=$8, total_cost=$9, audience_size= $10 WHERE id = $11";
        const values1 = [
            payload.event_name,
            payload.event_descrption,
            payload.event_venue,
            payload.event_category,
            payload.event_mode,
            payload.event_fee,
            payload.event_start_time,
            payload.event_end_time,
            payload.total_cost,
            payload.audience_size,
            event_id
        ]
        const result1= await pool.query(query1, values1);
        const query2 = "UPDATE fems.tbl_event_details SET guest_id=$1,group_id=$2 WHERE event_id=$3";
        const values2 = [payload.guest_id, payload.group_id,event_id];
        const result2 = await pool.query(query2,values2);
        const query3 = "INSERT INTO fems.tbl_event_status(event_id, user_id, status, description) VALUES($1,$2, $3, $4)";
        const values3 = [
            event_id,
            1,
            'modified',
            null
        ]
        const result3 = await pool.query(query3, values3);
        res.status(201).json({message:" Event is Modified"});
    } catch (error) {``
        console.log(error);
        res.status(403).json({status:"fail", message: "Something went wrong while modifing Event."})
    }
}


export const  deleteevent = async (req, res) =>{
    try {
        const event_id = req.params.id;
        const query = "DELETE FROM fems.tbl_event_details WHERE event_id = $1";
        const result = await pool.query(query, [event_id]);
        res.status(200).json({message:"Event is Deleted"});
    } catch (error) {
        console.log(error);
        res.status(401).json({status:"fail", message: "Something went wrong"});
    }

}