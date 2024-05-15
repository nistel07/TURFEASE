import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import { BASE_URL } from '../utils/helper';

const GoogleMap = ({ lat, long, name }) => {
    const defaultCenter = {
        center: {
            lat: 23.022505,
            lng: 72.571365
        },
        zoom: 15
    };

    const [apiKey, setApiKey] = useState([]);

    //fetch api key from backend
    const getApiKey = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/user/api-key`);
            if (data?.success) {
                setApiKey(data?.key);
            }
            // console.log(typeof (apiKey));
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getApiKey();
    }, []);

    return (
        <div style={{ height: '250px', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: apiKey }}
                defaultCenter={defaultCenter.center}
                defaultZoom={defaultCenter.zoom}
            >
                <div
                    lat={lat}
                    lng={long}
                    text={name}
                />
            </GoogleMapReact>
        </div>
    );
}

export default GoogleMap;
