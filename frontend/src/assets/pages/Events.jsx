import { Delete, EditIcon, Eye, Trash, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { DashboardCard } from "./Dashboard";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";


export function EventCard({ eventData, onDelete }) {
    const { role } = useAuth();
    const statusBadges = {
        approved: <span className="px-2 py-0.5 bg-green-200 text-green-700 rounded-md text-[11px] font-bold">APPROVED</span>,
        rejected: <span className="px-2 py-0.5 bg-red-200 text-red-700 rounded-md text-[11px] font-bold">REJECTED</span>,
        pending: <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-md text-[11px] font-bold">PENDING</span>,
        modification_required: <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md text-[11px] font-bold">{role === 'hod' ? 'MODIFICATION' : 'MODIFICATION REQUIRED'}</span>,
    };
    const formatLocalTime = (utcString) => {
        if (!utcString) return "Time TBA"; // Safety check if data is missing

        const date = new Date(utcString);
        return date.toLocaleString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };
    return (
        <div className="mt-5">
            <div className="border border-gray-200 rounded-xl p-5 flex justify-between items-start bg-white shadow-sm w-full">

                <div className="flex flex-col space-y-2">

                    <div className="flex items-center space-x-3">
                        <h3 className="font-bold text-lg text-gray-900">{eventData.event_name}</h3>
                        {statusBadges[eventData.status] || statusBadges['pending']}
                    </div>

                    <p className="text-gray-600 text-sm">{eventData.descrp}</p>

                    <p className="text-gray-400 text-sm mt-1">
                        {role === 'hod' && (<>{eventData.user_name}<span className='mx-1'>•</span></>)}{formatLocalTime(eventData?.start_date)} <span className="mx-1">•</span> {eventData.venue}
                    </p>
                    {role === 'faculty' && eventData.status === 'modification_required' && (
                        <div className="border border-red-300 bg-red-50 p-3 rounded-md w-5xl">
                            <label htmlFor="" className="text-red-900">Comment From HOD:</label>
                            <p className="text-red-700">{eventData.comment}</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col space-y-2 min-w-27.5">

                    <Link to={`/event/${eventData.event_id}`} className="flex items-center justify-center px-4 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium transition-colors">
                        <Eye size={16} className="mr-2" /> View
                    </Link>

                    {role === 'faculty' && eventData.status !== 'approved' && eventData.status !== 'rejected' && (<>
                        <Link to={`/edit/event/${eventData.event_id}`} className="flex items-center justify-center px-4 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white text-sm font-medium">
                            <EditIcon size={16} className="mr-2" /> Edit
                        </Link>
                        <button onClick={() => onDelete(eventData.event_id)} className="flex items-center justify-center px-4 py-1.5 border border-gray-300 rounded-md text-white bg-red-600 text-sm font-medium">
                            <Trash2 size={16} className="mr-2" /> Delete Event
                        </button></>)}
                </div>
            </div>
        </div>
    );
}


export function Events() {
    const { role } = useAuth();
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const fetchEvents = async () => {
        try {
            const res = await axios.get(`/api/events`);
            setEvents(res.data);
        } catch (err) {
            console.error("Failed to fetch events:", err);
            setError("Could not load events.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const Deleteevent = async (event_id) => {
        const isConfirmed = window.confirm("Do you want delete this event?");
        if (!isConfirmed) return;

        try {
            await axios.delete(`/api/deleteevent/${event_id}`);
            fetchEvents();
            alert("your event has been deleted");
        } catch (error) {
            console.log("Something went wrong while deleteing the event.")
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-gray-500 text-lg">Loading events...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                {error}
            </div>
        );
    }
    const safeEvents = Array.isArray(events) ? events : [];

    const counts = {
        All: safeEvents.length,
        Pending: safeEvents.filter((e) => e.status === 'created' || !e.status).length,
        Approved: safeEvents.filter((e) => e.status === 'approved').length,
        Rejected: safeEvents.filter((e) => e.status === 'rejected').length,
        Modification: safeEvents.filter((e) => e.status === 'modification_required').length
    };
    const filterEvents = safeEvents.filter(event => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Pending') return event.status === 'created' || !event.status;
        if (activeTab === 'Approved') return event.status === 'approved';
        if (activeTab === 'Modification') return event.status === 'modification_required';
        if (activeTab === 'Rejected') return event.status === 'rejected';
        return true;
    });

    return (
        <>
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Events</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 ">
                <DashboardCard
                    title={role === 'hod' ? "Total" : "My events"}
                    value={counts['All']}
                    icon=""
                    iconColor=""
                />
                <DashboardCard
                    title="Pending"
                    value={counts['Pending']}
                    icon={null}
                    iconColor=""
                />
                <DashboardCard
                    title="Approved"
                    value={counts['Approved']}
                    icon={null}
                    iconColor=""
                />
                <DashboardCard
                    title="Modification"
                    value={counts['Modification']}
                    icon={null}
                    iconColor=""
                />
                <DashboardCard
                    title="Rejected"
                    value={counts['Rejected']}
                    icon={null}
                    iconColor=""
                />
            </div>

            <div className="mt-6 inline-flex bg-gray-100 p-1 rounded-full border border-gray-300">
                {['All', 'Pending', 'Approved', 'Modification', 'Rejected'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${activeTab === tab
                            ? 'bg-white text-gray-900 shadow-sm' // Active Style
                            : 'text-gray-600 hover:text-gray-900' // Inactive Style
                            }`}
                    >
                        {tab}({counts[tab]})
                    </button>
                ))}
            </div>

            {filterEvents.length === 0 ? (
                <div className="mt-6">
                    <div className=" border rounded-2xl p-6 text-center border-gray-200">
                        <p className="font-medium">No Event</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {(filterEvents || []).map((event) => (
                        <EventCard key={event.event_id} eventData={event} onDelete={Deleteevent} />
                    ))}
                </div>
            )}
        </>
    )
}