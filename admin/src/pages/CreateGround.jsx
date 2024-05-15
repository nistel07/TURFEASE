import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/helper';
import Switch from 'react-switch';
import toast from 'react-hot-toast';


const CreateGround = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [inputs, setInputs] = useState({
        ground_name: "",
        location: "",
        description: "",
        price: "",
        published: false,
        images: [],
        availableSlots: [],
        coordinates: {
            latitude: "",
            longitude: "",
        },
    });

    //handle publish switch change
    const handleSwitchChange = () => {
        setInputs(prevState => ({
            ...prevState,
            published: !prevState.published
        }))
    }

    //handle input change
    const handleInputChange = (e) => {
        setInputs(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputs.ground_name || !inputs.description || !inputs.price || !inputs.location) {
            toast.error("Fields cannot be empty");
            return;
        }

        try {
            if (token) {
                const formData = new FormData(); // Create a FormData object to send files

                // Append other form data fields
                formData.append('ground_name', inputs.ground_name);
                formData.append('description', inputs.description);
                formData.append('price', inputs.price);
                formData.append('location', inputs.location);
                formData.append('published', inputs.published);
                formData.append('coordinates[latitude]', inputs.latitude);
                formData.append('coordinates[longitude]', inputs.longitude);

                // Convert comma-separated URLs to an array of strings
                const imageUrls = inputs.images.split(',').map(url => url.trim());

                // Append the image URLs to the FormData
                imageUrls.forEach((url, index) => {
                    formData.append(`images[${index}]`, url);
                });

                //Convert comma-separated timeslots to an array of strings
                const availableSlots = inputs.availableSlots.split(',').map(timeslot => timeslot.trim());

                // Append the timeslots to the FormData
                availableSlots.forEach((timeslot, index) => {
                    formData.append(`availableSlots[${index}]`, timeslot);
                });

                const { data } = await axios.post(`${BASE_URL}/api/v1/admin/create-ground`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json', // Set content type to multipart form data
                    }
                });
                if (data.success) {
                    toast.success("Ground created");
                    navigate('/grounds');
                } else {
                    toast.error("Something went wrong");
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Check log.");
        }
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Create Ground</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Ground Name</label>
                    <input
                        type="text"
                        name="ground_name"
                        value={inputs.ground_name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={inputs.location}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Map Co-ordinates</label>
                    <input
                        type="text"
                        name="latitude"
                        placeholder='Enter Latitude'
                        value={inputs.latitude}
                        onChange={handleInputChange}
                        className="w-1/2 border border-gray-300 rounded px-4 py-2"
                    />
                    <input
                        type="text"
                        name="longitude"
                        placeholder='Enter Longitude'
                        value={inputs.longitude}
                        onChange={handleInputChange}
                        className="w-1/2 border border-gray-300 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={inputs.description}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-4 py-2 h-32"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Price</label>
                    <input
                        type="text"
                        name="price"
                        value={inputs.price}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Published</label>
                    <Switch
                        onChange={handleSwitchChange}
                        checked={inputs.published}
                        onColor="#6fd26f"
                        onHandleColor="#1ea624"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                        className="react-switch"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Time Slots</label>
                    <textarea
                        placeholder='Enter time slots (7:00 PM, 8:00 PM...) separated by comma'
                        name='availableSlots'
                        value={inputs.availableSlots}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-4 py-2 h-32"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Images</label>
                    <textarea
                        placeholder='Enter links separated by comma'
                        name='images'
                        value={inputs.images}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-4 py-2 h-32"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded-full"
                >
                    Create Ground
                </button>
            </form>
        </div>
    )
}

export default CreateGround