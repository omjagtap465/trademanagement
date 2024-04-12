import { ApiResponse } from "../../utils/api_response.js";
import { asyncHandler } from "../../utils/async_handler.js";
import { UserService } from "../services/user_service.js";
import { generateBase30 } from "random-key";
const userService = new UserService();
const registerController = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  const keyForOTP = generateBase30(7).toString();
  console.log(keyForOTP);
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Username,email or password is missing" });
  }

  const existingUser = await userService.getUser(username);
  console.log(existingUser);
  if (existingUser.length !== 0) {
    return res.status(400).json({ message: "User already exists" });
  }
  const createUser = await userService.createUser(
    email,
    username,
    password,
    keyForOTP
  );
  const createdUser = await userService.getUser(username);
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Created Successfully"));
});
const loginUserController = asyncHandler(async (req, res, next) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is missing" });
  }
  const existingUser = await userService.getUser(username);
  if (existingUser.length === 0) {
    return res.status(400).json({ message: "User Does Not exists" });
  }
  console.log(existingUser);
  const otpGenerate = await userService.createOtp(
    existingUser[0].otp_generator_key,
    existingUser[0].email
  );
  // const otp = userService.createOtp(existingUser[0].email);
  return res
    .status(201)
    .json(new ApiResponse(200, existingUser[0], "User Present "));
});
const verifyOtpController = asyncHandler(async (req, res, next) => {
  const { otp, username } = req.body;
  if (!otp && !username) {
    return res.status(400).json({ message: "OTP or Username  is missing" });
  }
  const existingUser = await userService.getUser(username);
  if (existingUser.length === 0) {
    return res.status(400).json({ message: "User Does Not exists" });
  }
  const otpVerification = await userService.verifyOtp(
    otp,
    existingUser[0].otp_generator_key
  );
  console.log(otpVerification);
  return res
    .status(201)
    .json(new ApiResponse(200, otpVerification, "User Present "));
});
export { loginUserController, registerController, verifyOtpController };
