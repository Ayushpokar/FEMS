import { UserPlus, FileText, LayoutDashboard, Calendar, LogOut, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Navbar() {

    return (
        <>
            <aside className="w-60 h-screen bg-white border-gray-200 border-2 flex flex-col sticky top-0">                
                <div className="items-center justify-center flex p-2 border-b-2 border-gray-200">
                <div className="w-20 h-20 rounded overflow-hidden flex items-cente justify-center font-bold">
                    <img src="src/assets/images/VIT.png" alt="logo" className="" />
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
                            < Calendar  className='pr-1.5 ' /> Events
                        </Link>
                        <Link className="mb-3 flex text-blue-700 items-center text-lg">
                            <FileText className='pr-1.5' /> Reports
                        </Link >
                        <Link className="mb-3 flex text-blue-700 items-center text-lg">
                            <IndianRupee className='pr-1.5' />Claims
                        </Link>
                        <Link to="/register-faculty" className="mb-3 flex items-center text-blue-700 text-lg">
                            <UserPlus className='pr-1.5' /> Register Faculty
                        </Link>
                    </div>
                    <Link className="mt-auto flex items-center text-red-700  p-2 m-1 text-lg">
                        <LogOut className='pr-1.5 m-1 items-center justify-around' />Logout
                    </Link>
                </div>
            </aside>
        </>
    );
}