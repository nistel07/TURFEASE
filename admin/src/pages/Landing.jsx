import React from 'react'
import SidePanel from '../components/SidePanel'
import Grounds from './Grounds'
import Bookings from './Bookings'

const Landing = () => {
    return (
        <div>
            <p className=' ml-10 mt-5 mb-3 font-bold text-xl p-8'>Listed Grounds</p>
            <div className='flex flex-wrap justify-start gap-5'>
                <Grounds />
            </div>
            <div className='flex flex-wrap justify-start gap-5'>
                <Bookings />
            </div>
        </div>
    )
}

export default Landing