import { CreateEvent } from "./assets/pages/CreateEvent.jsx";
import { Dashboard } from "./assets/pages/Dashboard.jsx";
import { EventDetails } from "./assets/pages/EventDetails.jsx";
import { Events } from "./assets/pages/Events.jsx";
import { RegisterFaculty } from "./assets/pages/RegisterFaculty.jsx";
import AppLayout from "../AppLayout.jsx";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { EditEvent } from "./assets/pages/EditEvent.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/register-faculty" element={<RegisterFaculty />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/edit/event/:id" element={<EditEvent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;