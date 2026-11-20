import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

//?  "/api/v1/users/"
router.post("/", userController.createUsers);



export const userRoute = router;
