import React from "react";
import Navbar from "../components/Navbar";

export function RegisterFaculty() {
    return (
        <>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Register Faculty Member</h2>
                <p className="text-gray-500 mt-1">Add a new faculty member to the system.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Add New Faculty</h3>

                <form className="grid grid-cols-1 gap-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Name</label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 "
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="faculty@vit.edu"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                        <input
                            type="text"
                            placeholder="Mobile"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2  "
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="text"
                            placeholder="Password For Faculty"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 "
                        />
                    </div>
                    <div className="pt-4 flex justify-end">
                        <button type="reset" className="px-6 py-2 mr-3 border border-black text-black rounded-lg  font-medium ">
                            Clear
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium ">
                            Register Faculty
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}