import Joi from "joi";
import { generalRules } from "../../utils/general-rules.js";

export const addjob_schema={
    body:Joi.object({
        jobTitle: Joi.string().required(),
        jobLocation: Joi.string().valid('onsite', 'hybrid', 'remotely').required(),
        jobDescription: Joi.string().required(),
        workingTime: Joi.string().valid('part-time', 'full-time').required(),
        seniorityLevel: Joi.string().valid('Junior', 'Mid-level', 'Senior', 'Team-lead', 'CTO').required(),
        technicalSkills: Joi.array().items(Joi.string()).required(),
        softSkills: Joi.array().items(Joi.string()).optional(),
        companyid:generalRules.objectId.required()
       

    })
}

export const updatejob={
    body:Joi.object({
        jobTitle: Joi.string(),
        jobLocation: Joi.string().valid('onsite', 'hybrid', 'remotely'),
        jobDescription: Joi.string(),
        workingTime: Joi.string().valid('part-time', 'full-time'),
        seniorityLevel: Joi.string().valid('Junior', 'Mid-level', 'Senior', 'Team-lead', 'CTO'),
        technicalSkills: Joi.array().items(Joi.string()),
        softSkills: Joi.array().items(Joi.string()).optional(),
        companyid:generalRules.objectId

    })
}

export const filter_jobs={
    body:Joi.object({
        jobLocation: Joi.string().valid('onsite', 'hybrid', 'remotely'),
        seniorityLevel: Joi.string().valid('Junior', 'Mid-level', 'Senior', 'Team-lead', 'CTO'),
        jobTitle: Joi.string(),
        technicalSkills: Joi.array().items(Joi.string()),
        workingTime: Joi.string().valid('part-time', 'full-time'),

    })
}

export const jobs_sp_companyschema={
     query:Joi.object({

        companyName:Joi.string().required()
     })
}


export const applicationschema={
    body:Joi.object({
        jobId:generalRules.objectId,
        userTechSkills: Joi.array().items(Joi.string()).required(),
        userSoftSkills: Joi.array().items(Joi.string()).required(),
    })

    
}