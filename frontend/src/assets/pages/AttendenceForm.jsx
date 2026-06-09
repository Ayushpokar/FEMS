import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, XCircle, CheckCircle, Calendar, MapPin, Clock } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export function AttendancePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Event Data State
    const [eventData, setEventData] = useState(null);
    const [isEventLoading, setIsEventLoading] = useState(true);

    // Attendance Form State
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'not_registered' | 'success'

    // 1. Fetch Event Details on Load
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                // Adjust this endpoint to match your actual backend route
                const res = await axios.get(`/api/getevent/${id}`);
                setEventData(res.data);
                console.log(res.data);
                
            } catch (error) {
                console.error("Failed to fetch event details:", error);
            } finally {
                setIsEventLoading(false);
            }
        };
        fetchEventDetails();
    }, [id]);

    // 2. Handle Attendance Submission
    const handleMarkPresent = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('submitting');

        try {
            // Replace with your actual POST request to mark attendance
            const res = await axios.post(`/api/event/attendence`, { id, email });
            setStatus('success');

        } catch (error) {
            console.error("Attendance error:", error);
            // If backend throws a 404 (User not found in participation table)
            if (error.response ) {
                setStatus('not_registered');
            
             if(error.response.status === 404) {
                setStatus('not_registered');
            }
            else if(error.response.status === 400){
                alert("Attendance has already been marked for this email.");
                setStatus('idle');
            }else {
                alert("Something went wrong. Please try again.");
                setStatus('idle');
            }
        }
        }
    };

    // 3. Reset form to try again
    const handleTryAgain = () => {
        setEmail('');
        setStatus('idle');
    };

    // --- RENDERING ---

    if (isEventLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#eefcf7]">
                <p className="text-gray-500 font-medium animate-pulse">Loading event details...</p>
            </div>
        );
    }

    if (!eventData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#eefcf7]">
                <p className="text-red-500 font-bold">Event not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#eefcf7] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8">
                
                {/* TOP SECTION: Event Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{eventData.name}</h1>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {eventData.descrp}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                        <div className="flex items-center gap-3 text-gray-700">
                            <Calendar className="text-[#00a859]" size={20} />
                            <span className="text-sm font-medium">
                                {new Date(eventData.start_date).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <Clock className="text-[#00a859]" size={20} />
                            <span className="text-sm font-medium">
                                {new Date(eventData.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <MapPin className="text-[#00a859]" size={20} />
                            <span className="text-sm font-medium">{eventData.venue}</span>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION: Attendance Form (Matching your screenshots) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 max-w-xl mx-auto">
                    
                    {/* STATE 1: IDLE / ENTRY FORM */}
                    {(status === 'idle' || status === 'submitting') && (
                        <form onSubmit={handleMarkPresent}>
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Mark Your Attendance</h2>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                    Registered Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter the email you registered with"
                                    required
                                    className="w-full bg-[#f4f5f7] border-transparent focus:bg-white focus:border-[#00a859] focus:ring-2 focus:ring-[#00a859]/20 rounded-lg p-3.5 text-gray-700 outline-none transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-white font-medium transition-colors ${
                                    status === 'submitting' ? 'bg-[#00a859]/70 cursor-not-allowed' : 'bg-[#00a859] hover:bg-[#008f4c]'
                                }`}
                            >
                                <Search size={18} />
                                {status === 'submitting' ? 'Verifying...' : 'Mark Present'}
                            </button>
                        </form>
                    )}

                    {/* STATE 2: ERROR - NOT REGISTERED */}
                    {status === 'not_registered' && (
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-4">
                                <XCircle size={64} className="text-[#ff3b30]" strokeWidth={2} />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1c2536] mb-2">Not Registered</h2>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                                No registration found for this email. Please register first using the registration link.
                            </p>
                            <button
                                onClick={handleTryAgain}
                                className="w-full py-3.5 rounded-lg text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* STATE 3: SUCCESS (Added this so the user knows it worked!) */}
                    {status === 'success' && (
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-4">
                                <CheckCircle size={64} className="text-[#00a859]" strokeWidth={2} />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1c2536] mb-2">Attendance Marked!</h2>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                                Thank you. Your attendance for this event has been successfully recorded.
                            </p>
                            
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}