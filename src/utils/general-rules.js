import Joi from "joi";
import { Types } from "mongoose";

const objectid=(value,helper)=>{
    const isvalid=Types.ObjectId.isValid(value)
    if(isvalid) return value
    helper.message("invalid objectid")
}

export const generalRules = {
    objectId: Joi.string().custom(objectid),

    headers: {
      "content-type": Joi.string(),
      accept: Joi.string().valid("application/json"),
      "accept-encoding": Joi.string(),
      host: Joi.string(),
      "conetnt-length": Joi.string(),
      "user-agent": Joi.string(),
      "accept-language": Joi.string(),
      "accept-charset": Joi.string(),
      "postman-token": Joi.string(),
      "postman-id": Joi.string(),
      _id: Joi.string().required(),
      email: Joi.string().email().required(),
      role: Joi.string().valid('User','Company_HR').required()
    },
  };
  