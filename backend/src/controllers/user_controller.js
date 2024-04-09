import { ApiResponse } from "../../utils/api_response.js";
import { asyncHandler } from "../../utils/async_handler.js";
import { UserService } from "../services/user_service.js";
const userService = new UserService();
const registerController = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate request body
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
    "users",
    email,
    username,
    password
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
  const otp = userService.createOtp(existingUser[0].email);
  return res
    .status(201)
    .json(new ApiResponse(200, otp, "User loggedIn Successfully"));
});
export { loginUserController, registerController };
