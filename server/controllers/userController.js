import User from "../models/user.model.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        id: user._id,
        userName: user.userName,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const users = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.json({
      success: true,
      message: "All users retrieved successfully",
      users,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "An error occurred while retrieving the users",
      error: error.message,
    });
  }
};

// update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName } = req.body;

    // Validate required fields
    if (!userName) {
      return res.json({
        success: false,
        message: "User name is required",
      });
    }

    if (!id) {
      return res.json({
        success: false,
        message: "user id is required",
      });
    }

    // Find user by email
    const user = await User.findById(id);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields
    user.userName = userName;

    // Save changes
    const updatedUser = await user.save();

    return res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.json({
      success: false,
      message: "An error occurred while updating the user",
    });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.json({ success: false, message: "user id is required" });

    const user = await User.findById(id);

    if (id !== user.id)
      return res.json({ success: false, message: "invalid UserId" });

    await User.findByIdAndDelete(id);

    return res.json({ success: true, message: "user deleted successfully" });
  } catch (error) {
    return res.json({
      success: false,
      message: "An error occurred while deleting the user",
    });
  }
};
