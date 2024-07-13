
import mongoose, { Schema } from "mongoose";

const userschema=new Schema({
    firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      recoveryEmail: {
        type: String,
        required:true
  
      },
      DOB: {
        type: Date,
        required: true
      },
      mobileNumber: {
        type: String,
        required: true,
        unique: true
      },
      role: {
        type: String,
        enum: ['User', 'Company_HR'],
        required: true
      },
      status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
      },
      emailverfication:{
        type:Boolean,
        default:false
      },
      otp:{
        type:String,
        
      }
},
{timestamps:true})


export default mongoose.models.User || mongoose.model('User',userschema)
