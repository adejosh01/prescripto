import express from 'express'
import multer from 'multer';
import { addDoctor, allDoctors, loginAdmin } from '../controllers/adminController.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailabity } from '../controllers/doctorController.js';


const adminRouter = express.Router()

// Configure multer for single file upload with the expected field name 'image'
const upload = multer({ dest: 'uploads/' }).single('image'); // Use the correct field name, e.g., 'image'

adminRouter.post('/add-doctor', authAdmin, upload, addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailabity)



export default adminRouter