import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Calendar, CheckCircle, CircleX, Clock, FileText, UserPlus, Users } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
const API = process.env.REACT_APP_API_URL;


export function DashboardCard({ title, value, icon: Icon, iconColor }) {
    return (<div className="border bg-white border-gray-200 rounded-xl p-6 flex justify-between">
        <div>
            <p className="text-gray-500 text-sm mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-700">{value}</h3>
        </div>
        {Icon && (<div className={iconColor}>
            <Icon size={32} />
        </div>)}
    </div>
    )
}

function QuickAction({ title, descrp, icon: Icon, iconbg, link }) {
    return (
        <Link to={link} className="bg-white border border-gray-200 rounded-xl p-7 flex  items-center space-x-4 hover:shadow-md" >
            <div className={`${iconbg} text-white p-3 rounded-lg shrink-0`}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="font-semibold text-gray-900">{title}</h4>
                <p className="text-gray-500 text-sm mt-1">{descrp}</p>
            </div>
        </Link>
    )
}


export function Dashboard() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${API}/api/events`);
                setEvents(Array.isArray(res.data) ? res.data : []);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setError("Could not load events. Please try again later");
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);
    const counts = {
        All: events.length,
        Pending: events.filter((e) => e.status === 'created' || e.status === 'modification_required' || !e.status).length,
        Approved: events.filter((e) => e.status === 'approved').length,
        Rejected: events.filter((e) => e.status === 'rejected').length,
    }
    return (
        <>
            <div className="mb-6">
                <h3 className="text-3xl font-bold text-gray-900">HOD Dashboard</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <DashboardCard
                    title="Total Events"
                    value={counts.All}
                    icon={Users}
                    iconColor="text-blue-500"
                />

                <DashboardCard
                    title="Pending Events"
                    value={counts.Pending}
                    icon={Clock}
                    iconColor="text-yellow-500"
                />

                <DashboardCard
                    title="Approval Events"
                    value={counts.Approved}
                    icon={CheckCircle}
                    iconColor="text-green-500"
                />
                <DashboardCard
                    title="Rejected Events"
                    value={counts.Rejected}
                    icon={CircleX}
                    iconColor="text-red-500"
                />
            </div>

            <div className="mt-6">
                <div><h3 className="text-xl font-semibold ">Quick Action</h3></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-1 gap-6 mt-6">
                    <QuickAction
                        title="Event Approval"
                        descrp="Review pending events"
                        icon={Calendar}
                        iconbg="bg-blue-500"
                        link={'/events'}
                    />
                    <QuickAction
                        title="Register Faculty"
                        descrp="Add new faculty members"
                        icon={UserPlus}
                        iconbg="bg-purple-500"
                        link={'/register-faculty'}
                    />
                    <QuickAction
                        title="Event Reports"
                        descrp="Review pending events"
                        icon={FileText}
                        iconbg="bg-green-500"
                        link={'/reports'}
                    />
                </div>
            </div>
        </>
    );
}