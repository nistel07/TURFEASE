import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Ground } from "../models/groundModel.js";
import { Booking } from "../models/bookingModel.js";

//*************** user registration ***************//

export const userSignup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(403).send({
                message: "User already exists",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username: username,
            email: email,
            password: hashedPassword,
        });

        await user.save(); //save user to db

        const token = jwt.sign(
            { email, role: 'user' },
            process.env.SECRET,
            { expiresIn: '1d' }
        );

        return res.status(201).send({
            message: "User created",
            success: true,
            user,
            token,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error creating account",
            success: false,
            error,
        });
    }
}

//*************** user login ***************//
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({
                message: "User not found",
                success: false,
            });
        }

        //compare password
        const matchPassword = bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(403).send({
                message: "Incorrect email or password",
                success: false,
            });
        }

        //create token and login
        const token = jwt.sign(
            { email, role: 'user' },
            process.env.SECRET,
            { expiresIn: '1d' }
        );
        res.status(200).send({
            message: "Logged in",
            success: true,
            user,
            token,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Something went wrong",
            success: false,
            error,
        });
    }
}

//*************** display grounds for the user ***************//
export const getGrounds = async (req, res) => {
    try {
        const grounds = await Ground.find({ published: true });
        res.status(200).send({
            success: true,
            grounds,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "No grounds listed",
            success: false,
            error,
        });
    }
}

//*************** get ground by id ***************//
export const getGroundById = async (req, res) => {
    try {
        const groundId = req.params.id;
        const ground = await Ground.findById(groundId);
        res.status(200).send({
            success: true,
            ground,
        });
    } catch (error) {
        console.log(error);
        return res.status(404).send({
            message: "ground not found",
            success: false,
            error,
        });
    }
}

//*************** book time slot ***************//
export const bookTimeSlot = async (req, res) => {
    try {
        const groundId = req.params.id;
        const ground = await Ground.findById(groundId);

        if (!ground) {
            return res.status(400).send({
                message: "Ground not found",
                success: false,
            });
        }

        //date and timeslot validations
        const { date, timeSlot } = req.body;

        const isValidDate = (date) => {
            const currentDate = new Date();
            return date instanceof Date && date > currentDate;
        };
        // Parse the date string to a JavaScript Date object
        const parsedDate = new Date(date);
        console.log(parsedDate);

        if (!isValidDate(parsedDate)) {
            return res.status(400).send({
                message: "Invalid date provided",
                success: false,
            });
        }

        const isValidTimeSlot = (timeSlot, availableSlots) => {
            return availableSlots.includes(timeSlot);
        };
        if (!isValidTimeSlot(timeSlot, ground.availableSlots)) {
            return res.status(400).send({
                message: "Selected time slot is not available",
                success: false,
            });
        }

        //check if time slot is already booked
        if (ground.bookings.some(booking => booking.date.getTime() === parsedDate.getTime() && booking.timeSlot === timeSlot)) {
            return res.status(400).send({
                message: "Selected time slot is already booked",
                success: false,
            });
        }

        // user validation
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(403).send({
                message: "User not found",
                success: false,
            });
        }
        const booking = new Booking({
            user: user.username,
            ground: ground.ground_name,
            date: parsedDate,
            timeSlot,
        });
        await booking.save();

        //update and save ground's booking array
        ground.bookings.push(booking);
        await ground.save();

        //update and save user's booking array
        user.bookings.push(booking);
        await user.save();

        res.status(200).send({
            message: "Time slot booked successfully",
            success: true,
            booking,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "something went wrong",
            success: false,
            error,
        });
    }
}

//*************** get bookings by user ***************//
export const getBookings = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).populate('bookings');
        if (user) {
            res.status(200).send({
                bookings: user.bookings || [],
                success: true,
            });
        } else {
            return res.status(400).send({
                message: "User not found",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "No bookings found",
            success: false,
            error,
        });
    }
}

export const getApiKey = async (req, res) => {
    try {
        const key = process.env.API_KEY;
        if (key) {
            res.status(200).send({
                success: true,
                key,
            });
        } else {
            return res.status(400).send({
                message: "No key found",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "No API key found",
            success: false,
            error,
        });
    }
}
