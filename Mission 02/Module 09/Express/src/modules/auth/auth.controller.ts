import type { Request, Response } from "express";
import { authService } from "./auth.service";

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

    res.status(201).json({
      success: true,
      message: "Usear login Successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

export const authController = {
  loginUser,
};
