import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from '../utils/helper';
import { useSelector, useDispatch } from 'react-redux';
import ImageViewer from 'react-simple-image-viewer';
import toast from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';
import GoogleMap from '../components/GoogleMap';

const GroundDetails = () => {

	const token = localStorage.getItem('token');
	const email = localStorage.getItem('email');
	const navigate = useNavigate();
	const id = useParams().id;
	const [inputs, setInputs] = useState({});
	const [isViewerOpen, setIsViewerOpen] = useState(false);
	const [currentImage, setCurrentImage] = useState(0);
	const [ground, setGround] = useState({});
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

	//global state
	let isLogin = useSelector((state) => state.isLogin);
	isLogin = isLogin || localStorage.getItem('userId');


	const openImageViewer = (index) => {
		setCurrentImage(index);
		setIsViewerOpen(true);
	};
	const closeImageViewer = () => {
		setCurrentImage(0);
		setIsViewerOpen(false);
	};

	//logic to get ground details
	const getGroundDetails = async () => {
		try {
			const { data } = await axios.get(`${BASE_URL}/api/v1/user/ground/${id}`, {
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
					availableSlots: data?.ground.availableSlots,
					latitude: data?.ground.coordinates.latitude,
					longitude: data?.ground.coordinates.longitude,
				})
				console.log(inputs.latitude);
				console.log(inputs.longitude);
			}
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		getGroundDetails();
	}, []);

	//handle datechange to disable current day timeslot
	const handleDateChange = (event) => {
		const selectedValue = event.target.value;
		setSelectedDate(new Date(selectedValue));
	};
	const handleTimeSlotChange = (event) => {
		const selectedValue = event.target.value;
		setSelectedTimeSlot(selectedValue);
	};
	const isCurrentDate = selectedDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];

	//logic to book ground
	const bookGround = async (e) => {
		e.preventDefault();
		if (selectedDate === "" || selectedTimeSlot === "") {
			toast.error("Select date and time");
			return;
		}
		try {
			const { data } = await axios.post(`${BASE_URL}/api/v1/user/book-slot/${id}`, {
				date: selectedDate,
				timeSlot: selectedTimeSlot,
			}, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				}
			});
			if (data.success) {
				toast.success("Ground booked!");
				navigate('/bookings');
			}
		} catch (error) {
			console.log(error);
			toast.error("already booked");
		}
	}

	return (
		<div className="bg-gray-200 min-h-screen p-4 lg:pt-5">
			<h2 className="text-2xl lg:text-4xl lg:mt-4 lg:ml-4 font-bold mb-4">{inputs.name}</h2>
			<div className='flex flex-col lg:flex-row'>
				<div className='lg:w-1/2 lg:p-4 mt-8 lg:mt-4'>
					<div className='bg-gray-100 flex flex-col border border-gray-300 p-6 rounded-lg justify-center mb-4 shadow-md'>
						<h1 className='text-xl font-semibold mb-2'>Location</h1>
						<p className="text-lg mb-2">{inputs.location}</p>
						<GoogleMap
							lat={inputs.latitude}
							long={inputs.longitude}
							name={inputs.name}
						/>
					</div>
					<div className='bg-gray-100 flex flex-col border border-gray-300 p-6 rounded-lg justify-center mb-4 shadow-md'>
						<h1 className='text-xl font-semibold mb-2'>About {inputs.name}</h1>
						<p className="text-gray-700">{inputs.description}</p>
					</div>
					<div className='bg-gray-100 flex flex-col border border-gray-300 p-6 rounded-lg justify-center shadow-md'>
						<h1 className='text-xl font-semibold mb-2'>Amenities</h1>
						<p className="text-gray-700">Parking, Washroom</p>
					</div>
				</div>
				<div className='lg:w-1/2 lg:p-4 mt-8 lg:mt-4'>
					<div className='flex flex-col bg-gray-100 border border-gray-300 p-5 rounded-lg justify-center mb-4 shadow-md'>
						<h1 className='text-xl font-semibold mb-3'>Images</h1>
						<div className="flex flex-row overflow-scroll">
							{inputs.images?.map((image, index) => (
								<div key={index} className="">
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
					</div>
					<form onSubmit={bookGround} className='bg-gray-100 flex flex-col border border-gray-300 p-6 rounded-lg justify-center mb-4 shadow-md'>
						<div className="mb-4">
							<label className="block text-gray-700 mb-2">Select Date:</label>
							<input
								type="date"
								value={selectedDate.toISOString().split('T')[0]}
								onChange={handleDateChange}
								className='rounded p-2 border border-black-300 w-full'
							/>
						</div>
						<div className="mb-4">
							<label className="block text-black-700 mb-2">Select Time Slot:</label>
							<select
								name='timeSlot'
								value={selectedTimeSlot}
								onChange={handleTimeSlotChange}
								className="w-full border border-black-300 rounded p-2"
								disabled={isCurrentDate}
							>
								<option value="">Select a Time Slot</option>
								{inputs.availableSlots?.map((time, index) =>
									<option key={index} value={time}>{time}</option>
								)}
							</select>
							{isCurrentDate ? <span className='text-red-500 ml-3'>No slots available for selected date</span> : ""}
							<br></br><span className='text-purple-900 ml-3'>cancellation not available</span>
						</div>
						{isLogin && <>
							<button
								type='submit'
								className='bg-gray-900 text-white lg:w-32 px-4 py-2 rounded-lg mb-2'
							>
								Book
							</button>
							<span className='font-semibold'>@ ₹{inputs.price}/hour</span>
							<br/>
							<h3>Scan QR and Complete the payment</h3>
							<img src="/qr.png" width="200px" alt="" srcset="" />
						</>}
						{!isLogin && <button
							onClick={() => { navigate('/login') }}
							className='bg-gray-900 text-white lg:w-32 px-4 py-2 rounded-lg'
						>
							Login to book
						</button>}
					</form>
				</div>
				
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