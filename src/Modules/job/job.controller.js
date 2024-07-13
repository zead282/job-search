import Job from '../../../DB/models/Job.js'
import Application from '../../../DB/models/Application.js'

import Company from '../../../DB/models/Company.js';
import User from '../../../DB/models/User.js';
import cloudinaryConnection from '../../utils/cloudinary.js';
import { search } from '../../utils/search.jobs.js';
/**
 * 
 * @param {object} req 
 * @param {*object} res 
 * @param {*object} next
 * @returns {object} return response {new job}
 * @description add new job
 */

export const addjob=async(req,res,next)=>{
   
    ///destructing data
    const{_id}=req.authUser;

    const{jobTitle,
        jobLocation,
        jobDescription,
        workingTime,
        seniorityLevel,
        technicalSkills,
        softSkills,
        companyid
        }=req.body

        const hr = await User.findById(_id);
        if (!hr) {
            return res.status(404).json({ message: "user not found" });
        }    

        ///prepare job object

        const newJob = new Job({
            jobTitle,
            jobLocation,
            jobDescription,
            workingTime,
            seniorityLevel,
            technicalSkills,
            softSkills,
            addedBy:_id,
            companyid
        });

        const savedJob = await newJob.save();

        res.status(201).json({
            message: "Job created successfully",
            data: savedJob
        });

}


/**
 * 
 * @param {object} req 
 * @param {*object} res 
 * @param {*object} next
 * @returns {object} return response {updated job}
 * @description update job
 */

export const updatejob=async(req,res,next)=>{

    //destruct
   

    const{jobid}=req.params

    const{jobTitle,
        jobLocation,
        jobDescription,
        workingTime,
        seniorityLevel,
        technicalSkills,
        softSkills,companyid}=req.body
    
    ///find job and update
    
    const findandupdate=await Job.findByIdAndUpdate({_id:jobid},req.body,{new:true})

    if(!findandupdate) return next(new Error("somthing that happen"))

    res.status(200).json({
        message:"updated successfully",
        data:findandupdate
    })    
}


/**
 * 
 * @param {object} req 
 * @param {*object} res 
 * @param {*object} next
 * @returns {object} return response {message}
 * @description delete job
 */

export const deletejob=async(req,res,next)=>{

    const{jobId}=req.params
    const{_id}=req.authUser
    ///find job

    const findjob=await Job.findOneAndDelete({_id:jobId,addedBy:_id});
    if(!findjob) return next(new Error("job not found",{cause:400}))

    ///find applications for this job and delete
    
    const applications = await Application.find({ jobId });
    if (applications.length > 0) {
      // Extract user IDs from applications
      const userIds = applications.map(app => app.userId);

      // Delete applications from the database
      await Application.deleteMany({ jobId });

      // Delete  files from Cloudinary
      for (const userId of userIds) {
        const folder = `${process.env.MAIN_FOLDER}/cv/${userId}`;
        await cloudinaryConnection().api.delete_resources_by_prefix(folder);
        await cloudinaryConnection().api.delete_folder(folder);
      }
    }


     res.status(200).json({message:"job deleted and related applications"})   
}


/**
 * 
 * @param {object} req 
 * @param {*object} res 
 * @param {*object} next
 * @returns {object} return response {message,application}
 * @description apply to job
 */

export const apply_job=async(req,res,next)=>{
    ///destruct data
    const{_id}=req.authUser;
    const{jobId, userTechSkills, userSoftSkills }=req.body
    
    
    ///check on user
    const userr=await User.findById(_id)
    if(!userr) return next(new Error("user not found",{cause:400}))
    ///check on job availabilit

    const jobisexist=await Job.findById(jobId)
    if(!jobisexist) return next(new Error("job not found",{cause:400}))
    
    if(!req.file) return next({ message: 'cv is required' })   
    
    

    const{secure_url,public_id}=await cloudinaryConnection().uploader.upload(req.file.path,{
        folder:`${process.env.MAIN_FOLDER}/cv/${_id}`
    })

    const appobject={userResume:{public_id,secure_url},jobId,userSoftSkills,userTechSkills,userId:_id}

    const addapp=await Application.create(appobject);

    res.status(200).json({message:"application created success",data:addapp})


}

/**
 * 
 * @param {object} req 
 * @param {*object} res 
 * @param {*object} next
 * @returns {object} return response {jobs}
 * @description get jobs for specific company
 */

export const get_jobs_for_sp_company=async(req,res,next)=>{

    //destruct data
    const{companyName}=req.query;

    //find company
    const company=await Company.findOne({companyName})

    if(!company) return next(new Error("company by this name not found",{cause:404}))
    
   
    ///find jobs
    const findjobs=await Job.findOne({companyid:company._id})

    if(!findjobs) return next(new Error("job not found",{cause:400}))

     res.status(200).json({
        jobs:findjobs
     })   


}

/**
 * 
 * @param {object} req 
 * @param {*object} res 
 * @param {*object} next
 * @returns {object} return response {jobs}
 * @description Get all Jobs with their company’s information.
 */

export const get_jobs_with_their_companys=async(req,res,next)=>{
    
    const find=await Job.find().populate({path:'companyid'})

    return res.status(200).json({data:find})

}


/**
 * 
 * @param {object} req 
 * @param {*object} res 
 * @param {*object} next
 * @returns {object} return response {filter jobs}
 * @description allow user to filter with workingTime , jobLocation , seniorityLevel and jobTitle,technicalSkills
 */

export const filter_jobs=async(req,res,next)=>{
    const{...filters}=req.query

    const searchfilter=search(filters)

    const findjobs=await Job.find(searchfilter)

    return res.status(200).json({
        jobs:findjobs
    })
}
