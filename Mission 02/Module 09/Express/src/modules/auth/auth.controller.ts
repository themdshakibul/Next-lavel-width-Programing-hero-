import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);

    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      // http -> false, https -> true
      //Todo: In production -> true
      secure: false,
      // Prevent XXS attack
      httpOnly: true,
      // "none" , "strict", "lax" -> CSRF
      sameSite: "lax",
      // maxAge
      path: "/",
      domain: "localhost", // example.com
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Usear login Successfully!",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const generateToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.generateAccessToken(
      req.cookies.refreshToken,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Access token generated Successfully!!",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

export const authController = {
  loginUser,
  generateToken,
};
