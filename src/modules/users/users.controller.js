import { Router } from "express";
import { deleteUser, getUser, login, signUP, updateUserData } from "./users.service.js";


const router = Router();


router.post("/signup", signUP );
router.post("/login", login );
router.put("/update/:id", updateUserData );
router.delete("/delete/:id", deleteUser );
router.get("/user/:id", getUser );


export default router;