import React from "react";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export function AddVolunteer() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        register_number: '',
        email: '',
        mobile: '',
        department: ''
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
            console.log("adsasa");
            
            const res = await axios.post(`/api/addvolunteer`, formData);
            alert("Volunteer Added");
            setFormData({
                name: '',
                register_number: '',
                email: '',
                mobile: '',
                department: ''
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
                <h2 className="text-2xl font-bold text-gray-900">Add Volunteer </h2>
                <p className="text-gray-500 mt-1">Add Voluunteer to create group</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Add Volunteer</h3>
                <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 "
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
                        <input
                            type="text"
                            placeholder="Register Number"
                            name="register_number"
                            value={formData.register_number}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2  "
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Mobile"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2  "
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
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
                            Register Volunteer
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}