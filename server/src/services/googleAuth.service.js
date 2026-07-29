const axios = require("axios");

const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

const googleLogin = async (accessToken) => {
  // Get user information from Google
  const { data } = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const {
    sub,
    email,
    name,
    picture,
    email_verified,
  } = data;

  if (!email_verified) {
    throw new Error("Google email is not verified.");
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      fullName: name,
      email,
      password: "GOOGLE_LOGIN_USER",
      avatar: picture,
      provider: "google",
      googleId: sub,
      isVerified: true,
      termsAccepted: true,
    });
  } else {
    user.googleId = sub;
    user.provider = "google";

    if (!user.avatar) {
      user.avatar = picture;
    }

    await user.save();
  }

  const token = generateToken(user._id);

  user.password = undefined;

  return {
    user,
    token,
  };
};

module.exports = {
  googleLogin,
};