import React, { createElement, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';


const API = import.meta.env.VITE_API_URL;

export function GenerateReport() {
    const { event_id } = useParams();
    const { id } = useAuth();

    const navigate = useNavigate();

    // 1. Streamlined Form State
    const [formData, setFormData] = useState({
        event_id: event_id,
        user_id: id,
        actualBudget: '',
        outcomes: ''
    });

    // Dummy event data to match your screenshot
    const [eventDetails] = useState({
        name: "",
        plannedBudget: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    const handleGenerateAIDraft = async () => {
        setIsGeneratingAI(true);
        setFormData(prev => ({
            ...prev,
            outcomes: ''
        })); 
        try {
            const res = await axios.get(`/api/reports/ai-draft/${event_id}`);
            setFormData(prev => ({
                ...prev,
                outcomes: res.data.draft
            }));
        } catch (error) {
            console.log(error);
            if (error.response.status === 500 || error.response.status === 503) {
                return alert(error.response.data.error);
            }
            alert("Something went wrong");  
        }finally{
            setIsGeneratingAI(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDownload = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 1. INSTANTLY open a blank tab right when the user clicks!
        // The browser trusts this 100% because there is no delay.
        const pdfWindow = window.open('', '_blank');

        // Optional: Write a friendly loading message in the new tab
        pdfWindow.document.write('<h2>Generating your Event Report, please wait...</h2>');

        try {
            console.log("Preparing data for download:", formData);

            // 2. Do all your heavy backend waiting...
            const res = await axios.post('/api/report', formData);
            const { filePath } = res.data;
            const fullPath = `${API}/${filePath}`;

            const fileResponse = await fetch(fullPath);
            if (!fileResponse.ok) throw new Error("Failed to fetch the PDF.");

            const blob = await fileResponse.blob();
            const localBlobUrl = window.URL.createObjectURL(blob);

            // 3. MAGIC TRICK: Update the URL of the tab we already opened!
            // The browser allows this without triggering the popup blocker.
            pdfWindow.location.href = localBlobUrl;

            // Clean up memory after 10 seconds
            setTimeout(() => {
                window.URL.revokeObjectURL(localBlobUrl);
            }, 10000);

            alert("Report Created Successfully!");

        } catch (error) {
            console.error("Failed to download report:", error);

            // 4. If the backend fails, quietly close the blank tab so the user isn't confused
            pdfWindow.close();

            alert("Failed to download report. Try again!");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="p-8 bg-gray-50 min-h-screen flex justify-center">

            <div className="w-full max-w-3xl">
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Event
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Event Report  {eventDetails.name}</h1>
                </div>

                {/* Main Form Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

                    {/* Card Header */}
                    <div className="flex items-center gap-2 p-5 border-b border-gray-100">
                        <FileText size={20} className="text-gray-700" />
                        <h2 className="text-lg font-semibold text-gray-800">Submit & Download Report</h2>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleDownload} className="p-6 sm:p-8 space-y-6">

                        {/* Budget Row */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1.5">Actual Budget Used (₹) *</label>
                            <input
                                type="number"
                                name="actualBudget"
                                value={formData.actualBudget}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 text-sm outline-none transition-all"
                                required
                            />
                            {/* <p className="mt-1.5 text   -sm text-gray-500">Planned Budget: ₹{eventDetails.plannedBudget}</p> */}
                        </div>

                        {/* Outcomes Textarea */}
                        <div className="relative">
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-gray-900">Event Outcomes *</label>

                                {/* THE MAGIC AI BUTTON */}
                                <button
                                    type="button"
                                    onClick={handleGenerateAIDraft}
                                    disabled={isGeneratingAI}
                                    className="flex items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors border border-purple-200"
                                >
                                    {isGeneratingAI ? 'Drafting...' : 'Auto-Draft with AI'}
                                    {/* ✨ {isGeneratingAI ? 'Drafting...' : 'Auto-Draft with AI'} */}
                                </button>
                            </div>

                            <textarea
                                name="outcomes"
                                value={formData.outcomes}
                                onChange={handleChange}
                                placeholder="Describe the outcomes and achievements of the event..."
                                rows="6"
                                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg p-4 text-sm outline-none transition-all resize-none"
                                required
                            ></textarea>
                        </div>
                        {/* Download Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg text-sm font-medium text-white transition-all ${isSubmitting
                                ? 'bg-[#0b0f19]/70 cursor-not-allowed'
                                : 'bg-[#0b0f19] hover:bg-black shadow-sm'
                                }`}
                        >
                            <Download size={18} />
                            {isSubmitting ? 'Processing Download...' : 'Download Report'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}