import express from "express";
import { register, login, getMovie, logout } from "../controller/controller.js";
import refreshToken from "../controller/refreshToken.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("halo dari server");
});
router.post("/movie", verifyToken, getMovie);
router.post("/register", register);
router.post("/login", login);
router.get("/token", refreshToken);
router.delete("/logout", logout);

export default router;
