import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job', 
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true
    },
    userTechSkills: {
      type: [String],
      required: true
    },
    userSoftSkills: {
      type: [String],
      required: true
    },
    userResume: {
      secure_url:{type:String,required:true},
      public_id:{type:String,required:true,unique:true}
      
    },
    
},{timestamps:true})

export default mongoose.models.Application || mongoose.model('Application',jobApplicationSchema)