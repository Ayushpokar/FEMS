import express from 'express';
import { GoogleGenAI } from '@google/genai';
import pool from '../../db/connection.js';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const DraftOutcome = async (req, res) => {
    const event_id = req.params.event_id;
    try {
        const event_query = "SELECT * FROM fems.tbl_events WHERE id=$1";
        const eventData = await pool.query(event_query, [event_id]);
        const event = eventData.rows[0];

        const prompt = `
        You are a professional university Event Coordinator. 
Write a concise, 2-paragraph official outcome report for the event detailed below. 
Do not include any greetings, placeholders, introductory filler, or signatures. Output only the raw report text.

Event Details:
- Event Name: ${event.name}
- Description: ${event.descrp}
- Category: ${event.category}
- Planned Budget: ₹${event.total_cost}
- Actual Expenditure: ₹${event.actual_cost || event.total_cost} 

Instructions:
1. Paragraph 1 (Execution & Impact): Summarize the successful execution of the event based on its description and category. Highlight its academic or institutional value in a highly professional, academic tone suitable for a Head of Department.
2. Paragraph 2 (Financial Assessment): Analyze the financial execution by comparing the Planned Budget to the Actual Expenditure. Explicitly state if the event was completed under budget, exactly on budget, or over budget, and conclude with a brief statement on the event's overall administrative efficiency.
3. Formatting constraint: You MUST separate the two paragraphs with exactly one <br> tag. Do not use standard markdown line breaks.
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: prompt
        });
        const aiDraft = response.text;

        if (!aiDraft) {
            return res.status(400).json({
                success: false,
                error: "The AI was unable to generate a report for these details."
            });
        }
        res.status(200).json({ success: true, draft: aiDraft })
    } catch (error) {
        console.log("Error:", error);

        if (error?.status === 503 || (error?.message && error?.message.includes('503'))) {
            return res.status(503).json({
                success: false,
                error: "The AI model is currently busy. Please try again in a moment."
            })
        }
        if(error?.status=== 429 || (error?.message && error?.message.includes('429'))){
            return res.status(503).json({
                success: false,
                error: "Your today's limit is over. Try after some time."
            })
        }
        return res.status(500).json({
            success: false,
            error: "An unexpected internal server error occurred."
        })
    }
}
