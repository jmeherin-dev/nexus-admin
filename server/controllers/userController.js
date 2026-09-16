import User from "../models/User.js";

// @desc    সব ইউজারদের তথ্য দেখা (Get all users with Pagination)
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    // URLQuery থেকে page এবং limit ধরবে (ডিফল্ট: page 1, limit 5)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // মোট ইউজারের সংখ্যা গণনা
    const totalUsers = await User.countDocuments();

    // পেজিনেশন অনুযায়ী ডাটাবেজ থেকে ইউজার নিয়ে আসবে
    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit);

    // ফ্রন্টএন্ডের জন্য ডাটা এবং পেজিনেশন ইনফো একসাথে রেসপন্স করবে
    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// @desc    নতুন ইউজার তৈরি করা (Create a new user)
// @route   POST /api/users
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

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
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};