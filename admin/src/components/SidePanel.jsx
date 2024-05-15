// src/components/SidePanel.js

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../redux/store';
import toast from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';

const SidePanel = () => {

    const location = useLocation();
    const hideOnRoutes = ['/'];

    if (hideOnRoutes.includes(location.pathname)) {
        return null;
    }

    //global state
    let isLogin = useSelector((state) => state.isLogin);
    isLogin = isLogin || localStorage.getItem('userId');

    let user = localStorage.getItem("username");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //handle logout
    const handleLogout = () => {
        try {
            dispatch(authActions.logout());
            localStorage.clear();
            toast("You've been logged out", {
                icon: '⚠️',
            });
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="flex flex-col justify-between fixed inset-y-0 left-0 w-64 bg-green-700 text-white p-4">
            <div className="flex items-center mb-8">
                <h2 className="text-2xl font-bold">Ground Booking</h2>
            </div>
            <ul className="space-y-2">
                <li>
                    <Link to="/home" className="block py-2">Home</Link>
                </li>
                <li>
                    <Link to="/grounds" className="block py-2">Grounds</Link>
                </li>
                <li>
                    <Link to="/create-ground" className="block py-2">Create Ground</Link>
                </li>
                <li>
                    <Link to="/bookings" className="block py-2">View Bookings</Link>
                </li>
            </ul>
            <div className="mt-auto mb-5">
                <p className='font-bold mb-5'>Hello, {user}!</p>
                <button onClick={handleLogout} className="bg-white text-green-700 font-bold py-2 px-4 rounded-full block w-full mb-2">Logout</button>
            </div>
        </div>
    );
};

export default SidePanel;
