import express from "express"
import { login, otpSender, signUp } from "../controller/auth";


const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/otp", otpSender);

export default router;