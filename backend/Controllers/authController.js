import jwt from 'jsonwebtoken';
import User from "../Models/User.js";
import ResponseGenerator from '../utils/ResponseGenerator.js';

// Function to generate next userId (001, 002, 003, etc.)
export const generateNextUserId = async () => {
    try {
        // Get the highest userId
        const lastUser = await User.findOne().sort({ userId: -1 });

        if (!lastUser) {
            return "001"; // First user
        }

        const lastUserId = lastUser.userId;

        // Check if it's in format "001" or "USR-1001"
        if (lastUserId.startsWith("USR-")) {
            // Handle USR-1001 format (your existing user)
            const num = parseInt(lastUserId.split("-")[1]);
            const nextNum = num + 1;
            return `USR-${nextNum}`;
        } else {
            // Handle 001 format (new users)
            const num = parseInt(lastUserId);
            const nextNum = num + 1;
            return nextNum.toString().padStart(3, '0');
        }
    } catch (error) {
        console.error("Error generating userId:", error);
        return "001"; // Default fallback
    }
};

export const checkEnv = (req, res) => {
    res.json(ResponseGenerator.sendSuccess({
        hasJWT: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV
    }, "Environment check success"));
};

export const testAuth = (req, res) => {
    res.json(ResponseGenerator.sendSuccess(null, "Auth routes are working"));
};

export const register = async (req, res) => {
    try {
        console.log("Register attempt:", req.body);

        const { firstName, lastName, email, password } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "All fields are required", "Registration failed"));
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "Email already registered", "Registration failed"));
        }

        // Generate auto-incrementing userId
        const userId = await generateNextUserId();
        console.log("Generated userId:", userId);

        // Create user (password stored as plain text)
        const newUser = new User({
            userId: userId,
            name: `${firstName} ${lastName}`.trim(),
            email: email,
            password: password, // Plain text - NO HASHING
        });

        const savedUser = await newUser.save();
        console.log("User registered with ID:", savedUser.userId);

        // CREATE JWT TOKEN
        const token = jwt.sign(
            {
                id: savedUser._id.toString(),
                email: savedUser.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(201).json(ResponseGenerator.sendSuccess({
            token,
            user: {
                userId: savedUser.userId,
                name: savedUser.name,
                email: savedUser.email,
                _id: savedUser._id
            }
        }, "Registration successful"));

    } catch (error) {
        console.error("❌ Registration error:", error);
        res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Registration failed", error.message));
    }
};

export const login = async (req, res) => {
    try {
        console.log("🔐 Login attempt:", req.body.email);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(ResponseGenerator.sendError(ResponseGenerator.BAD_REQUEST, "Email and password are required", "Login failed"));
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json(ResponseGenerator.sendError(ResponseGenerator.UNAUTHORIZED, "Invalid email or password", "Login failed"));
        }

        // Direct comparison (plain text)
        if (password === user.password) {
            console.log("Login successful:", user.email);

            // CREATE JWT TOKEN
            const token = jwt.sign(
                {
                    id: user._id.toString(),
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            const userData = {
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                _id: user._id
            };

            return res.status(200).json(ResponseGenerator.sendSuccess({
                token,
                user: userData
            }, "Login successful"));
        } else {
            return res.status(401).json(ResponseGenerator.sendError(ResponseGenerator.UNAUTHORIZED, "Invalid email or password", "Login failed"));
        }

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Login failed", error.message));
    }
};
