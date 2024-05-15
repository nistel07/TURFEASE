import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
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
            const { data } = await axios.post(`${BASE_URL}/api/v1/admin/login`, {
                email: inputs.email,
                password: inputs.password,
            });
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem("userId", data?.admin._id);
                localStorage.setItem("email", data?.admin.email);
                localStorage.setItem("username", data?.admin.username);
                dispatch(authActions.login());
                toast.success("Logged in");
                navigate('/home');
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
            const { data } = await axios.post(`${BASE_URL}/api/v1/admin/signup`, {
                username: inputs.username,
                email: inputs.email,
                password: inputs.password,
            });
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem("userId", data?.admin._id);
                localStorage.setItem("email", data?.admin.email);
                localStorage.setItem("username", data?.admin.username);
                dispatch(authActions.login());
                toast.success("Registered");
                navigate('/home');
            } else {
                toast.error("Email or password incorrect");
            }
        } catch (error) {
            console.log(error);
            toast.error("incorrect");
        }
    };

    return (
        <div className="flex h-screen">
            {/* Left side with image and text */}
            <div className="flex-1 bg-purple-700 text-green p-12 flex items-center justify-center">
                <div>
                    <h2 className="text-4xl font-bold mb-4">HERE YOU GO.. TURFEASE --ADMIN PANEL</h2>
                    <p className="text-lg">Login to access your account.</p>
                </div>
            </div>

            {/* Right side with login form */}
            <div className="flex-1 flex items-center justify-center p-12">
                <form className="max-w-md w-full space-y-4">
                    <h2 className="text-2xl font-bold text-center">
                        {authState === "login" ? "Login" : "Create an account"}
                    </h2>

                    {authState === "signup" && (
                        <div>
                            <label className="block text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="w-full border border-gray-300 rounded px-4 py-2"
                                placeholder="Enter your Username"
                                value={inputs.username}
                                onChange={handleOnChange}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full border border-gray-300 rounded px-4 py-2"
                            placeholder="Enter your email"
                            value={inputs.email}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full border border-gray-300 rounded px-4 py-2"
                            placeholder="Enter your password"
                            value={inputs.password}
                            onChange={handleOnChange}
                        />
                    </div>
                    {authState === "login" ? <button
                        type="submit"
                        className="w-full bg-orange-700 hover:bg-green-900 text-white py-2 rounded-lg"
                        onClick={handleLogin}
                    >
                        Login
                    </button> : <button
                        type="submit"
                        className="w-full bg-purple-700 hover:bg-green-900 text-white py-2 rounded-lg"
                        onClick={handleSignup}
                    >
                        Sign Up
                    </button>}

                    <p>{authState === "login" ? "Don't have an account?" : "Already have an account?"}
                        <span>{authState === "login" ?
                            <a className='ml-1 hover:underline cursor-pointer text-green-700' onClick={toggleAuthState}>Sign Up</a> : <a className='ml-1 hover:underline cursor-pointer text-green-700' onClick={toggleAuthState}>Login</a>}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;