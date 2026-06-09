import { UserPlus, FileText, LayoutDashboard, Calendar, LogOut, IndianRupee, Plus, UserRoundPlus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../images/VIT.png';
import { useAuth } from './AuthContext';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { role, logout } = useAuth();
    const handleLogout = async () => {
        await logout();
        navigate('/login')
    }
    const navbarStyles = (path) => {
        const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
        return `mb-3 flex items-center p-1 text-lg ${isActive
                ? 'text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 rounded hover:text-black'
            }`;
    };

    return (
        <>
            <aside className="w-60 h-screen bg-white border-gray-200 border-2 flex flex-col sticky top-0">
                <div className="items-center justify-center flex p-2 border-b-2 border-gray-200">
                    <div className="w-20 h-20 rounded overflow-hidden flex items-cente justify-center font-bold">
                        <img src={logoImg} alt="logo" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 leading-tight">VIT College</h2>
                        <p className="text-xs text-gray-500">Event Management</p>
                    </div>
                </div>
                <div className="p-8 flex flex-col justify-between h-full">
                    <div>
                        <Link to="/dashboard" className={navbarStyles('/dashboard')}>
                            <LayoutDashboard className='pr-1.5' /> Dashboard
                        </Link>
                        <Link to="/events" className={navbarStyles('/events')}>
                            < Calendar className='pr-1.5 ' /> Events
                        </Link>
                        {role === 'hod' && (
                            <>
                                <Link to="reports" className={navbarStyles('/reports')}>
                                    <FileText className='pr-1.5' /> Reports
                                </Link >
                                <Link to="#" className={navbarStyles('/claims')}>
                                    <IndianRupee className='pr-1.5' />Claims
                                </Link>
                                <Link to="/register-faculty" className={navbarStyles('/register-faculty')}>
                                    <UserPlus className='pr-1.5' /> Register Faculty
                                </Link>
                            </>
                        )}
                        {role === 'faculty' && (
                            <>

                                <Link to='/create-event' className={navbarStyles('/create-event')}>
                                    <Plus className='pr-1.5' /> CreateEvent
                                </Link >
                                <Link to='/register-guest' className={navbarStyles('/register-guest')}>
                                    <UserRoundPlus className='pr-1.5' /> Add Guest
                                </Link>
                                <Link to='/add-volunteer' className={navbarStyles('/add-volunteer')}>
                                    <UserPlus className='pr-1.5' /> Add Volunteer
                                </Link>
                                <Link to="#" className={navbarStyles('#')}>
                                    <IndianRupee className='pr-1.5' />Submit Claims
                                </Link>
                            </>
                        )}
                    </div>
                    <Link onClick={handleLogout} className="mt-auto flex items-center text-red-700  p-2 text-lg">
                        <LogOut className='pr-1.5 m-1 items-center justify-around' />Logout
                    </Link>
                </div>
            </aside>
        </>
    );
}