const User = require("../../model/admin/customer.js");
const bcrypt = require("bcryptjs");
// const transporter = require("../db/emailConfig.js");
const Jwt = require("jsonwebtoken");
const { generateOTP, sendEmail } = require("../../utils/emailUtils.js");
const path = require("path")
const userRegistration = async (req, res) => {
  const { firstName, lastName, email, password, confirm_password } = req.body;
  console.log(req.body)
  let photo = [];

  if (req.files && req.files.length > 0) {
    photo = req.files.map((file) => file.filename);
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send({ status: "failed", message: "Email already exists" });
    }

    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !password || !confirm_password) {
      console.log("Validation failed.......");
      return res.status(400).send({ status: "failed", message: "All fields are required" });
    }

    // Check if password and confirm_password match
    if (password !== confirm_password) {
      return res.status(400).send({
        status: "failed",
        message: "Password and confirm password do not match",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Save the user to the database
    const newUser = new User({
      firstName,
      lastName,
      email,
      photo, // Optional field, will be an empty array if no files are uploaded
      password: hashPassword,
    });

    await newUser.save();

    // Return success response
    res.status(200).send({ status: "true", message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "failed", message: "Unable to register" });
  }
};



// Login from
const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }
  
      const user = await User.findOne({ email: email });
    //   console.log(User)
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "You are not a registered user" });
      }
    console.log(user)
      const isMatch = await bcrypt.compare(password, user.password); // Corrected line
      if (!isMatch) {
        return res
          .status(401)
          .json({ status: "failed", message: "Email or password is not valid" });
      }
   
      // Generate JWT Token
      const token = Jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "5d",
      });
      console.log(token)
      const cookieOptions = {
        maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days in milliseconds
        httpOnly: true,
        sameSite: 'None',
        secure: process.env.NODE_ENV === 'development', // Use secure cookies in production
      };

      res.cookie("token", token, cookieOptions);
      // res.redirect("/home");
      res.json({
        status: "success",
        message: "Login success",
        token: token,
        user
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: "Unable to login" });
    }
  };
//

//forgot password

const sendUserPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const validateEmail = (email) => {
      return emailRegex.test(email);
    };
    // Validate email format
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    console.log(user,"user")
    // Generate OTP
    const otp = generateOTP();

    // Save the OTP to the user's document (optional)
    user.resetOTP = otp;
    await user.save();

    // Send email with OTP
    const subject = "Password Reset OTP";
    const text = `Your OTP for password reset is: ${otp}`;
    await sendEmail(User.email, subject, text);
    // res.redirect("/reset_password");
    // Return success response
    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const userPasswordReset = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    // Check if the user exists
    const user = await User.findOne({ resetOTP: otp });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify OTP
    if (user.resetOTP !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    // // Validate new password format
    // if (!validateStrongPassword(newPassword)) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: 'Invalid password format' });
    // }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    User.password = hashPassword;
    User.resetOTP = undefined; // Clear the OTP field
    await User.save();
    // res.redirect("/login");
    // Return success response
    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', { 
      httpOnly: true,
      sameSite:"None",
      secure:true 

    });
    return res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


const getUserById = async (req, res) => {
  try {
    const userId =  req.userId;
    console.log(userId)
    const user = await User.findById(userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserByObjectId = async (req, res) => {
  try {
    const {id} =  req.query;
   
    const user = await User.findById(id);
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserById = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = req.body;

    console.log('userId:', userId);
    console.log('userData:', userData);

    // Exclude sensitive fields from being updated
    const { password, confirm_password, resetOTP, ...updateData } = userData;

    // Add updatedAt field
    updateData.updatedAt = Date.now();

    console.log('updateData:', updateData);

    // Check if the user exists before updating
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found after update attempt" });
    }

    res.status(200).json({ data: updatedUser, message: "Update successful" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserByObjectId = async (req, res) => {
  const { id } = req.query;
  const updateFields = {};
  const updatedFields = {};

  try {
    // Handle file uploads if req.file is defined
    if (req.file) {
      updateFields.photo = path.basename(req.file.path);
      updatedFields.photo = updateFields.photo; // Include updated field in response
    }

    // Update other fields from req.body
    for (const key in req.body) {
      if (key !== 'photo') { // Exclude photo field if it is being handled separately
        updateFields[key] = req.body[key];
        updatedFields[key] = req.body[key]; // Include updated field in response
      }
    }

    // Add updatedAt field
    updateFields.updatedAt = Date.now();
    updatedFields.updatedAt = updateFields.updatedAt;

    // Check if the user exists before updating
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update User data in the database
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found after update attempt' });
    }

    // Respond with updated fields only
    res.status(200).json({ id: updatedUser._id, updatedFields });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const getUser = async (req, res) => {
  try {
    const { page = 1 } = req.query;
        const limit = 15;
        const count = await User.countDocuments();
    const user = await User.find() .skip((page - 1) * limit) // Skip records for previous pages
    .limit(limit); 
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit,
      message: "cities fetched successfully",
     });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  userRegistration,
  userLogin,
  sendUserPasswordResetEmail,
  userPasswordReset,
  logoutUser,
  getUserById,
  updateUserById, 
  deleteUserById,
  getUser,
  updateUserByObjectId,
  getUserByObjectId
};
