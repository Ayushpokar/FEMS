import { json } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../db/connection.js";
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";
const now = new Date();
const URL = process.env.VITE_FRONTEND_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "pokarayushr@gmail.com",
        pass: "vucu dafc dwll kltp"
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
            payload.user_id,
            null
        ]
        const result2 = await pool.query(query2, values2);
        const query3 = "INSERT INTO fems.tbl_event_details(event_id, guest_id, user_id, group_id) VALUES($1,$2,$3,$4)";
        const values3 = [
            id,
            payload.guest_id || null,
            payload.user_id,
            payload.group_id || null
        ]
        const result3 = await pool.query(query3, values3);
        const guest_name = await pool.query("SELECT name FROM fems.tbl_guest WHERE id=$1", [2]);
        const sendingmail = {
            from: "pokarayushr@gmail.com",
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
                    <td style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;">${payload.event_fee}</td></tr>
                <tr><th style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;width: 30%;">Expected Audience Size</th>
                <td style="border: 1px solid #ffffff;padding: 8px;text-align: left;background-color: #96D4D4;">${payload.audience_size}</td></tr>
                </table>    
            <br>
            <p>
            <a href="${URL}/event/${id}" style="margin-right: 10px; text-decoration: none;  padding: 6px 10px;  background-color: #007BFF;
            color: white;   border-radius: 4px;  font-size: 14px;">View Event</a>
            </p>
            </body>
            </html>`
        }
        transporter.sendMail(sendingmail, (error, info) => {
            if (error) {
                return console.log(error);
            }
            return res.status(201).json({ status: "success", message: "Event is Created" })
        })
        res.status(201).json({ status: "success", message: "Event is Created" });
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
        const userID = req.user.id;
        const role = req.user.role;
        let params = [];
        let query1;
        if (role === "faculty") {
            query1 = `
        
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
            es_status as status,
            comment
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
			es.event_id as es_event_id,es.description as comment, es.status as es_status
		FROM fems.tbl_event_status as es
		INNER JOIN temp on temp.event_id = es.event_id
		WHERE es.created_at =created_at_max
		)
		ON e.event_id = es_event_id 
        WHERE e.user_id = $1
        ORDER BY ev.id ASC
        ;
        `;
            params = [userID];
        }
        if (role === "hod") {
            query1 = `
        
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
            es_status as status,
            comment,
			u.user_name
        FROM fems.tbl_event_details e
        LEFT JOIN fems.tbl_volunteer_group vg ON e.group_id = vg.id
        LEFT JOIN fems.tbl_guest g ON e.guest_id = g.id
        LEFT JOIN fems.tbl_events ev ON e.event_id = ev.id
		LEFT JOIN fems.tbl_users u ON e.user_id = u.id
        LEFT JOIN 
		(

		WITH temp AS (
		SELECT event_id, max(created_at) as created_at_max
		FROM fems.tbl_event_status
		GROUP BY event_id)
		
		SELECT 
			es.event_id as es_event_id,es.description as comment, es.status as es_status
		FROM fems.tbl_event_status as es
		INNER JOIN temp on temp.event_id = es.event_id
		WHERE es.created_at =created_at_max
		)
		ON e.event_id = es_event_id 
        ORDER BY ev.id ASC
        ;
        `;
            params = [];
        }

        const data = await pool.query(query1, params);
        res.status(200).json(data.rows);
    } catch (error) {
        console.error(error);
        res.status(404).json([]);
    }
}
// get_events_details()

export const getevent = async (req, res) => {
    try {
        const event_id = req.params.id;
        const query = `
               SELECT 
                    COALESCE(pc.participant_count, 0) AS total_participants,
                    pa.attendance_count AS total_attendance,
                    e.*,
                    g.id AS guest_id,
                    vg.id AS group_id,
                    g.name AS guest_name,
                    g.email as guest_email,
                    g.mobile as guest_mobile,
                    g.company as guest_company,
                    g.designation as guest_designation,
                    vg.name AS group_name,
                    status_table.es_status AS current_status,
                    status_table.comment
                FROM 
                    fems.tbl_event_details ed
                LEFT JOIN 
                    fems.tbl_events e ON ed.event_id = e.id
                LEFT JOIN 
                    fems.tbl_guest g ON ed.guest_id = g.id
                LEFT JOIN 
                    fems.tbl_volunteer_group vg ON ed.group_id = vg.id
                -- 1. ISOLATED PARTICIPANT COUNT
                LEFT JOIN (
                    SELECT event_id, COUNT(participate_id) AS participant_count
                    FROM fems.tbl_participate_master
                    GROUP BY event_id
                ) pc ON pc.event_id = ed.event_id
                LEFT JOIN (
                    SELECT event_id, COUNT(participate_id) AS attendance_count
                    FROM fems.tbl_participate_master
                    where is_attended = 'true' and event_id = $1
                    GROUP BY event_id
                ) pa ON pa.event_id = ed.event_id
                -- 2. LATEST STATUS CTE
                LEFT JOIN (
                    WITH temp AS (
                        SELECT event_id, MAX(created_at) as created_at_max
                        FROM fems.tbl_event_status
                        GROUP BY event_id
                    )
                    SELECT es.event_id as es_event_id, es.description as comment, es.status as es_status
                    FROM fems.tbl_event_status as es
                    INNER JOIN temp ON temp.event_id = es.event_id 
                                    AND es.created_at = temp.created_at_max
                ) AS status_table ON e.id = status_table.es_event_id 
                WHERE 
                e.id = $1;
            `;
        // const guest_query = `
        // SELECT id,name
        // FROM fems.tbl_guest ORDER BY name ASC
        //     `;

        // const group_query = `
        // SELECT id,name
        // FROM fems.tbl_volunteer_group ORDER BY name ASC
        //     `;
        const result = await pool.query(query, [event_id]);
        // const guests = await pool.query(guest_query);
        // const groups = await pool.query(group_query);
        res.status(200).json(result.rows[0]);
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
        const result = await pool.query(query, [event_id]);
        res.status(200).json({ message: "Event is Deleted" });
    } catch (error) {
        console.log(error);
        res.status(401).json({ status: "fail", message: "Something went wrong" });
    }

}

export const updatestatus = async (req, res) => {
    try {
        const { id, status } = req.params;
        const payload = req.body ? req.body.comment : null;
        const query = "INSERT INTO fems.tbl_event_status(event_id, user_id, status, description) VALUES($1,$2, $3, $4)";
        const values = [
            id,
            1,
            status || null,
            payload
        ]
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

export const event_for_participate = async (req, res) => {
    const query = `
        SELECT * 
        FROM
        fems
    `
}


export const ReportGeneration = async (req, res) => {
    const payload = req.body;

    const query = `
    SELECT 
        e.*,
        g.name as guest_name,
        g.id as guest_id,
        vg.name as group_name,
        u.user_name as user_name
    FROM
    fems.tbl_event_details ed
    LEFT JOIN fems.tbl_events e ON ed.event_id = e.id
    LEFT JOIN fems.tbl_guest g ON ed.guest_id = g.id
    LEFT JOIN fems.tbl_volunteer_group vg ON ed.group_id = vg.id
    LEFT JOIN fems.tbl_users u ON ed.user_id = u.id
    WHERE e.id = $1 
    `;
    const event_details = await pool.query(query, [payload.event_id]);
    const event = event_details.rows[0];

    function generateReport(event) {
        return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${event.name} Report</title>

<style>
body{
    font-family: Arial, sans-serif;
    padding:40px;
    color:#333;
}

.header{
    text-align:center;
    border-bottom:2px solid #003366;
    margin-bottom:25px;
    padding-bottom:15px;
}

.logo{
    width:80px;
}

.title{
    color:#003366;
    margin:10px 0;
}

table{
    width:100%;
    border-collapse:collapse;
    margin-top:10px;
}

td{
    border:1px solid #ddd;
    padding:10px;
}

.section{
    margin-top:25px;
}

.section-title{
    background:#f5f5f5;
    padding:10px;
    border-left:5px solid #003366;
    font-weight:bold;
}

.footer{
    margin-top:60px;
    text-align:right;
}
</style>
</head>

<body>

<div class="header">
    <img
        src="https://vit-fems.vercel.app/assets/VIT-BQRcv4ps.png"
        class="logo"
    />

    <h1 class="title">VIT Event Report</h1>
</div>

<div class="section">

<div class="section-title">
    Event Information
</div>

<table>
<tr>
<td><b>Event Name</b></td>
<td>${event.name}</td>
</tr>

<tr>
<td><b>Description</b></td>
<td>${event.descrp}</td>
</tr>

<tr>
<td><b>Category</b></td>
<td>${event.category}</td>
</tr>

<tr>
<td><b>Venue</b></td>
<td>${event.venue}</td>
</tr>

<tr>
<td><b>Mode</b></td>
<td>${event.mode_of_event}</td>
</tr>

<tr>
<td><b>Audience Size</b></td>
<td>${event.audience_size}</td>
</tr>

<tr>
<td><b>Registration Fee</b></td>
<td>₹${event.registration_fee}</td>
</tr>

<tr>
<td><b>Expected Cost</b></td>
<td>₹${event.total_cost}</td>
</tr>
<tr>
<td><b>Actual Cost</b></td>
<td>₹${payload.actualBudget}</td>
</tr>

<tr>
<td><b>Guest</b></td>
<td>${event.guest_name}</td>
</tr>

<tr>
<td><b>Organizer Group</b></td>
<td>${event.group_name}</td>
</tr>

<tr>
<td><b>Created By</b></td>
<td>${event.user_name}</td>
</tr>

<tr>
<td><b>Start Date</b></td>
<td>${new Date(event.start_date).toLocaleString()}</td>
</tr>

<tr>
<td><b>End Date</b></td>
<td>${new Date(event.end_date).toLocaleString()}</td>
</tr>
<tr>
<td><b>Outcome</b></td>
<td>${payload.outcomes}</td>
</tr>
</table>

</div>

<div class="section">

<div class="section-title">
Event Summary
</div>

<p>
The <strong>${event.name}</strong> event was conducted at
<strong>${event.venue}</strong> in
<strong>${event.mode_of_event}</strong> mode under the
<strong>${event.category}</strong> category.

The event targeted approximately
<strong>${event.audience_size}</strong> participants and was managed by
<strong>${event.group_name}</strong>.
</p>
</div>

<div class="footer">
<p>Generated on: ${new Date().toLocaleString()}</p>
<br><br>
________________________<br>
Event Coordinator
</div>

</body>
</html>
`;
    }
    const html = generateReport(event);
    const browser = await puppeteer.launch({
        headless: true,
        args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu', 
        '--disable-dev-shm-usage' 
    ]
    });

    const fileName = `event-${event.id}.pdf`;
    const reportsDir = path.join(process.cwd(), "reports");
    const pdfPath = path.join(reportsDir, fileName);

    try {
        const page = await browser.newPage();

        await page.setContent(html, {
            waitUntil: "domcontentloaded",
            timeout:60000
        });


        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }



        await page.pdf({
            path: pdfPath,
            format: "A4",
            printBackground: true
        });
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    const reportPath = `reports/${fileName}`;
    const values = [
        event.id,
        payload.user_id,
        payload.outcomes,
        payload.actualBudget || 0,
        reportPath
    ];

    const checkrepot_query = "SELECT * FROM fems.tbl_reports WHERE event_id = $1";
    const checkreport = await pool.query(checkrepot_query, [event.id]);
    if (checkreport.rowCount >= 1) {

        const update_report_query = "UPDATE fems.tbl_reports SET outcome=$1,actual_budget_used=$2, url=$3, created_at = CURRENT_TIMESTAMP WHERE event_id = $4";
        const update_values = [
            payload.outcomes,
            payload.actualBudget || 0,
            reportPath,
            event.id
        ]
        await pool.query(update_report_query, update_values);
    }
    else {
        const reportresult = await pool.query(`INSERT INTO fems.tbl_reports(event_id,user_id,outcome,actual_budget_used,url) VALUES ($1,$2,$3,$4,$5)`, values);
    }

    res.status(201).json({ filePath: reportPath });

}
// ReportGeneration()

export const reports = async (req, res) => {
    const result = await pool.query(`SELECT 
        r.*,
        u.user_name,
        u.user_email,
        e.name
        FROM 
        fems.tbl_reports r
        LEFT JOIN fems.tbl_users u ON r.user_id = u.id
        -- (
        -- SELECT 
        -- *
        -- FROM
        -- fems.tbl_participate_master
        -- )
        LEFT JOIN fems.tbl_events e ON e.id = r.event_id 
        `);
    res.status(200).json(result.rows)
}