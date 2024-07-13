
import { generalRules } from "../../utils/general-rules.js";
import Joi from "joi";
import { updateuser } from "./user.controller.js";
export const userschema={
  signupschema:{
    body:Joi.object({
        firstName:Joi.string().required(),
        lastName:Joi.string().required(),
        password:Joi.string().min(5).max(20),
        recoveryEmail: Joi.string().email().required(),
        DOB:Joi.string().required(),
        cpass:Joi.string().required().valid(Joi.ref('password')),
        mobileNumber:Joi.string().length(11),
        role:Joi.string().valid('User','Company_HR'),
        email:Joi.string().email({tlds:{allow:["com","net","org"]}}).required()

    })
},

loginschema:{
  body:Joi.object({
     emailOrMobile:Joi.alternatives().try(Joi.string().email({tlds:{allow:['com','org','net']}}),Joi.string().length(11)).required(),
      password:Joi.string().min(5).max(20),
  })
},
updateschema:{
  body:Joi.object({
    firstName:Joi.string(),
    lastName:Joi.string(),
  
    recoveryEmail: Joi.string().email(),
    DOB:Joi.string(),
    
    mobileNumber:Joi.string().length(11),
    
    email:Joi.string().email({tlds:{allow:["com","net","org"]}})

  })

},

deleteuser:{
  headers:generalRules.headers,

},
getuser:{
  headers:generalRules.headers
},

sp_user:{
  params: Joi.object({
    userid: generalRules.objectId,
  })

},
update_pass:{
   headers:generalRules.headers,
   body:Joi.object({
    password:Joi.string().min(5).max(20),
   })
} ,
forget_pass:{
  
  body:Joi.object({
      email:Joi.string().email({tlds:{allow:["com","net","org"]}}).required(),
  })
},
reset_pass:{
  
  body:Joi.object({
      newpassword:Joi.string().min(5).max(20).required(),
      otp:Joi.string().required()
  })
},

recovery_email:{
      params:Joi.object({
        recoveryEmail:Joi.string().email()
      })
}
 
}

 


