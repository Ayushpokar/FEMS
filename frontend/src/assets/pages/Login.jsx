import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from '../images/VIT.png';
import axios from "axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../components/AuthContext";


export function Login() {
    const { login } = useAuth();
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/login`, formData ,{
                withCredentials: true
            });
            const result = res.data.user;
            //   result.role
            
            if (result) {
                console.log(result);
            }
            login(result);
            navigate(`/dashboard/`);
            // App(result.role)
        } catch (error) {
            if(error.response){
                if(error.response.status === 400){
                    alert("Invalid Credential");
                }
                if(error.response.status === 404){
                    alert("Email is not registered");
                }
            }

        }
    }
    return (
        <>
            <div className="h-screen w-screen flex items-center justify-center bg-gray-200">
                {/* Changed w-2/8 to w-80 for a valid, fixed card width */}
                <div className="w-90 rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex justify-center">
                        <img src={logoImg} alt="logo" className="w-20" />
                    </div>

                    <form className="mt-6 flex flex-col gap-4">
                        {/* Replaced 'grid grid-1' with a clean flex layout and added input styling */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" placeholder="faculty@vit.com" onChange={handleChange} name="email" value={formData.email} className="bg-gray-100 rounded-md p-2 text-sm outline-none" required />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                            <input type="password" placeholder="••••••••" onChange={handleChange} name="password" value={formData.password} className="bg-gray-100 rounded-md p-2 text-sm outline-none " required />
                        </div>

                        <button onClick={onSubmit} className="bg-gray-900 rounded-md text-white py-2.5 font-medium mt-2 hover:bg-gray-800 transition">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}