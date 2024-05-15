import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/helper';
import { useNavigate, useParams } from 'react-router-dom';
import Switch from 'react-switch';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const UpdateGround = () => {

    const navigate = useNavigate();
    const id = useParams().id;
    const token = localStorage.getItem('token');
    // console.log(token);

    const [inputs, setInputs] = useState({});
    const [ground, setGround] = useState({});

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    }

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    }

    // const handleConfirmDelete = () => {
    //     // Perform deletion logic here
    //     setIsDeleteModalOpen(false);
    // }

    //handle publish switch change
    const handleSwitchChange = () => {
        setInputs(prevState => ({
            ...prevState,
            published: !prevState.published
        }))
    }

    const getGroundDetails = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/admin/fetch-ground/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            // console.log(data);
            if (data?.success) {
                const fetchedGround = data?.ground;
                setGround(fetchedGround);
                console.log(fetchedGround);
                setInputs(prevInputs => ({
                    ...prevInputs,
                    ground_name: fetchedGround.ground_name,
                    location: fetchedGround.location,
                    description: fetchedGround.description,
                    price: fetchedGround.price,
                    published: fetchedGround.published,
                    availableSlots: fetchedGround.availableSlots,
                    images: fetchedGround.images,
                    latitude: fetchedGround.coordinates.latitude,
                    longitude: fetchedGround.coordinates.longitude,
                }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getGroundDetails();
    }, []);

    //handle input change
    const handleInputChange = (e) => {
        setInputs(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    }

    // const handleFileChange = (e) => {
    //     const files = Array.from(e.target.files);
    //     setInputs({ ...inputs, images: files });
    // };

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
                // formData.append('latitude', inputs.latitude);
                // formData.append('longitude', inputs.longitude);
                formData.append('coordinates[latitude]', inputs.latitude);
                formData.append('coordinates[longitude]', inputs.longitude);

                // Convert comma-separated URLs to an array of strings
                const imageUrls = inputs.images?.map(url => url.trim());

                // Append the image URLs to the FormData
                imageUrls.forEach((url, index) => {
                    formData.append(`images[${index}]`, url);
                });

                //Convert comma-separated timeslots to an array of strings
                const availableSlots = inputs.availableSlots?.map(timeslot => timeslot.trim());

                // Append the timeslots to the FormData
                availableSlots.forEach((timeslot, index) => {
                    formData.append(`availableSlots[${index}]`, timeslot);
                });

                const { data } = await axios.put(`${BASE_URL}/api/v1/admin/update-ground/${id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json', // Set content type to multipart form data
                    }
                });
                if (data.success) {
                    toast.success("Ground updated");
                    console.log(data);
                    navigate(`/ground/${id}`);
                } else {
                    toast.error("Something went wrong");
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Check log.");
        }
    }

    const handleConfirmDelete = async () => {
        try {
            const { data } = await axios.delete(`${BASE_URL}/api/v1/admin/deleteCourse/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (data?.success) {
                toast.success("Course deleted");
                navigate('/all-courses');
            }
        } catch (error) {
            console.log(error);
        }
        setIsDeleteModalOpen(false);

    }
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Edit Ground</h2>
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
                <div >
                    <button
                        type="submit"
                        className="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded-full"
                    >
                        Update Ground
                    </button>

                    {/* <button className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded-full" onClick={handleDeleteClick}>Delete Ground</button>
                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onCancel={handleCancelDelete}
                        onConfirm={handleConfirmDelete}
                    /> */}
                </div>
            </form>
        </div>
    )
}

export default UpdateGround;