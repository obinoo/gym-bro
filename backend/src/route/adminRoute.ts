import express from "express"
import { adminLogin, adminSignUp } from "../controller/admin";


const router = express.Router();

router.post("/signup", adminSignUp);
router.post("/login", adminLogin);

export default router;