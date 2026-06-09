import { CreateEvent } from "./assets/pages/CreateEvent.jsx";
import { Dashboard } from "./assets/pages/Dashboard.jsx";
import { EventDetails } from "./assets/pages/EventDetails.jsx";
import { Events } from "./assets/pages/Events.jsx";
import { RegisterFaculty } from "./assets/pages/RegisterFaculty.jsx";
import AppLayout from "../AppLayout.jsx";
import { BrowserRouter, Route, Navigate, Routes, Outlet } from "react-router-dom";
import { EditEvent } from "./assets/pages/EditEvent.jsx";
import { Login } from "./assets/pages/Login.jsx";
import { AuthProvider } from "./assets/components/AuthContext.jsx";
import axios from "axios";
import { ProtectedRoute } from "./assets/components/ProtectedRoute.jsx";
import { RegisterGuest } from "./assets/pages/RegisterGuest.jsx";
import { AddVolunteer } from "./assets/pages/AddVolunteer.jsx";
import { Reports } from "./assets/pages/EventReports.jsx";
import { ParticipateForm } from "./assets/pages/ParticipateForm.jsx";
import { ManageParticipants } from "./assets/pages/ManageParticipate.jsx";
import { GenerateReport } from "./assets/pages/GenerateReport.jsx";
import { AttendancePage } from "./assets/pages/AttendenceForm.jsx";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
const AuthLayout = () => {
    return (
        <AuthProvider>
            <Outlet /> {/* This will render whatever route is matched inside it */}
        </AuthProvider>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                
                {/* ==================================================== */}
                {/* COMPLETELY PUBLIC (AuthContext does NOT run here)    */}
                {/* ==================================================== */}
                <Route path="/event/:id/register" element={<ParticipateForm />} />
                <Route path="/event/:id/attendance" element={<AttendancePage />} />


                {/* ==================================================== */}
                {/* AUTH ROUTES (AuthContext runs here!)                 */}
                {/* ==================================================== */}
                <Route element={<AuthLayout />}>
                    
                    {/* Even Login needs AuthContext so it can call login() */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* The main dashboard layout */}
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        
                        {/* Faculty Only Routes */}
                        <Route path="/create-event" element={<ProtectedRoute allowedRoles={["faculty"]}><CreateEvent /></ProtectedRoute>} />
                        <Route path="/edit/event/:id" element={<ProtectedRoute allowedRoles={["faculty"]}><EditEvent /></ProtectedRoute>} />
                        <Route path="/register-guest" element={<ProtectedRoute allowedRoles={["faculty"]}><RegisterGuest /></ProtectedRoute>} />
                        <Route path="/add-volunteer" element={<ProtectedRoute allowedRoles={["faculty"]}><AddVolunteer /></ProtectedRoute>} />
                        <Route path="/event/:id/participate" element={<ProtectedRoute allowedRoles={["faculty"]}><ManageParticipants /></ProtectedRoute>} />
                        <Route path="/event/:event_id/report" element={<ProtectedRoute allowedRoles={["faculty"]}><GenerateReport /></ProtectedRoute>} />
                        
                        {/* HOD Only Routes */}
                        <Route path="/register-faculty" element={<ProtectedRoute allowedRoles={["hod"]}><RegisterFaculty /></ProtectedRoute>} />
                        <Route path="/reports" element={<ProtectedRoute allowedRoles={["hod"]}><Reports /></ProtectedRoute>} />
                        
                        {/* Shared Routes */}
                        <Route path="/events" element={<ProtectedRoute allowedRoles={["faculty", "hod"]}><Events /></ProtectedRoute>} />
                        <Route path="/event/:id" element={<ProtectedRoute allowedRoles={["faculty", "hod"]}><EventDetails /></ProtectedRoute>} />
                    </Route>

                </Route>

            </Routes>
        </BrowserRouter>
    );
} 

export default App