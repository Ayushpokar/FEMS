import { UserPlus, FileText, LayoutDashboard, Calendar, LogOut, IndianRupee, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Navbar() {
    const user = import.meta.env.VITE_ROLE;
    console.log(user);
    

    return (
        <>
            <aside className="w-60 h-screen bg-white border-gray-200 border-2 flex flex-col sticky top-0">
                <div className="items-center justify-center flex p-2 border-b-2 border-gray-200">
                    <div className="w-20 h-20 rounded overflow-hidden flex items-cente justify-center font-bold">
                        <img src="../images/VIT.png" alt="logo"/>
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 leading-tight">VIT College</h2>
                        <p className="text-xs text-gray-500">Event Management</p>
                    </div>
                </div>
                <div className="p-8 flex flex-col justify-between h-full">
                    <div>
                        <Link to="/dashboard" className="mb-3 flex items-center text-blue-700 text-lg">
                            <LayoutDashboard className='pr-1.5' /> Dashboard
                        </Link>
                         <Link to="/events" className="mb-3 items-center flex text-blue-700 text-lg">
                                    < Calendar className='pr-1.5 ' /> Events
                                </Link>
                        {user === 'hod' && (
                            <>
                               
                                <Link to="#" className="mb-3 flex text-blue-700 items-center text-lg">
                                    <FileText className='pr-1.5' /> Reports
                                </Link >
                                <Link to="#" className="mb-3 flex text-blue-700 items-center text-lg">
                                    <IndianRupee className='pr-1.5' />Claims
                                </Link>
                                <Link to="/register-faculty" className="mb-3 flex items-center text-blue-700 text-lg">
                                    <UserPlus className='pr-1.5' /> Register Faculty
                                </Link>
                            </>
                        )}
                        {user === 'faculty' && (
                            <>

                                <Link to='/create-event' className="mb-3 flex text-blue-700 items-center text-lg">
                                    <Plus className='pr-1.5' /> CreateEvent
                                </Link >
                                <Link to="#" className="mb-3 flex text-blue-700 items-center text-lg">
                                    <IndianRupee className='pr-1.5' />Submit Claims
                                </Link>
                            </>
                        )}
                    </div>
                    <Link className="mt-auto flex items-center text-red-700  p-2 m-1 text-lg">
                        <LogOut className='pr-1.5 m-1 items-center justify-around' />Logout
                    </Link>
                </div>
            </aside>
        </>
    );
}