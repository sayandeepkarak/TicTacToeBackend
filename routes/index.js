import express from "express";
import createUser from "../controllers/auth/createUser";
import generatetoken from "../controllers/auth/token";
import getAllPlayers from "../controllers/users";

const router = express.Router();

router.post("/user", createUser);
router.get("/token", generatetoken);
router.get("/users", getAllPlayers);

export default router;
