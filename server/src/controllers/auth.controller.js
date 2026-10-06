const crypto = require("crypto");

const userModel = require("../models/user.model");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  changeUserPassword,
} = require("../services/auth.service");

const { googleLogin } = require("../services/googleAuth.service");
const { sendEmail } = require("../services/ses.service");

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

    await changeUserPassword(req.user._id, currentPassword, newPassword);

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

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await userModel.findOne({ email });

    // Don't reveal whether the email exists.
    if (!user) {
      return res.json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);

    await user.save();

    const resetUrl = `https://skilium.in/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Your Skilium Password",
      html: `
        <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <title>Reset Your Skilium Password</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background: #f4f7fb;
      font-family: Arial, Helvetica, sans-serif;
      color: #1e293b;
    ">

      <div style="
        max-width: 650px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
      ">

        <!-- Header -->
        <div style="
          padding: 28px;
          text-align: center;
          background: #07111f;
        ">
          <img
            src="https://skilium.in/assets/skilium-logo-without-bg-DARK.png"
            alt="Skilium"
            width="150"
            style="
              display: block;
              width: 150px;
              max-width: 100%;
              height: auto;
              margin: 0 auto;
              border: 0;
            "
          />
        </div>

        <!-- Main Content -->
        <div style="padding: 35px 30px;">

          <h2 style="
            margin-top: 0;
            color: #0f172a;
          ">
            Reset Your Password
          </h2>

          <p style="
            font-size: 16px;
            line-height: 1.7;
            color: #475569;
          ">
            Hello ${user.fullName},
          </p>

          <p style="
            font-size: 15px;
            line-height: 1.7;
            color: #475569;
          ">
            We received a request to reset the password for your
            Skilium account.
          </p>

          <p style="
            font-size: 15px;
            line-height: 1.7;
            color: #475569;
          ">
            Click the button below to create a new password for your
            account.
          </p>

          <!-- Reset Button -->
          <div style="
            text-align: center;
            margin: 30px 0;
          ">
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 13px 24px;
                background: #06b6d4;
                color: #ffffff;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
              "
            >
              Reset Password
            </a>
          </div>

          <!-- Security Information -->
          <div style="
            margin: 25px 0;
            padding: 18px 20px;
            background: #f8fafc;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
          ">

            <p style="
              margin: 0 0 10px;
              font-size: 14px;
              font-weight: bold;
              color: #334155;
            ">
              Security Information
            </p>

            <p style="
              margin: 6px 0;
              font-size: 14px;
              line-height: 1.6;
              color: #64748b;
            ">
              This password reset link will expire in
              <strong>30 minutes</strong>.
            </p>

            <p style="
              margin: 6px 0;
              font-size: 14px;
              line-height: 1.6;
              color: #64748b;
            ">
              If you did not request a password reset, you can safely
              ignore this email. Your password will remain unchanged.
            </p>

          </div>

          <p style="
            font-size: 13px;
            line-height: 1.6;
            color: #64748b;
          ">
            For your security, never share this password reset link
            with anyone.
          </p>

          <!-- Fallback URL -->
          <p style="
            margin-top: 25px;
            font-size: 12px;
            line-height: 1.6;
            color: #94a3b8;
            word-break: break-all;
          ">
            If the button above does not work, copy and paste the
            following link into your browser:
          </p>

          <p style="
            font-size: 12px;
            line-height: 1.6;
            color: #64748b;
            word-break: break-all;
          ">
            ${resetUrl}
          </p>

        </div>

        <!-- Footer -->
        <div style="
          padding: 20px 30px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        ">
          <p style="
            margin: 0;
            font-size: 12px;
            color: #64748b;
          ">
            This is an automated email from Skilium.
            Please do not reply to this email.
          </p>
        </div>

      </div>

    </body>
  </html>
      `,
      text: `
Reset your Skilium password:

${resetUrl}

This link expires in 30 minutes.
      `,
    });

    return res.json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Invalid password reset link.",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // Hash token received from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset link is invalid or has expired.",
      });
    }

    // IMPORTANT:
    // Use the same password hashing mechanism
    // that your login/register flow already uses.

    user.password = password;

    // Invalidate token after successful reset
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    return res.json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password.",
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
  forgotPassword,
  resetPassword
};
