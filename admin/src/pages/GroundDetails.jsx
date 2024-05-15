import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from '../utils/helper';
import ImageViewer from 'react-simple-image-viewer';


const GroundDetails = () => {

    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const id = useParams().id;
    const [inputs, setInputs] = useState({});
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [ground, setGround] = useState({});
    // const [grounds, setGrounds] = useState([]);
    // const email = localStorage.getItem('email');

    const openImageViewer = (index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    };

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    const getGroundDetails = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/admin/fetch-ground/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log(data);
            if (data?.success) {
                setGround(data?.ground);
                setInputs({
                    name: data?.ground.ground_name,
                    location: data?.ground.location,
                    description: data?.ground.description,
                    price: data?.ground.price,
                    images: data?.ground.images,
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getGroundDetails();
    }, []);

    return (
        <div>
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">{inputs.name}</h2>
                <p className="text-lg mb-2">{inputs.location}</p>
                <p className="text-gray-700 mb-8">{inputs.description}</p>
                <p className="text-gray-700 mb-8">{inputs.price}</p>
                <div className="flex flex-row items-center">
                    {inputs.images?.map((image, index) => (
                        <div key={index} className="mb-4">
                            <img
                                src={image}
                                onClick={() => openImageViewer(index)}
                                className="cursor-pointer"
                                alt={`Image ${index + 1}`}
                                style={{ maxWidth: '200px', height: '150px', margin: "2px" }} // Set max width and height for thumbnail
                            />
                        </div>
                    ))}
                </div>
                <button
                    className='bg-green-700 text-white px-4 py-2 rounded-full'
                    onClick={() => {
                        navigate(`/update/${id}`);
                    }}
                >Edit</button>
            </div>
            {isViewerOpen &&
                <ImageViewer
                    src={inputs.images}
                    currentIndex={currentImage}
                    onClose={closeImageViewer}
                />
            }
        </div>
    )
}

export default GroundDetails;