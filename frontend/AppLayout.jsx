import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./src/assets/components/Navbar";

export default function AppLayout(){
    return (
        <div className="flex h-screen bg-gray-50">
            <Navbar />

            <main className="flex-1 p-10 overflow-auto">
                <Outlet />
            </main>
        </div>
    )
}