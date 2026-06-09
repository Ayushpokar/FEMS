import express from 'express';
import { GoogleGenAI } from '@google/genai';
import pool from '../../db/connection.js';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const DraftOutcome = async (req, res) => {
    const event_id = req.params.event_id;
    try {
        const event_query = "SELECT * FROM fems.tbl_events WHERE id=$1";
        const eventData= await pool.query(event_query,[event_id]);
        const event = eventData.rows[0];

        const prompt = `
        You are a professional university Event Coordinator. 
        Write a concise, 2-paragraph official outcome report for an event. 
        Do not include placeholders, intro text, or signatures. Just the raw report text.
        
        Event Details:
        - Name: ${event.name}
        -Description: ${event.descrp}
        - Category: ${event.category}
        - Planned Budget: ₹${event.total_cost}
        
        Instructions:
        - Analyze the budget (was it under budget, over budget, or exact?).
        - also add br tag between para.
        - Write in a highly professional, academic tone suitable for a Head of Department to read.
        `;
        const response = await ai.models.generateContent({
            model:'gemini-2.5-flash',
            contents: prompt
        });
        const aiDraft = response.text;
        res.status(200).json({draft: aiDraft})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to generate AI draft" });

    }
}
// DraftOutcome()