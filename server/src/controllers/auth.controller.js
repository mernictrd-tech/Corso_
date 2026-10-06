const {
  registerUser,
  loginUser,
  getCurrentUser,
  changeUserPassword,
} = require("../services/auth.service");

const { googleLogin } = require("../services/googleAuth.service");

// ================= REGISTER =================

const register = async (req, res) => {
  try {
    const { user, token } = await registerUser(req.body);

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Account created successfully.",
        token,
        data: user,
      });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN =================

const login = async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Login successful.",
        token,
        data: user,
      });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CURRENT USER =================

const me = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GOOGLE LOGIN =================

const googleAuth = async (req, res) => {
  try {
    const { accessToken } = req.body;

    const { user, token } = await googleLogin(accessToken);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Google Login Successful.",
        token,
        data: user,
      });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CHANGE PASSWORD =================

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await changeUserPassword(
      req.user._id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGOUT =================

const logout = async (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully.",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = {
  register,
  login,
  me,
  logout,
  googleAuth,
  changePassword,
};