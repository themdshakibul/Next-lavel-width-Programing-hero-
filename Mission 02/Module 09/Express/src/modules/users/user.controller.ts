import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";

const createUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);

    // res.status(201).json({
    //   success: true,
    //   message: "Users Created!!",
    //   data: result.rows[0],
    // });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Users Created!!",
      data: result.rows[0],
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

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFormDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users Retrived successfully!",
      data: result.rows,
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

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getSingleUserFormDB(id as string);

    if (result.rowCount === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User Not Found!",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Retrived successfully!",
      data: result.rows[0],
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

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.updateUserFormDB(req.body, id as string);

    if (result.rowCount === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User Not Found!",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Updated Successfully!",
      data: result.rows[0],
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUserFormDB(id as string);

    if (result.rowCount === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User Not Found!",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Deleted Successfully!",
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

export const userController = {
  createUsers,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
