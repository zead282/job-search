import mongoose from "mongoose";

export const DB_Connection=async()=>{

    await mongoose.connect(process.env.DB_URL)
    .then((res)=>{console.log("db connected success")})
    .catch((err)=>console.log("bd connection error",err))

}