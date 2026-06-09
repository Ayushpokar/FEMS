import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, User, Ticket, Info } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { createPaymentOrder } from './paymentService';

const API = import.meta.env.VITE_API_URL;

export function ParticipateForm() {
    const { id } = useParams();
    const [eventData, seteventData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const loadRazorPayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }


    useEffect(() => {
        const eventDetails = async () => {
            try {
                const res = await axios.get(`/api/getevent/${id}`);
                seteventData((res.data));

            } catch (error) {
                console.log(error);

            }
            finally {
                setIsLoading(false);
            }
        }
        eventDetails();
    }, [])

    const formatDateTime = (isoString) => {
        // 1. If empty, show TBD
        if (!isoString) return "Not scheduled yet";

        // 2. Parse the string
        const date = new Date(isoString);
        date.setMinutes(date.getMinutes() - 330);
        // 3. Format strictly for India
        return date.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata', // Forces Indian Time
            day: 'numeric',           // 7
            month: 'short',           // Jun
            year: 'numeric',          // 2026
            hour: 'numeric',          // 1
            minute: '2-digit',        // 30
            hour12: true              // pm
        });
    };

    const [formData, setFormData] = useState({
        event_id: `${id}`, name: '', email: '', mobile: '', employment_status: '', organisation_name: '', city: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({ ...prevState, [id]: value }));
    };
            console.log(import.meta.env.VITE_RAZORPAY_KEY_ID);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isScriptLoaded = await loadRazorPayScript();
        if (!isScriptLoaded) {
            alert('Razorpay SDK failed to load. Are you connected to the internet?');
            return;
        }
        setIsSubmitting(true);
        setMessage(null);

        try {
            const orderData = await createPaymentOrder(eventData.registration_fee);
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: eventData.name,
                description: "Event Pass",
                order_id: orderData.id,
                method: {
                    upi: true, // Explicitly enable UPI
                    netbanking: true,
                    card: true,
                    wallet: false // Set to false if you want to keep it simple
                },
                handler: async function (response) {
                    console.log("Payment Verification Data:", response);

                    // alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
                    const res = await axios.post(`/api/event/participate`, { ...formData });
                    setMessage({ type: 'success', text: "Successfully registered as a participant!" });
                    setFormData({ name: '', email: '', mobile: '', employment_status: '', organisation_name: '', city: '' });
                    setIsSubmitting(false);
                },
                prefill: {
                    name: formData.name || "Guest Usser",
                    email: formData.email || "guest@email.com",
                    contact: formData.mobile || "",
                },
                theme: {
                    color: "#2563eb"
                },
                modal: {
                    ondismiss: function () {
                        console.log("User closed the payment window.");
                        setMessage({ type: 'error', text: "Payment cancelled. Registration not saved." });
                        setIsSubmitting(false);
                    }
                }
            };
            const paymentWindow = new window.Razorpay(options);
            paymentWindow.open();
        } catch (error) {
            setMessage({ type: 'error', text: "Failed to register. Please try again." });
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-xl font-semibold text-gray-500 animate-pulse">
                    Loading event details...
                </p>
            </div>
        );
    }

    if (!eventData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-xl font-bold text-red-600">Event not found.</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Main Container - Changes from 1 column on mobile to 12 columns on desktop */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ========================================= */}
                {/* LEFT SIDE: EVENT DETAILS TICKET           */}
                {/* ========================================= */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
                        {/* Header Image/Color block */}
                        <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-700"></div>

                        <div className="p-6 sm:p-8 -mt-12">
                            <div className="bg-white p-4 rounded-xl shadow-md inline-block mb-4">
                                <Calendar className="w-8 h-8 text-blue-600" />
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                {eventData.name}
                            </h1>

                            <div className="space-y-5">
                                {/* Description */}
                                <div className="flex gap-3 text-gray-600">
                                    <Info className="w-5 h-5 shrink-0 text-gray-400 mt-0.5" />
                                    <p className="text-sm leading-relaxed">{eventData.descrp}</p>
                                </div>

                                {/* Guest */}
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="bg-blue-50 p-2 rounded-lg">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Special Guest</p>
                                        <p className="text-sm font-semibold">{eventData.guest_name}</p>
                                        <p className="text-xs text-gray-500">{eventData.guest_designation}</p>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="bg-purple-50 p-2 rounded-lg">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Date & Time</p>
                                        <p className="text-sm font-semibold">{formatDateTime(eventData.start_date)}</p>
                                        <p className="text-xs text-gray-500">to {formatDateTime(eventData.end_date)}</p>
                                    </div>
                                </div>

                                {/* Venue */}
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="bg-green-50 p-2 rounded-lg">
                                        <MapPin className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Venue</p>
                                        <p className="text-sm font-semibold">{eventData.venue}</p>
                                    </div>
                                </div>

                                {/* Fee */}
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="bg-orange-50 p-2 rounded-lg">
                                        <Ticket className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Registration Fee</p>
                                        <p className="text-sm font-bold text-gray-900">
                                            {eventData.registration_fee === 0 ? "FREE" : `₹${eventData.registration_fee}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================= */}
                {/* RIGHT SIDE: REGISTRATION FORM             */}
                {/* ========================================= */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10">
                        <div className="mb-8 border-b border-gray-100 pb-5">
                            <h2 className="text-2xl font-bold text-gray-900">Secure Your Spot</h2>
                            <p className="mt-2 text-sm text-gray-500">Fill out your details below to register for this event.</p>
                        </div>

                        {message && (
                            <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                                {/* Name */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                    <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl p-3 text-sm outline-none transition-all" required />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                    <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl p-3 text-sm outline-none transition-all" required />
                                </div>

                                {/* Mobile */}
                                <div>
                                    <label htmlFor="tel" maxLength="10" className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                                    <input type="tel" id="mobile" value={formData.mobile} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl p-3 text-sm outline-none transition-all" required />
                                </div>

                                {/* Employment Status */}
                                <div>
                                    <label htmlFor="employment_status" className="block text-sm font-semibold text-gray-700 mb-1.5">Employment Status</label>
                                    <input type="text" id="employment_status" value={formData.employment_status} onChange={handleChange} placeholder="e.g. Student, Fresher" className="w-full bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl p-3 text-sm outline-none transition-all" required />
                                </div>

                                {/* City */}
                                <div>
                                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1.5">Current City</label>
                                    <input type="text" id="city" value={formData.city} onChange={handleChange} placeholder="e.g. Bangalore" className="w-full bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl p-3 text-sm outline-none transition-all" required />
                                </div>

                                {/* Organisation */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="organisation_name" className="block text-sm font-semibold text-gray-700 mb-1.5">Organisation / College Name</label>
                                    <input type="text" id="organisation_name" value={formData.organisation_name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl p-3 text-sm outline-none transition-all" required />
                                </div>
                            </div>

                            <button type="submit" disabled={isSubmitting} className={`mt-4 w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-md ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'}`}>
                                {isSubmitting ? "Processing..." : `Pay ${eventData.registration_fee} & Complete Registration`}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}