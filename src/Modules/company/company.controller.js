import Job from '../../../DB/models/Job.js'
import Company from '../../../DB/models/Company.js'
import Application from '../../../DB/models/Application.js'
/**
 * 
 * @param {object} req 
 * @param {*object} res 
 * @param {*object} next
 * @returns {object} return response { message,company }
 * @description add company
 */

export const addcompany=async(req,res,next)=>{
    ///destruct data
    const{_id}=req.authUser

    const{companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        }=req.body
      
    ///check on company email
    
    const comapnyemail=await Company.findOne({companyEmail})
    if(comapnyemail) return next(new Error("email already exist",{cause:400}))

    const obj={
        companyEmail,companyHR:_id,numberOfEmployees,address,industry,description,companyName
    }    

    const newcompany=await Company.create(obj)

    if(!newcompany) return next(new Error("somthing wrong",{cause:300}))
     
    res.status(200).json({
        message:"company created",
        date:newcompany
    })    
}

/**
 * 
 * @param {object} req 
 * @param {*object} res 
 * @param {*object} next
 * @returns {object} return response { message,company }
 * @description update company
 */

export const update_company=async(req,res,next)=>{

    const{_id}=req.authUser;
    const{companyid}=req.params
    const{
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
    }=req.body

    //check on availability of comapny

    const updatecompany=await Company.findOneAndUpdate({_id:companyid,
        companyHR:_id},req.body,{new:true})
   
    if(!updatecompany) return next(new Error("company not found",{cause:400}))
     

    res.status(200).json({
        message:"company updated",
        data:updatecompany
    })
    
        
    
}


/**
 * 
 * @param {object} req 
 * @param {*object} res 
 * @param {*object} next
 * @returns {object} return response { message}
 * @description delete company data
 */

export const deletecompany=async(req,res,next)=>{

    const{companyid}=req.params
  ////find company and delete
    const findcompany=await Company.findByIdAndDelete(companyid)

    if(!findcompany) return next(new Error("company not found",{cause:404}))

    ///find job company and delete
    
    const job=await Job.deleteMany({companyid:companyid})
    if(!job) return next(new Error("job doesnt deleted"))
    res.status(200).json({
        message:"company deleted"
    })    
}


/**
 * 
 * @param {object} req 
 * @param {*object} res 
 * @param {*object} next
 * @returns {object} return response {company}
 * @description search for company with name
 */

export const search_for_company=async(req,res,next)=>{
    ///destruct data
    const{companyname}=req.query;
    const{_id}=req.authUser;
    
    ///find company
    const search_company=await Company.findOne({companyName:companyname})
    
    if(!search_company)  return res.status(404).json({ message: "Company not found" });

    res.status(200).json({
        message: "Company found",
        data: search_company
    });
}


/**
 * 
 * @param {object} req 
 * @param {*object} res 
 * @param {*object} next
 * @returns {object} return response {company data}
 * @description company data and return all jobs related to this company
 */
export const getCompanyWithJobs = async (req, res, next) => {
   
        const { companyId } = req.params;

        // Find the company by ID
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Find all jobs related to this company
        const jobs = await Job.find({ companyid:companyId });

        res.status(200).json({
            company,
            jobs
        });
   
};
   



/**
 * 
 * @param {object} req 
 * @param {*object} res 
 * @param {*object} next
 * @returns {object} return response {application with their users}
 * @description Get all applications for specific Jobs and users

*/

export const application_for_sp_jobs=async(req,res,next)=>{

    //destruct hr id
    const{_id}=req.authUser;
    
    ///get all jobs of this company hr
    const findjobs=await Job.find({addedBy:_id})

     if(!findjobs) return next(new Error("not have any jobs"))
     
        ///array to contain all jobs id for this specific company
    let jobids=[]
     
    for(const job of findjobs)
    {
        jobids.push(job._id)
    }

    console.log(jobids);

    
    ///find application
    const application=await Application.find({jobId:{$in:jobids}}).populate({path:"userId"})

    if(!application.length) return res.json("you are not have any applications")
    
    res.status(200).json({
        data:application
    })    
}