import express from "express";
import 'dotenv/config';
import router from "./routes/eventRoutes.js";
import cors from "cors";
import path from 'path';
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({  
    origin: process.env.VITE_URL,
    credentials: true,
}));
app.use(cookieParser());

console.log(process.env.VITE_URL)

app.use(express.json()); 
app.use("/", router);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/register', (req, res)=>{
    res.sendFile(__dirname+'/public/faculty'+ '/register.html');
})

app.get('/create/guest', (req, res)=>{
    res.sendFile(__dirname+'/public/guest'+'/guest.html');
})

app.get('/event/register', (req, res)=>{
    res.sendFile(__dirname+'/public/event'+'/participate.html');
})

app.get('/event/create', (req, res)=>{
    res.sendFile(__dirname+'/public/event'+'/create.html');
})

app.get('/createstatus',(req, res)=>{
    res.sendFile(__dirname+'/public/event'+'/eventStatus.html');
})

app.get('create/volunteer', (req, res)=>{
    res.sendFile(__dirname+'/public/volunteer'+'/add_volunteer.html');
})
app.get('create/volunteergroup', (req, res)=>{
    res.sendFile(__dirname+'/public/volunteer'+'/volunteer_group.html');
})

app.get('/events',(req, res)=>{
    res.sendFile(__dirname+'/public/event'+'/allevent_details.html')
})
// public/event/allevent_details.html

app.get('/event/edit',(req, res)=>{
    res.sendFile(__dirname+'/public/event'+'/edit_event.html');
})

app.listen(port,()=>{
    console.log('server is running on:',port);
})