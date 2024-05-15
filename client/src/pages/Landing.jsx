import React, { useEffect, useState } from 'react';
import GroundCard from '../components/GroundCard';
import ImageSlider from '../components/ImageSlider';
import axios from 'axios';
import { BASE_URL } from '../utils/helper';
import '../custom.css';

const Landing = () => {
    const [grounds, setGrounds] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [reviewFormData, setReviewFormData] = useState({ name: '', email: '', review: '' });
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        getAllGrounds();
        loadReviews();
    }, []);

    const getAllGrounds = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/user/grounds`);
            if (data.success) {
                setGrounds(data.grounds);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleScroll = (direction) => {
        const container = document.getElementById('groundContainer');
        const cardWidth = 350; // Adjust this value based on your card width
        const totalWidth = grounds.length * cardWidth;
        const maxScroll = totalWidth - container.offsetWidth;

        if (direction === 'left') {
            setScrollPosition(Math.max(scrollPosition - container.offsetWidth, 0));
        } else if (direction === 'right') {
            setScrollPosition(Math.min(scrollPosition + container.offsetWidth, maxScroll));
        }
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewFormData({ ...reviewFormData, [name]: value });
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const newReviews = [...reviews, reviewFormData];
        setReviews(newReviews);
        setReviewFormData({ name: '', email: '', review: '' });
        localStorage.setItem('reviews', JSON.stringify(newReviews));
    };

    const loadReviews = () => {
        const loadedReviews = JSON.parse(localStorage.getItem('reviews'));
        if (loadedReviews) {
            setReviews(loadedReviews);
        }
    };

    return (
        <div className="relative">
            <ImageSlider />
            <div className="flex w-full absolute z-10 justify-between mt-40">
                <button onClick={() => handleScroll('left')} className="text-white m-1 rounded-full">
                    <img className='w-10' src="../src/images/la.svg" alt="left arrow" />
                </button>
                <button onClick={() => handleScroll('right')} className="text-white m-1 rounded-full">
                    <img className='w-10' src="../src/images/ra.svg" alt="right arrow" />
                </button>
            </div>
            <div id="groundContainer" className="flex mx-4 sm:mx-16 my-8 overflow-x-auto justify-between relative">
                <div className="flex justify-between my-5" style={{ transform: `translateX(-${scrollPosition}px)`, transition: 'transform 0.3s' }}>
                    {grounds.map((ground) => (
                        <div key={ground._id} className="mr-5">
                            <GroundCard
                                id={ground._id}
                                name={ground.ground_name}
                                location={ground.location}
                                price={ground.price}
                                image={ground.images[0]}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <form onSubmit={handleReviewSubmit} className="review-form">
                <h2>Leave a Review</h2>
                <input type="text" name="name" placeholder="Your name" value={reviewFormData.name} onChange={handleReviewChange} />
                <input type="email" name="email" placeholder="Your email" value={reviewFormData.email} onChange={handleReviewChange} />
                <textarea name="review" placeholder="Your review" value={reviewFormData.review} onChange={handleReviewChange}></textarea>
                <button type="submit">Submit Review</button>
            </form>
            {reviews.map((review, index) => (
                <div key={index} className="review-display">
                    <h3>{review.name}</h3>
                    <p>{review.review}</p>
                </div>
            ))}
        </div>
    );
};

export default Landing;
