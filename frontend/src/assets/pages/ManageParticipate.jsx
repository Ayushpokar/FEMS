import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Link as LinkIcon, Users, MessageSquare, Copy, QrCode, Plus, Check } from 'lucide-react';
import axios from 'axios';

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export function ManageParticipants() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        event_id: id,
        name: '',
        email: '',
        mobile: '',
        employment_status: '',
        organisation_name:'',
        city: ''
    });

    // States to handle the "Copied!" checkmark animation
    const [copiedLink, setCopiedLink] = useState(null);

    // Dummy URLs based on your screenshot's structure
    const links = {
        registration: `${FRONTEND_URL}/event/${id}/register`,
        attendance: `${FRONTEND_URL}/event/${id}/attendance`,
        feedback: `${FRONTEND_URL}/event/${id}/feedback`
    };

    const handleCopy = (linkType, url) => {
        navigator.clipboard.writeText(url);
        setCopiedLink(linkType);
        setTimeout(() => setCopiedLink(null), 2000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting manual participant:", formData);
        try {
            // Include event ID if sending to backend!
            const res = await axios.post(`/api/event/participate`, { ...formData });
            setTimeout(() => {
                setFormData({ name: '', email: '', mobile: '', employment_status: '', organisation_name: '', city: '' });
            }, 1000);
            alert("Participant is added");
        } catch (error) {
            console.log(error);
            
            alert("Something went wrong, try again")
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Event
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Participants — {}</h1>
            </div>

            {/* Link Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                {/* 1. Registration Link Card */}
                <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-blue-700 font-semibold mb-3">
                            <LinkIcon size={18} />
                            <h2>Student Registration Link</h2>
                        </div>
                        <p className="text-xs text-blue-600/80 mb-4 leading-relaxed">
                            Share this link so students can register themselves for the event.
                        </p>
                    </div>
                    <div>
                        <div className="flex gap-2 mb-3">
                            <input 
                                type="text" 
                                readOnly 
                                value={links.registration}
                                className="flex-1 bg-white border border-blue-200 text-gray-600 text-sm rounded-lg px-3 py-2 outline-none"
                            />
                            <button 
                                onClick={() => handleCopy('reg', links.registration)}
                                className="p-2 bg-white border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Copy to clipboard"
                            >
                                {copiedLink === 'reg' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                            </button>
                        </div>
                        {/* <button className="w-full flex items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 font-medium py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                            <QrCode size={16} />
                            Open Registration Page
                        </button> */}
                    </div>
                </div>

                {/* 2. Attendance Link Card */}
                <div className="bg-green-50/50 border border-green-200 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-green-700 font-semibold mb-3">
                            <Users size={18} />
                            <h2>Attendance Link</h2>
                        </div>
                        <p className="text-xs text-green-600/80 mb-4 leading-relaxed">
                            Share this link at the event venue for students to mark their attendance.
                        </p>
                    </div>
                    <div>
                        <div className="flex gap-2 mb-3">
                            <input 
                                type="text" 
                                readOnly 
                                value={links.attendance}
                                className="flex-1 bg-white border border-green-200 text-gray-600 text-sm rounded-lg px-3 py-2 outline-none"
                            />
                            <button 
                                onClick={() => handleCopy('att', links.attendance)}
                                className="p-2 bg-white border border-green-200 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                                title="Copy to clipboard"
                            >
                                {copiedLink === 'att' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                            </button>
                        </div>
                        {/* <button className="w-full flex items-center justify-center gap-2 bg-white border border-green-200 text-green-700 font-medium py-2 rounded-lg text-sm hover:bg-green-50 transition-colors">
                            <QrCode size={16} />
                            Open Attendance Page
                        </button> */}
                    </div>
                </div>

                {/* 3. Feedback Link Card */}
                <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-purple-700 font-semibold mb-3">
                            <MessageSquare size={18} />
                            <h2>Feedback Link</h2>
                        </div>
                        <p className="text-xs text-purple-600/80 mb-4 leading-relaxed">
                            Share after the event so attendees can rate and review it.
                        </p>
                    </div>
                    <div>
                        <div className="flex gap-2 mb-3">
                            <input 
                                type="text" 
                                readOnly 
                                value={links.feedback}
                                className="flex-1 bg-white border border-purple-200 text-gray-600 text-sm rounded-lg px-3 py-2 outline-none"
                            />
                            <button 
                                onClick={() => handleCopy('feed', links.feedback)}
                                className="p-2 bg-white border border-purple-200 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                                title="Copy to clipboard"
                            >
                                {copiedLink === 'feed' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                            </button>
                        </div>
                        {/* <button className="w-full flex items-center justify-center gap-2 bg-white border border-purple-200 text-purple-700 font-medium py-2 rounded-lg text-sm hover:bg-purple-50 transition-colors">
                            <QrCode size={16} />
                            Open Feedback Page
                        </button> */}
                    </div>
                </div>

            </div>

            {/* Manual Add Form - Constrained width since right side is removed */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Add Participant Manually</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Name *</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-gray-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2.5 outline-none transition-all"
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Email *</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2.5 outline-none transition-all"
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Phone *</label>
                        <input 
                            type="tel" 
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full bg-gray-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2.5 outline-none transition-all"
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Employment Status *</label>
                        <input 
                            type="text" 
                            name="employment_status"
                            value={formData.employment_status}
                            onChange={handleChange}
                            className="w-full bg-gray-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2.5 outline-none transition-all"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Organisation / College Name *</label>
                        <input 
                            type="text" 
                            name="organisation_name"
                            value={formData.organisation_name}
                            onChange={handleChange}
                            className="w-full bg-gray-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2.5 outline-none transition-all"
                            required 
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Current City *</label>
                        <input 
                            type="text" 
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full bg-gray-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2.5 outline-none transition-all"
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full mt-6 flex items-center justify-center gap-2 bg-[#0b0f19] hover:bg-black text-white font-medium py-3 rounded-lg transition-colors"
                    >
                        <Plus size={18} />
                        Add Participant
                    </button>
                </form>
            </div>

        </div>
    );
}