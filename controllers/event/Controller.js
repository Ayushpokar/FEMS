import { json } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../db/connection.js";
import nodemailer from 'nodemailer';
const now = new Date();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "pokar.ayush2024e@vitstudent.ac.in",
        pass: "fbgl dmal qpyt vmro"
    }
});


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
        const id = result.rows[0].id
        const query2 = "INSERT INTO fems.tbl_event_status(event_id,user_id, description) VALUES($1, $2, $3)";
        const values2 = [
            id,
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
        const guest_name = await pool.query("SELECT name FROM fems.tbl_guest WHERE id=$1", [payload.guest_id]);
        console.log(guest_name.rows[0].name)
        const sendingmail = {
            from: "pokar.ayush2024e@vitstudent.ac.in",
            to: "maniparpatel@gmail.com",
            subject: "New Event Created",
            text: '',
            html: `
            <html>
            <head><style>
            p{
                color: red;
            }
            </style></head>
                        <body>
            <h3>New Event Created</h3>

            <p>A new event has been created. Please take action as soon as possible.</p>

            <table style="width: 100%;max-width: 600px;border-collapse: collapse;">
                <tr><th style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;width: 30%;">Event Created By</th>
                    <td style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;">Faculty Ma'am</td></tr>
                <tr><th style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;width: 30%;">Event Name</th>
                    <td style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;">${payload.event_name}</td></tr>
                <tr><th style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;width: 30%;">Event Description</th>
                    <td style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;">${payload.event_descrption}</td></tr>
                <tr><th style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;width: 30%;">Event Venue</th>
                    <td style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;">${payload.event_venue}</td></tr>
                <tr><th style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;width: 30%;">Event Mode</th>
                    <td style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;">${payload.event_mode}</td></tr>
                <tr><th style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;width: 30%;">Event Start Time</th>
                    <td style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;">${payload.event_start_time}</td></tr>
                <tr><th style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;width: 30%;">Event End Time</th>
                    <td style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;">${payload.event_end_time}</td></tr>
                <tr><th style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;width: 30%;">Event Guest</th>
                    <td style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;">${guest_name.rows[0].name}</td></tr>
                <tr><th style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;width: 30%;">Event Total Cost</th>
                    <td style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;">${payload.total_cost}</td></tr>
                <tr><th style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;width: 30%;">Event Registration Fee</th>
                    <td style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;">${payload.event_name}</td></tr>
                <tr><th style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;width: 30%;">Expected Audience Size</th>
                <td style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;">${payload.audience_size}</td></tr>
                </table>    
            <br>
            <p>
            <a href="http://localhost:7000/updatestatus/${id}/approved" style="margin-right: 10px; text-decoration: none;  padding: 6px 10px;  background-color: #007BFF;
            color: white;   border-radius: 4px;  font-size: 14px;">Approve</a>
            <a href="http://localhost:7000/updatestatus/${id}/rejected" style="margin-right: 10px; background-color: #dc3545;text-decoration: none;  padding: 6px 10px;
            color: white;   border-radius: 4px;  font-size: 14px;">Reject</a>
            <a href="http://localhost:7000/event/edit?id=${id}" style="background-color: #ffc107; color: black; text-decoration: none;  padding: 6px 10px;
            color: white;   border-radius: 4px;  font-size: 14px;">Request Modification</a>
            </p>

            </body>
            </html>`
                    }
        transporter.sendMail(sendingmail, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email send', info.response);
        })
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
        
        SELECT 
			ev.id as event_id,
            ev.name as event_name,
            ev.descrp,
            ev.venue,
            ev.start_date,
            ev.end_date,
            ev.registration_fee,
            vg.name as group_name , 
            g.name as guest_name,
            es_status as status
        FROM fems.tbl_event_details e
        LEFT JOIN fems.tbl_volunteer_group vg ON e.group_id = vg.id
        LEFT JOIN fems.tbl_guest g ON e.guest_id = g.id
        LEFT JOIN fems.tbl_events ev ON e.event_id = ev.id
        LEFT JOIN 
		(

		WITH temp AS (
		SELECT event_id, max(created_at) as created_at_max
		FROM fems.tbl_event_status
		GROUP BY event_id)
		
		SELECT 
			es.event_id as es_event_id, es.status as es_status
		FROM fems.tbl_event_status as es
		INNER JOIN temp on temp.event_id = es.event_id
		WHERE es.created_at =created_at_max
		)
		ON e.event_id = es_event_id 
        ORDER BY ev.id ASC
        ;
        `;
        const data = await pool.query(query1);
        res.status(200).json(data.rows);
    } catch (error) {
        console.error(error);
        res.status(404).json({ status: "fail", message: "Something went wrong" });
    }
}
// get_events_details()

export const getevent = async (req, res) => {
    try {
        const event_id = req.params.id;
        const query = `
            SELECT 
            e.*,
            g.id as guest_id,
            vg.id as group_id
            FROM 
            fems.tbl_event_details ed
            LEFT JOIN fems.tbl_events e ON ed.event_id = e.id
            LEFT JOIN fems.tbl_guest g ON ed.guest_id = g.id
            LEFT JOIN fems.tbl_volunteer_group vg ON ed.group_id = vg.id
            WHERE e.id = $1
            `;
        const guest_query = `
        SELECT DISTINCT (name),id
        FROM fems.tbl_guest
            `;

        const group_query = `
        SELECT DISTINCT(name),id
        FROM fems.tbl_volunteer_group
            `;
        const result = await pool.query(query, [event_id]);
        const guests = await pool.query(guest_query);
        const groups = await pool.query(group_query);
        res.status(200).json({ "values": result.rows, "guests": guests.rows, "groups": groups.rows });
        // console.log(result.rows);
    } catch (error) {
        console.log(error);
        res.status(403).json({ status: "fail", message: "This event is not found" });
    }
}

export const updateevent = async (req, res) => {
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
        const result1 = await pool.query(query1, values1);
        const query2 = "UPDATE fems.tbl_event_details SET guest_id=$1,group_id=$2 WHERE event_id=$3";
        const values2 = [payload.guest_id, payload.group_id, event_id];
        const result2 = await pool.query(query2, values2);
        // const query3 = "INSERT INTO fems.tbl_event_status(event_id, user_id, status, description) VALUES($1,$2, $3, $4)";
        // const values3 = [
        //     event_id,
        //     1,
        //     'modified',
        //     null
        // ]
        // const result3 = await pool.query(query3, values3);
        res.status(201).json({ message: " Event is Modified" });
    } catch (error) {
        console.log(error);
        res.status(403).json({ status: "fail", message: "Something went wrong while modifing Event." })
    }
}


export const deleteevent = async (req, res) => {
    try {
        const event_id = req.params.id;
        const query = "CALL fems.proc_delete_event($1)";
        const result = await pool.query(query,[event_id]);
        res.status(200).json({ message: "Event is Deleted" });
    } catch (error) {
        console.log(error);
        res.status(401).json({ status: "fail", message: "Something went wrong" });
    }

}

export const updatestatus = async (req, res) => {
    try {
        const { id, status } = req.params;
        console.log(status);
        const payload = req.body ? req.body.comment : null;
        const query = "INSERT INTO fems.tbl_event_status(event_id, user_id, status, description) VALUES($1,$2, $3, $4)";
        const values = [
            id,
            1,
            status || null,
            payload
        ]
        console.log(values);
        const result = await pool.query(query, values);
        if (req.method == 'GET') {
            return res.status(200).send(`    
        <script>
        alert("Event is ${status}");
        window.close();
        setTimeout(() => {
          document.body.innerHTML = "<h1>Action Completed. You can now close this tab.</h1>";
        }, 500);
        </script>
        `);
        }
        res.status(200).json({ message: `Action is ` + status });
    } catch (error) {
        console.log(error);
    }
}

export const event_for_participate = async (req, res) =>{
    const query = `
        SELECT * 
        FROM
        fems
    `
}