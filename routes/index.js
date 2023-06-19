import express from "express";
import createUser from "../controllers/auth/createUser";
import generatetoken from "../controllers/auth/token";
import getAllPlayers from "../controllers/users";
import verifytoken from "../middlewares/accessVerify";
import { recovermatch } from "../controllers/recoverMatch";
import UserModel from "../database/models/User";
import logout from "../controllers/auth/logout";

const router = express.Router();

router.post("/user", createUser);
router.get("/token", generatetoken);
router.get("/users", getAllPlayers);
router.get("/recoverMatch", verifytoken, recovermatch);
router.get("/logout", verifytoken, logout);

export default router;
