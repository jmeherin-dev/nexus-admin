import User from "../models/User.js";

// @desc    সব ইউজারদের তথ্য দেখা (Get all users)
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    // ডাটাবেজ থেকে সব ইউজার খুঁজবে, কিন্তু সিকিউরিটির জন্য পাসওয়ার্ড দেখাবে না
    const users = await User.find().select("-password"); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// @desc    নতুন ইউজার তৈরি করা (Create a new user)
// @route   POST /api/users
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // চেক করা হচ্ছে সব তথ্য দেওয়া হয়েছে কি না
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // নতুন ইউজার তৈরি ও ডাটাবেজে সেভ করা
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};
// @desc    ইউজার মুছে ফেলা (Delete user)
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
// @desc    ইউজার আপডেট করা (Update user)
// @route   PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, role },
      { new: true } // আপডেট করা নতুন ডাটা রিটার্ন করবে
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};