import React from 'react'

const Footer = () => {
	return (
		<div>
			<div className='flex flex-col lg:flex-row bg-violet-500 lg:h-60'>
				<div className='lg:w-1/2 ml-5 lg:ml-12 mt-5 lg:mt-10'>
					<p className='text-white text-2xl font-bold mb-3'>TURFEASE</p>
					
					<p className='text-black mb-5 w-96 lg:w-1/2 text-justify'>Bounce to the victory,Reach for the sky </p>
				</div>
				<div className='lg:w-1/4 mx-5 lg:ml-48 mt-5 lg:mt-10'>
					<p className='text-white text-lg font-bold mb-3'>CONTACT</p>
					<p className='text-black'>EMAIL:- <span className='text-orange-200 hover:text-orange-400 cursor-pointer'>josejoyal272002@gmail.com</span></p>
				</div>
				<div className='lg:w-1/4 mx-5 lg:mr-10 mt-5 lg:mt-10'>
					<p className='text-white text-lg font-bold mb-3'>LINKS</p>
					<p className='text-red-200 hover:text-black-400 cursor-pointer mb-2'>FAQs</p>
					<p className='text-blue-200 hover:text-black-400 cursor-pointer mb-2'><a href="https://www.instagram.com/_nistel_r?igsh=MXNrYjg1eWZ6b2V1cQ==">Facebook</a></p>
					<p className='text-yellow-200 hover:text-black-400 cursor-pointer mb-2'><a href="https://www.instagram.com/turfeasse?igsh=MXhvZ2VlOTl2MmsxeQ==">Instagram</a></p>
					<p className='text-green-200 hover:text-black-400 cursor-pointer mb-2'>LinkedIn</p>
				</div>
			</div>

			<div className='bg-blue-950 py-4 flex flex-col lg:flex-row items-center justify-between border-t border-gray-400'>
				<p className='text-white font-semibold lg:ml-10'> &#169; Turfease</p>
				<div className='flex gap-2 lg:mr-10 lg:gap-10'>
					<a href='#' className='text-white font-medium'>Privacy Policy</a>
					<a href='#' className='text-white font-medium'>Terms</a>
					<a href='#' className='text-white font-medium'>Legal</a>
				</div>
			</div>
		</div>
	)
}

export default Footer;