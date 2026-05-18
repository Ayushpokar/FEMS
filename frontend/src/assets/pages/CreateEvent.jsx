import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
export function CreateEventForm() {

    const [formData, setFormData] = useState({
        "event_name": '',
        "event_descrption": '',
        "event_venue": '',
        "event_category": '',
        "event_mode": '',
        "event_fee": '',
        "event_start_time": '',
        "event_end_time": '',
        "total_cost": '',
        "audience_size": '',
        "guest_id": '2',
        "group_id": '2'
    })

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleReset = () => {
        setFormData({
            "event_name": '',
            "event_descrption": '',
            "event_venue": '',
            "event_category": '',
            "event_mode": '',
            "event_fee": '',
            "event_start_time": '',
            "event_end_time": '',
            "total_cost": '',
            "audience_size": '',
            "guest_id": '',
            "group_id": ''
        });
        // Optional: Also clear any success/error messages
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const res = await axios.post('http://localhost:7000/api/createevent', formData);
            console.log('Success:', res.data);
            alert(res.data.message);
            setFormData({
                "event_name": '',
                "event_descrption": '',
                "event_venue": '',
                "event_category": '',
                "event_mode": '',
                "event_fee": '',
                "event_start_time": '',
                "event_end_time": '',
                "total_cost": '',
                "audience_size": '',
                "guest_id": '',
                "group_id": ''
            })
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm ">

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
                <p className="text-gray-500 mt-1">Fill in the details to schedule a new event.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Event Name</label>
                        <input
                            type="text"
                            id="event_name"
                            name='event_name'
                            required
                            value={formData.event_name}
                            onChange={handleChange}
                            placeholder="Enter event name"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Event Description</label>
                        <textarea
                            id="descrp"
                            name='event_descrption'
                            value={formData.event_descrption}
                            required
                            onChange={handleChange}
                            rows="2"
                            placeholder="Briefly describe the event"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Event Venue</label>
                        <input
                            type="text"
                            id="venue"
                            name='event_venue'
                            required
                            value={formData.event_venue}
                            onChange={handleChange}
                            placeholder="Location or link"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Event Category</label>
                        <select name='event_category' onChange={handleChange} value={formData.event_category} required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-700">
                            <option value="">Select a category</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Conference">Conference</option>
                            <option value="Guest Lecture">Guest Lecture</option>
                            <option value="Cultural Event">Cultural Event</option>
                            <option value="Technical Event">Technical Event</option>
                            <option value="Sports Event">Sport Events</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Event Mode</label>
                        <div className="flex items-center space-x-6 h-10">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="event_mode" value="online" checked={formData.event_mode === 'online'} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                <span className="text-gray-700">Online</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="event_mode" value="offline" checked={formData.event_mode === 'offline'} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                <span className="text-gray-700">Offline</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Audience Size</label>
                        <input
                            type="number"
                            id="size"
                            name='audience_size'
                            value={formData.audience_size}
                            onChange={handleChange}
                            required
                            placeholder="Expected number of people"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Start Time</label>
                        <input
                            type="datetime-local"
                            id="starttime"
                            name='event_start_time'
                            value={formData.event_start_time}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none  text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">End Time</label>
                        <input
                            type="datetime-local"
                            id="endtime"
                            required
                            name='event_end_time'
                            value={formData.event_end_time}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Registration Fee</label>
                        <input
                            type="number"
                            id="fee"
                            name='event_fee'
                            value={formData.event_fee}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Total Event Cost (₹)</label>
                        <input
                            type="number"
                            id="total_cost"
                            name='total_cost'
                            value={formData.total_cost}
                            onChange={handleChange}
                            placeholder="Estimated total cost"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Select Guest</label>
                        <div className="flex space-x-2">
                            <select id="guest" name="guest_id" onChange={handleChange} value={formData.guest_id} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-700">
                                <option value="No Guest">Choose a guest...</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Select Group</label>
                        <div className="flex space-x-2">
                            <select id="group" name='group_id' value={formData.group_id} onChange={handleChange} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-700">
                                <option value="">Choose a volunteer group...</option>
                            </select>
                        </div>
                    </div>

                </div>

                <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end">
                    <button
                        type="reset"
                        onClick={handleReset}
                        className="px-8  mr-2 py-2.5 border border-gray-950 text-black font-medium rounded-lg  "
                    >
                        Clear
                    </button>
                    <button
                        type="submit"

                        className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700  focus:ring-blue-200"
                    >
                        Create Event
                    </button>
                </div>
            </form>
        </div>
    );
}

export function CreateEvent() {
    return (

        <CreateEventForm />
    )
}