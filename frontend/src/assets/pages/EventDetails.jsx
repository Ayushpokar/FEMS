import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Users } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

export function FetchData() {

    useEffect(() => {

    })
}

export function EventDetails() {
    const { id } = useParams();
    const [eventData, setEventData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [comment, setComment] = useState("");
    const statusBadges = {
        approved: <span className="px-2 py-0.5 bg-green-200 text-green-700 rounded-md text-[11px] font-bold">APPROVED</span>,
        rejected: <span className="px-2 py-0.5 bg-red-200 text-red-700 rounded-md text-[11px] font-bold">REJECTED</span>,
        pending: <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-md text-[11px] font-bold">PENDING</span>,
        modification_required: <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md text-[11px] font-bold">MODIFICATION</span>,
    };
    useEffect(() => {
        const fetchSingleEvent = async () => {
            try {
                const res = await axios.get(`${API}/api/getevent/${id}`)
                // const result = res.data;                
                setEventData(res.data.values[0])
                setIsLoading(false);

            } catch (error) {
                console.log(error);
                setError("Could not find this event");
                setIsLoading(false);
            }
        };
        fetchSingleEvent();
    }, [id])
    console.log(eventData);

    if (isLoading) return <div className="p-10 text-center text-gray-500">Loading event details...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!eventData) return <div className="p-10 text-center text-gray-500">Event not found.</div>;
    const handleStatusUpdate = async (status) => {
        const confirmMessage = `Are you sure you want to change the status to ${status}?`;
        if (!window.confirm(confirmMessage)) return;

        try {
            await axios.patch(`${API}/api/event/updatestatus/${id}/${status}`, {
                comment: comment
            });

            setEventData(prev => ({ ...prev, current_status: status }));

            alert("Status updated successfully!");

        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status. Please check the console.");
        }
    };
    return (
        <>
            <div className="flex items-start space-x-4 mb-6">
                <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors mt-1">
                    <ArrowLeft size={16} className="mr-2" /> Back
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{eventData.name}</h1>

                    {statusBadges[eventData.current_status] || statusBadges['pending']}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Event Details</h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Description</p>
                                <p className="text-gray-900">{eventData.descrp}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Event Catogory</p>
                                    <p className="font-medium text-gray-900">{eventData.category}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Venue</p>
                                    <p className="font-medium text-gray-900">{eventData.venue}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Start Time</p>
                                    <p className="font-medium text-gray-900">{eventData.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">End Time</p>
                                    <p className="font-medium text-gray-900">{eventData.end_date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Event Mode</p>
                                    <p className="font-medium text-gray-900">{eventData.mode_of_event}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Expected Participants</p>
                                    <p className="font-medium text-gray-900">{eventData.audience_size}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Registration Fee</p>
                                    <p className="font-medium text-gray-900">{eventData.registration_fee}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Expected Cost</p>
                                    <p className="font-medium text-gray-900">{eventData.total_cost}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Guest Name</p>
                                    <p className="font-medium text-gray-900">{eventData.guest_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Volunteer Group</p>
                                    <p className="font-medium text-gray-900">{eventData.group_name} </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="lg:col-span-1">
                    {eventData?.current_status !== 'approved' && eventData?.current_status !== 'rejected' && (
                        < div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">HOD Action</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Comments / Feedback</label>
                                    <textarea
                                        rows="3"
                                        name='comment'
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add your comments or feedback..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                    ></textarea>
                                </div>

                                <div className="space-y-3 mt-6">
                                    <button onClick={() => handleStatusUpdate('approved')} className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-white bg-[#00a651] hover:bg-green-700 font-medium transition-colors cursor-pointer">
                                        Approve Event
                                    </button>

                                    <button onClick={() => handleStatusUpdate('modification_required')} className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors cursor-pointer">
                                        Request Modification
                                    </button>

                                    <button onClick={() => handleStatusUpdate('rejected')} className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-white bg-[#c8102e] hover:bg-red-800 font-medium transition-colors cursor-pointer">
                                        Reject Event
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </>
    );
}