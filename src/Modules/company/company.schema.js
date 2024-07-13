import Joi from "joi";
import { generalRules } from "../../utils/general-rules.js";

export const addcompany_schema={
     body:Joi.object({
        companyName: Joi.string().required(),
      description: Joi.string().required(),
      industry: Joi.string().required(),
      address: Joi.string().required(),
      numberOfEmployees: Joi.string().pattern(/^\d+-\d+$/).required(),
      companyEmail: Joi.string().email({ tlds: { allow: ["com", "net", "org"] } }).required(),
      
     })
}

export const updatecompany_schema={
    body:Joi.object({
       companyName: Joi.string(),
     description: Joi.string(),
     industry: Joi.string(),
     address: Joi.string(),
     numberOfEmployees: Joi.string().pattern(/^\d+-\d+$/),
     companyEmail: Joi.string().email({ tlds: { allow: ["com", "net", "org"] } }),
     
    })
}    
export const deletecompany_schema={

    params:Joi.object({
        companyid:generalRules.objectId.required()
    
    })

}
export const searchcompanyschema={
    query:Joi.object({
        companyname:Joi.string().required()
    }),
   

}    
    
