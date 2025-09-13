import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import { configDotenv } from "dotenv";
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
configDotenv();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        if (!firstName || !lastName || !email || !password) {
            return res.json({ error: "All fields are required" });
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ error: "User already exists" });
        }
        const hasingpassowrd = bcrypt.hashSync(password, 10);

        const User = new userModel({
            firstName,
            lastName,
            email,
            password: hasingpassowrd,
        });

        await User.save();
        const token = jwt.sign({ email }, JWT_SECRET_KEY);
        res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.json({ error: "All fields are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ error: "Invalid email or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ email }, JWT_SECRET_KEY);
        res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
};

const resetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ error: "User not found" });
        }
        const secret = process.env.SECRET_KEY + user.password;
        const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
        const resetLink = `http://localhost:5000/reset-password/${token}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD
            }
        });
        const mailOptions = {
            to: user.email, // send to user
            from: process.env.GMAIL_USER, // from your app email
            subject: 'Reset Password',
            text: `Please click opn the link to reset your password: ${resetLink}`
        };
        await transporter.sendMail(mailOptions);
        res.json({ message: "Reset password link sent" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Add a new function to handle updating the password
const updatePassword = async (req, res) => {
    const {  password } = req.body;
    const { token } = req.params; // Get token from params
    try {
        // Decode token to get email
        const decoded = jwt.decode(token);
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.json({ error: "Invalid token or user not found" });
        }
        const secret = process.env.SECRET_KEY + user.password;
        jwt.verify(token, secret);

        const hashedPassword = bcrypt.hashSync(password, 10);
        await user.updateOne({ password: hashedPassword });
        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Invalid or expired token" });
    }
};

export {
    createUser,
    loginUser,
    resetPassword,
    updatePassword
}