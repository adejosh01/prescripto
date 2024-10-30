import {v2 as cloudinary } from 'cloudinary'

const connectCloundinary = async () => {
    cloudinary.config({
        cloud_name: 'dljz8lgh7',
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    })
}

export default connectCloundinary