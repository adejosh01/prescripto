import express from 'express'
import {getProfile, loginUser, registerUser, updateProfile, bookAppointment, listAppointment, cancelAppointment, Payment} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import multer from 'multer';


const userRouter = express.Router()

// Configure multer for single file upload with the expected field name 'image'
const upload = multer({ dest: 'uploads/' }).single('image'); // Use the correct field name, e.g., 'image'

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload, authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment', authUser, Payment)


export default userRouter