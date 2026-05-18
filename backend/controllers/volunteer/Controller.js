import { json } from "express";
import pool from "../../db/connection.js";
import { error } from "console";

export const addvolunteer = async (req, res)=>{
    try{
    const payload = req.body;
    console.log('volunteer',payload);
    const query1 = "SELECT * FROM fems.tbl_volunteer WHERE register_number=$1";
    const check_student = await pool.query(query1, [payload.register_number]);
    if(check_student.rowCount >= 1){
        return res.status(203).json({status:'fail', message:"User already register"});
    }
    const query2 = "INSERT INTO fems.tbl_volunteer(register_number,name,email,mobile,department) VALUES($1,$2,$3,$4,$5)";
    const values = [
        payload.register_number,
        payload.name,
        payload.email,
        payload.mobile,
        payload.department
    ]
    const result = await pool.query(query2, values);
    console.log(result);
    res.status(200).json({message: "User Inserted"});
    }
    catch(error){
        console.log(error)
    }
    // res.status()
}

export const getvolunteer = async (req,res)=>{
    try {
        const query = "SELECT * FROM fems.tbl_volunteer ORDER BY id";
        const result = await pool.query(query);
        console.log(result.rows)
        res.status(200).json(result.rows);

    } catch (error) {
        console.log(error)
    }
}

export const creategroup = async (req,res)=>{
    try {
        const payload = req.body;
        console.log(payload)
        const query = "INSERT INTO fems.tbl_volunteer_group(name, register_number) VALUES($1,$2)";
        const values = [
            payload.name,
            payload.register_number
        ]
        const result = await pool.query(query, values);
        res.status(201).json({message: "Group Created"})
    } catch (error) {
        console.log(error)
    }
}

export const getvolunteer_group = async (req, res)=>{
    try {
        const query= "SELECT * FROM fems.tbl_volunteer_group ORDER BY id";
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error)
        res.status(404)
    }
}