import User from "../Models/User.js";

// Create New User - NO CHANGE NEEDED
export const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users - ADD THIS CHECK
export const getUsers = async (req, res) => {
  try {
    // Optional: Only allow admins to get all users
    // For now, let's just return all users
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single User by Mongo ID - ADD THIS VERIFICATION
export const getUserById = async (req, res) => {
  try {
    // IMPORTANT: Check if user is requesting their own data
    if (req.user.id.toString() !== req.params.id.toString()) {
      return res.status(403).json({ message: 'You can only access your own profile' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User - ADD THIS VERIFICATION
export const updateUser = async (req, res) => {
  try {
    // IMPORTANT: Check if user is updating their own data
    if (req.user.id.toString() !== req.params.id.toString()) {
      return res.status(403).json({ message: 'You can only update your own profile' });
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

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User - ADD THIS VERIFICATION
export const deleteUser = async (req, res) => {
  try {
    // IMPORTANT: Check if user is deleting their own data
    if (req.user.id.toString() !== req.params.id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own profile' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};