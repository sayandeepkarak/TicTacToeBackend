import express from "express";
import createUser from "../controllers/auth/createUser";
import generatetoken from "../controllers/auth/token";
import getAllPlayers from "../controllers/users";
import verifytoken from "../middlewares/accessVerify";
import { recovermatch } from "../controllers/recoverMatch";

const router = express.Router();

router.post("/user", createUser);
router.get("/token", generatetoken);
router.get("/users", getAllPlayers);
router.get("/recoverMatch", verifytoken, recovermatch);

export default router;
