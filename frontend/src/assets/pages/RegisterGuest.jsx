import React from "react";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export function RegisterGuest() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        guest_name: '',
        guest_email: '',
        guest_mobile: '',
        guest_company: '',
        guest_designation: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setIsSubmitting(true);
        setMessage(null);

        try {            
            const res = await axios.post(`/api/createguest`, formData);
            alert("Guest Registered");
            setFormData({
                guest_name: '',
                guest_email: '',
                guest_mobile: '',
                guest_company: '',
                guest_designation: ''
            })

        } catch (error) {
            console.log(error)
            alert("Something went wrong");
        }finally{
            setIsSubmitting(false);
        }
    };
    return (
        <>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Register Guest </h2>
                <p className="text-gray-500 mt-1">Add a new Guest for Event</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Add New Guest</h3>

                <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            name='guest_name'
                            value={formData.guest_name}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 "
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="guest@mail.com"
                            name="guest_email"
                            value={formData.guest_email}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                        <input
                            type="text"
                            name="guest_mobile"
                            value={formData.guest_mobile}
                            onChange={handleChange}
                            placeholder="Mobile"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2  "
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                            type="text"
                            name="guest_company"
                            value={formData.guest_company}
                            onChange={handleChange}
                            placeholder="Company"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2  "
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <input
                            type="text"
                            name="guest_designation"
                            value={formData.guest_designation}
                            onChange={handleChange}
                            placeholder="Guest Designation"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 "
                        />
                    </div>
                    <div className="pt-4 flex justify-end">
                        <button type="reset" className="px-6 py-2 mr-3 border border-black text-black rounded-lg  font-medium ">
                            Clear
                        </button>
                        <button  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium ">
                            Register Guest
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}