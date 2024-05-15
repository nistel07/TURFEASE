import React from 'react'
import GroundCard, { BookingCard } from '../components/GroundCard';
import axios from 'axios';
import { BASE_URL } from '../utils/helper';
import { useEffect } from 'react';
import { useState } from 'react';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [previousBookings, setPreviousBookings] = useState([]);
    const token = localStorage.getItem('token');

    const getAllBookings = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/admin/bookings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (data.success) {
                const today = new Date().toISOString().slice(0, 10);

                const upcoming = data.bookings
                    .filter(booking => booking.date >= today)
                    .sort((a, b) => new Date(a.date) - new Date(b.date)); //sorted dates in ascending order
                const previous = data.bookings.filter(booking => booking.date < today);

                setUpcomingBookings(upcoming);
                setPreviousBookings(previous);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllBookings();
    }, []);

    return (
        <div className='h-screen p-8'>
            < p className=' ml-10 mt-5 mb-20 font-semibold text-3xl' >Bookings</ p>
            <p className=' ml-10 mt-5 mb-3 font-bold text-xl'>Upcoming Bookings</p>
            <div className='flex flex-wrap justify-start gap-5'>
                {upcomingBookings?.map((booking) =>
                    <div key={booking?._id} className="ml-10 mt-5 mb-16">
                        <BookingCard
                            id={booking?._id}
                            user={booking?.user}
                            ground={booking?.ground}
                            date={booking?.date.slice(0, 10)}
                            time={booking?.timeSlot}
                        />
                    </div>
                )}
                {upcomingBookings.length === 0 &&
                    <p className='ml-10 mt-5 mb-16 font-light text-xl'>You don't have any upcoming bookings.</p>}
            </div>
            <p className=' ml-10 mt-5 mb-3 font-bold text-xl'>Previous Bookings</p>
            <div className='flex flex-wrap justify-start gap-5'>
                {previousBookings?.map((booking) =>
                    <div key={booking?._id} className="ml-10 mt-5">
                        <BookingCard
                            id={booking?._id}
                            user={booking?.user}
                            ground={booking?.ground}
                            date={booking?.date.slice(0, 10)}
                            time={booking?.timeSlot}
                        />
                    </div>
                )}
                {previousBookings.length === 0 &&
                    <p className='ml-10 mt-5 mb-5 font-light text-xl'>You don't have any upcoming bookings.</p>}
            </div>
        </div >
    )
}

export default Bookings;