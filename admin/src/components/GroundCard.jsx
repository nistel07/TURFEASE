import React from 'react';
import { useNavigate } from 'react-router-dom';

const GroundCard = ({ id, name, location, price, image }) => {

    const navigate = useNavigate();

    return (
        <div className="bg-green-300 w-80 p-4 shadow-md rounded-md">
            <img src={image} alt={name} className="w-full h-40 object-cover mb-4" />
            <h3 className="text-xl font-bold mb-2">{name}</h3>
            <p className="text-gray-700 mb-2 font-semibold">{location}</p>
            <p className="text-gray-700 mb-2 font-bold">₹ <span className='font-normal'>{price}</span></p>
            <button
                onClick={() => {
                    navigate(`/ground/${id}`);
                }}
                className="bg-green-700 text-white px-4 py-2 rounded-full">
                View
            </button>
        </div>
    );
};

export default GroundCard;

export const BookingCard = ({ id, user, ground, date, time }) => {
    return (
        <div className="bg-green-700 text-white w-80 p-4 shadow-md rounded-md">
            <h3 className="text-xl font-bold mb-2">{ground}</h3>
            <p className="text-white mb-2 font-semibold">Booked by: {user}</p>
            <p className="text-white mb-2 font-semibold">Date: {date}</p>
            <p className="text-white mb-2 font-semibold">Time: {time}</p>
            {/* <p className="text-gray-700 mb-2 font-bold">₹ <span className='font-normal'>{price}</span></p> */}
            {/* <button
                onClick={() => {
                    navigate(`/ground/${id}`);
                }}
                className="bg-green-700 text-white px-4 py-2 rounded-full">
                View
            </button> */}
        </div>
    )
}
