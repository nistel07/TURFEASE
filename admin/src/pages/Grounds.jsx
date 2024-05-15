import React from 'react'
import GroundCard from '../components/GroundCard';
import axios from 'axios';
import { BASE_URL } from '../utils/helper';
import { useEffect } from 'react';
import { useState } from 'react';

const Grounds = () => {

    const [grounds, setGrounds] = useState([]);
    const token = localStorage.getItem('token');

    const getAllGrounds = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/admin/fetch-grounds`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            // console.log("data is", data);
            if (data.success) {
                setGrounds(data.grounds);
            }
            // console.log(grounds);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getAllGrounds();
    }, []);

    return (
        <div className='flex flex-wrap justify-start gap-14'>
            {grounds?.map((ground) =>
                <div key={ground?._id} className="ml-10 mt-5">
                    <GroundCard
                        id={ground?._id}
                        name={ground?.ground_name}
                        location={ground.location}
                        price={ground.price}
                        image={ground?.images[0]}
                    />
                </div>
            )}
        </div>
    )
}

export default Grounds;