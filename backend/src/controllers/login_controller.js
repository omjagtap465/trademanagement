import { ApiResponse } from "../../utils/api_response";
const loginUserController = async (req, res) => {
  try {
    const user = await userService.login(req.body);

    return res
      .status(201)
      .json(new ApiResponse(200, user, "User loggedIn Successfully"));
  } catch (error) {
    throw error;
  }
};
export { loginUserController };
