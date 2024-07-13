import mongoose, { Schema } from "mongoose";

const jobschema=new Schema({
        jobTitle:{type:String,
             required:true
            },
        jobLocation:{
            type:String,
            enum:['onsite','hybrid','remotely'],
            required:true
        },
        jobDescription:{
            type:String,
            required:true
        },
        workingTime:{
            type:String,
            enum:['part-time','full-time'],
            required:true
        },
        seniorityLevel:{
            type:String,
            enum:['Junior','Mid-level','Senior','Team-lead','CTO'],
            required:true
        },
        technicalSkills:{
            type:[String],
            required:true
        },
        softSkills:{
            type:[String]
        },
        addedBy:{
            type:mongoose.Types.ObjectId,
            ref:'User',
            required:true
        },
        companyid:{
            type:mongoose.Types.ObjectId,
            ref:'Company',
            required:true

        }
        
          


},
{timestamps:true})


export default mongoose.models.Job || mongoose.model('Job',jobschema)