import express from "express";
import { adminLogin, createAdmin, createGround, deleteGround, fetchGroundById, getAllGrounds, getBookings, updateGround } from "../controllers/adminController.js";
import { authenticateJWT } from "../utils/jwtAuth.js";
// import { uploadImages } from "../utils/handleImgUpload.js";


const router = express.Router();

router.post('/signup', createAdmin);
router.post('/login', adminLogin);
router.post('/create-ground', authenticateJWT, createGround);
router.put('/update-ground/:id', authenticateJWT, updateGround);
router.get('/fetch-grounds', authenticateJWT, getAllGrounds);
router.get('/fetch-ground/:id', authenticateJWT, fetchGroundById);
router.delete('/delete-ground/:id', authenticateJWT, deleteGround);
router.get('/bookings', authenticateJWT, getBookings);

export default router;