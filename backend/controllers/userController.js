import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js'
import doctorModel from '../models/doctorModel.js'
import razorpay from 'razorpay'



// API to register user

const registerUser = async (req,res) => {
    try {
        const {name, email, password} = req.body

        if (!name || !password || !email) {
            return res.json({success: false, message:"Missing Details"})
        }

        if (!validator.isEmail(email)) {
            return res.json({success: false, message:"enter a valid email"})
        }

        if (password.lenth < 8) {
            return res.json({success: false, message:"enter a strong password"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password:hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

        res.json({success:true, token})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


//API for user login
const loginUser = async (req,res) => { 
    try {
        const {email, password} = req.body
        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({success:false, message:'User does not exist'})  
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true,token})
        } else{
            res.json({success:false, message:"Invalid credientials"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})  
    }
}

//API to get user profile data
const getProfile = async (req,res) => {
    try {
        const {userId} = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true, userData})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})   
    }
}

//API to update user profile
const updateProfile = async (req,res) => {
    try {
        const  {userId, name, email, phone, address, dob, gender} = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            res.json({success:true, message: 'Data missing'}) 
        }

        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

        if(imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:'image'})
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageUrl})
        }

        res.json({success:true, message:"Profile Updated" })

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})   
    }
}

// API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor not available' });
        }

        // Initialize slots_booked if it doesn't exist
        let slots_booked = docData.slots_booked || {};

        // Check for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        const userData = await userModel.findById(userId).select('-password');

        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Save updated slots_booked in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment Booked' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// API to get user appointment for my appointment page
const listAppointment = async(req,res) => {
    try {
        const {userId} = req.body
        const appointments = await appointmentModel.find({userId})

        res.json({success:true, appointments})
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})   
        
    }
}

//API to cancel appointment
const cancelAppointment = async(req, res) => {
    try {
        const {userId, appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({success:false, message: "Unauthorized action"})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})

        //releasing doctor list

        // const {docId, slotDate, slotTime} = appointmentData
        // const doctorData = await doctorModel.findById(docId)

        // let slots_booked = doctorData.slots_booked

        // slots_booked[slotDate] = slot_booked[slotDate].filter(e => e !== slotTime)

        // await doctorModel.findByIdAndUpdate(docId, {slot_booked})

        res.json({success: true, message: 'Appointment Cancelled' })
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})   
        
    }
}

// API to make payment of appointment using paystack

// Paystack Secret Key
const PAYSTACK_SECRET_KEY = 'sk_test_a4387644be6f7879618d327fd1ec1c7695bf2fe0';

const Payment = async (req, res) => {
    const { reference } = req.body;

    if (!reference) {
        return res.status(400).json({ success: false, message: "Payment reference is required" });
    }

    try {
         // Make a request to Paystack to verify the transaction
         const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        });

        const data = response.data;

        if (data.status && data.data.status === "success") {
            // Payment was successful
            return res.status(200).json({ success: true, message: "Payment verified", data: data.data });
        } else {
            // Payment failed or was not successful
            return res.status(400).json({ success: false, message: "Payment verification failed", data: data.data });
        }
            
    } catch (error) {
        
        console.error("Error verifying payment:", error);
            return res.status(500).json({ success: false, message: "An error occurred while verifying payment" });
    }
}


export {registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, Payment}