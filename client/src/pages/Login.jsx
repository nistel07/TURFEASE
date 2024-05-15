import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import turfease from '../assets/turfease.jpg';
import crown from '../assets/bg.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import { BASE_URL } from '../utils/helper';
import { useCallback } from 'react';

const Login = () => {

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [authState, setAuthState] = useState('login');
	const [inputs, setInputs] = useState({
		username: '',
		email: '',
		password: '',
	});

	//toggle between login and signup

	const toggleAuthState = useCallback(() => {
		setAuthState((currentAuthState) => currentAuthState === "login" ? "signup" : "login");
	}, []);

	// handle input change
	const handleOnChange = (e) => {
		setInputs(prevState => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	}

	//login logic
	const handleLogin = async (e) => {
		e.preventDefault();
		if (!inputs.email || !inputs.password) {
			toast.error("Fields cannot be empty");
			return;
		}

		try {
			const { data } = await axios.post(`${BASE_URL}/api/v1/user/login`, {
				email: inputs.email,
				password: inputs.password,
			});
			if (data.success) {
				localStorage.setItem('token', data.token);
				localStorage.setItem("userId", data?.user._id);
				localStorage.setItem("email", data?.user.email);
				localStorage.setItem("username", data?.user.username);
				dispatch(authActions.login());
				toast.success("Logged in");
				navigate('/');
			} else {
				toast.error("Email or password incorrect");
			}
		} catch (error) {
			console.log(error);
			toast.error("incorrect");
		}
	};
	//signup logic
	const handleSignup = async (e) => {
		e.preventDefault();
		if (!inputs.username || !inputs.email || !inputs.password) {
			toast.error("Fields cannot be empty");
			return;
		}

		try {
			const { data } = await axios.post(`${BASE_URL}/api/v1/user/signup`, {
				username: inputs.username,
				email: inputs.email,
				password: inputs.password,
			});
			if (data.success) {
				localStorage.setItem('token', data.token);
				localStorage.setItem("userId", data?.user._id);
				localStorage.setItem("email", data?.user.email);
				localStorage.setItem("username", data?.user.username);
				dispatch(authActions.login());
				toast.success("Registered");
				navigate('/');
			} else {
				toast.error("Email or password incorrect");
			}
		} catch (error) {
			console.log(error);
			toast.error("incorrect");
		}
	};
	function loginsucc(){
		return(
			<>
			<h1 className="text-5xl  text-primary-emphasis text-left text-white" style={{margin:'0',fontWeight:'600',fontFamily:'system-ui',display:'flex',alignItems:'center'}} ><img src={crown} width={'90px'} style={{display:'inline',margin:'0'}}/>Turfeasse</h1>
			<p className='text-2xl text-left text-white ' style={{margin:'0',fontWeight:'300'}}>Bounce to the victory<br></br>Reach for the sky</p>
			</>
		)
	}
	return (
		<div className="flex flex-col lg:flex-row lg:h-screen">
			
			<div className="lg:flex-1 lg:flex items-center justify-center">
				<img src={turfease} alt="turfease" style={{height:'100%'}}/>
			</div>
			{/* Right side with login form */}
			<div className="lg:flex-1 flex items-center justify-center p-12" style={{background: 'linear-gradient(to right, #0b9daa, #75d45e)'}}>
				<form className="max-w-md w-full space-y-4">
				
						{authState === "login" ? loginsucc() : loginsucc()}
			

					{authState === "signup" && (
						<div>
							<label className="block text-white">Username</label>
							<input
								type="text"
								name="username"
								className=" rounded-lg w-full border border-gray-300 px-4 py-3"
								placeholder="Enter your Username"
								value={inputs.username}
								onChange={handleOnChange}
							/>
						</div>
					)}
					<div>
						<label className="block text-white">Email</label>
						<input
							type="email"
							name="email"
							className=" rounded-lg w-full border border-gray-300 px-4 py-3"
							placeholder="Enter your email"
							value={inputs.email}
							onChange={handleOnChange}
						/>
					</div>
					<div>
						<label className="block text-gray-900 text-white">Password</label>
						<input
							type="password"
							name="password"
							className="rounded-lg w-full border border-gray-300 px-4 py-3"
							placeholder="Enter your password"
							value={inputs.password}
							onChange={handleOnChange}
						/>
					</div>
					{authState === "login" ? (
						<button
							style={{ background: '#512779' }}
							type="submit"
							className="w-full text-white py-3 rounded-lg"
							onClick={handleLogin}
						>
							Login
						</button>
					) : (
						<button
							type="submit"
							style={{ background: '#512779' }}
							className="w-full text-white py-3 rounded-lg"
							onClick={handleSignup}
						>
							Sign Up
						</button>
					)}

					<p className="text-center">
						{authState === "login" ? "Don't have an account?" : "Already have an account?"}
						<span>
							{authState === "login" ? (
								<a className='ml-1 hover:underline cursor-pointer text-blue-600' onClick={toggleAuthState}>Sign Up</a>
							) : (
								<a className='ml-1 hover:underline cursor-pointer text-blue-600' onClick={toggleAuthState}>Login</a>
							)}
						</span>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Login;