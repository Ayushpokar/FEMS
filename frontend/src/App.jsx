import { CreateEvent } from "./assets/pages/CreateEvent.jsx";
import { Dashboard } from "./assets/pages/Dashboard.jsx";
import { EventDetails } from "./assets/pages/EventDetails.jsx";
import { Events } from "./assets/pages/Events.jsx";
import { RegisterFaculty } from "./assets/pages/RegisterFaculty.jsx";
import AppLayout from "../AppLayout.jsx";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { EditEvent } from "./assets/pages/EditEvent.jsx";
import { Login } from "./assets/pages/Login.jsx";
import { AuthProvider } from "./assets/components/AuthContext.jsx";
import axios from "axios";
import { ProtectedRoute } from "./assets/components/ProtectedRoute.jsx";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
    
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create-event" element={<ProtectedRoute allowedRoles={["faculty"]}><CreateEvent /></ProtectedRoute>} />
          <Route path="/register-faculty" element={<ProtectedRoute allowedRoles={["hod"]}><RegisterFaculty /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute allowedRoles={["faculty","hod"]}><Events /></ProtectedRoute>} />
          <Route path="/event/:id" element={<ProtectedRoute allowedRoles={["faculty","hod"]}><EventDetails /></ProtectedRoute>} />
          <Route path="/edit/event/:id" element={<ProtectedRoute allowedRoles={["faculty"]}><EditEvent /></ProtectedRoute>} />  
        </Route>
        <Route path="/login" element={<Login />}>
        </Route>
      </Routes>
    </BrowserRouter>
      </AuthProvider>

  );
}

export default App;