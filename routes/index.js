import express from "express";
import createUser from "../controllers/auth/createUser";
import generatetoken from "../controllers/auth/token";
import verifytoken from "../middlewares/accessVerify";
import getUserData from "../controllers/userData";
import getAllPlayers from "../controllers/users";

const router = express.Router();

router.post("/user", createUser);
router.get("/user", verifytoken, getUserData);
router.get("/token", generatetoken);
router.get("/users", getAllPlayers);

export default router;
