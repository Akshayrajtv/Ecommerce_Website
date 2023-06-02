import express from "express";
import { registerController } from "../controllers/authController.js";
import {
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
//router object
const router = express.Router();
//routing
//Register||method post
router.post("/register", registerController);
//login ||method post
router.post("/login", loginController);

//forgot password
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected route auth//user
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

//protected route auth//admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);
export default router;
