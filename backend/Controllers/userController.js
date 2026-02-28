import User from "../Models/User.js";
import ResponseGenerator from "../utils/ResponseGenerator.js";

// Create New User - NO CHANGE NEEDED
export const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(ResponseGenerator.sendSuccess(newUser, "User created successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "User creation failed", error.message));
  }
};

// Get All Users - ADD THIS CHECK
export const getUsers = async (req, res) => {
  try {
    // Optional: Only allow admins to get all users
    // For now, let's just return all users
    const users = await User.find();
    res.status(200).json(ResponseGenerator.sendSuccess(users, "Users retrieved successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Fetch users failed", error.message));
  }
};

// Get Single User by Mongo ID - ADD THIS VERIFICATION
export const getUserById = async (req, res) => {
  try {
    // IMPORTANT: Check if user is requesting their own data
    if (req.user.id.toString() !== req.params.id.toString()) {
      return res.status(403).json(ResponseGenerator.sendError(ResponseGenerator.FORBIDDEN, "You can only access your own profile", "Fetch failed"));
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "User not found", "Fetch failed"));
    res.status(200).json(ResponseGenerator.sendSuccess(user, "User retrieved successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Fetch failed", error.message));
  }
};

// Update User - ADD THIS VERIFICATION
export const updateUser = async (req, res) => {
  try {
    // IMPORTANT: Check if user is updating their own data
    if (req.user.id.toString() !== req.params.id.toString()) {
      return res.status(403).json(ResponseGenerator.sendError(ResponseGenerator.FORBIDDEN, "You can only update your own profile", "Update failed"));
    }

    // Remove fields that shouldn't be updated
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.userId;
    delete updateData.password;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedUser) return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "User not found", "Update failed"));
    res.status(200).json(ResponseGenerator.sendSuccess(updatedUser, "User updated successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Update failed", error.message));
  }
};

// Delete User - ADD THIS VERIFICATION
export const deleteUser = async (req, res) => {
  try {
    // IMPORTANT: Check if user is deleting their own data
    if (req.user.id.toString() !== req.params.id.toString()) {
      return res.status(403).json(ResponseGenerator.sendError(ResponseGenerator.FORBIDDEN, "You can only delete your own profile", "Delete failed"));
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json(ResponseGenerator.sendError(ResponseGenerator.NOT_FOUND, "User not found", "Delete failed"));
    res.status(200).json(ResponseGenerator.sendSuccess(null, "User deleted successfully"));
  } catch (error) {
    res.status(500).json(ResponseGenerator.sendError(ResponseGenerator.INTERNAL_SERVER_ERROR, "Delete failed", error.message));
  }
};