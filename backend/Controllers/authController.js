import User from "../Models/User.js";
import bcrypt from "bcryptjs";

// Register User
export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Generate userId (you can customize this)
        const userId = "USR-" + Date.now().toString().slice(-6);

        // Create full name from first and last name
        const name = `${firstName} ${lastName}`;

        // Create new user
        const user = await User.create({
            userId,
            name,
            email,
            password
            // other fields will be added later when user updates profile
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                userId: user.userId,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};