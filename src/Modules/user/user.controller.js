
import { hashSync } from "bcrypt";
import User from "../../../DB/models/User.js";
import sendemailservices from "../../services/send-email.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DateTime } from "luxon";
import { generateOTP } from "../../utils/generate-otp.js";


/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, user }
 * @description create new user
 */
export const signup=async(req,res,next)=>{
    //destruc data
    const{ firstName,
        lastName,
        email,
        password,
        recoveryEmail,
        DOB,
        mobileNumber,
        role,
        }=req.body
     
    ///check on email
    const isemailexist=await User.findOne({email})
    if(isemailexist) return next(Error("email already exist",{cause:400}))
  

    ///email verfications
    const usertoken=jwt.sign({email},process.env.JWT_VERFICATION,{ expiresIn: '3m'})
    const isemailsent=await sendemailservices({
        to:email,
        subject:"click to verfiy email",
        message:`<h1>Please click on the link to verify your email</h1>
        <a href="http://localhost:3000/user/verify-email?token=${usertoken}">>verfication</a>`
        
    })    
    if(!isemailsent) return next(new Error("email sent ,please try later",{cause:500}))
    
    
    const username=firstName+lastName
    
    ///hash password
    const hashedpass=bcrypt.hashSync(password,+process.env.SALT_ROUNDS)    

    const formattedDOB = DateTime.fromFormat(DOB, 'yyyy-MM-dd');

    ////user object 
    const userobj={
        password:hashedpass,
        username,
        lastName,
        firstName,email,role,DOB:formattedDOB,mobileNumber,recoveryEmail
    }
    const newuser=await User.create(userobj)
    
    if(!newuser) return next(new Error('Something went wrong, please try again later', { cause: 500 }));
    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newuser
    })

}
///verfication email
export const verfyemail=async(req,res,next)=>{
    const{token}=req.query;

    const decoded=jwt.verify(token,process.env.JWT_VERFICATION)
    
    const finduser=await User.findOneAndUpdate({email:decoded.email,emailverfication:false},{emailverfication:true},{new:true})
    if(!finduser) return next(new Error("user not found",{cause:404}))
    res.status(200).json({
            success: true,
            message: 'Email verified successfully, please try to login'
        })
}
/** 
 *@param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, token }
 * @description login

*/

export const login=async(req,res,next)=>{

    //destruct data
    const{password,emailOrMobile}=req.body

     ///find
     const isuserexist=await User.findOne({$or:[{email:emailOrMobile},{mobileNumber:emailOrMobile}]})
     if(!isuserexist) return next(Error("user not found",{cause:400}))
        
     
     //check on password
     const ismatched=bcrypt.compareSync(password,isuserexist.password)
     
     if(!ismatched) return next(Error('invalid credintials',{cause:401}))

     //update status
    isuserexist.status="online"

    ///generate token
    const token=jwt.sign({email:isuserexist.email,_id:isuserexist._id,status:isuserexist.status},process.env.JWT_LOGIN_SIGNATURE,{expiresIn:'1d'}) 
    await isuserexist.save()
    res.status(200).json({
        message:"logedin sucess",
        token:token
    })   


}



/** 
 *@param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message, new updated user }
 * @description update user

*/

export const updateuser=async(req,res,next)=>{
    //destructind data
    const{_id}=req.authUser
    const{email , mobileNumber , recoveryEmail , DOB , lastName , firstName}=req.body

    ///check if user loggedin
    
    const userisloggedin=await User.findOne({_id,status:"online"});
    
    if(!userisloggedin) return next(new Error("login first"))
    
    ///date
    const formatdob=DateTime.fromFormat(DOB,'yyyy-MM-dd')   

    ///username
    ///object that have user data
    const updatedate={recoveryEmail,DOB:formatdob,lastName,firstName}    
    
    if(lastName && firstName)
    {
        const username=firstName+lastName
        updatedate.username=username
    }
    
        ///check on email if hw send if he want to update email ,we will send verfication to new email
    if(email){
        const isemailexist=await User.findOne({email})
        if(isemailexist) return next(new Error("email already exist",{cause:400}))
        updatedate.email=email
        updatedate.emailverfication=false

        /////send verfication
        const usertoken=jwt.sign({email},process.env.JWT_VERFICATION,{ expiresIn: '3m'})
        
        const isemailsent=await sendemailservices({
            to:email,
            subject:"click to verfiy email",
            message:`<h1>Please click on the link to verify your email</h1>
            <a href="http://localhost:3000/user/verify-email?token=${usertoken}">>verfication</a>`
            
        })    
        if(!isemailsent) return next(new Error("email sent ,please try later",{cause:500}))

    }
    ////check on mobile  if send
    if(mobileNumber){
        const ismobileexist=await User.findOne({_id,mobileNumber})
        if(ismobileexist) return next(new Error("number already exist",{cause:400}))
        updatedate.mobileNumber=mobileNumber
    }
    
    const updateuser=await User.findByIdAndUpdate(_id,updatedate,{new:true})

    if(!updateuser) return next(new Error('somthing wrong'))
    res.status(200).json({
           message:"updated",
           data:updateuser
     })    
    

}


/** 
 *@param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message }
 * @description delete user
*/

export const deleteuser=async(req,res,next)=>{
    //destruct data
    const{_id}=req.authUser
    
    ///find user by id and check if he online or no
    const deleteuserr=await User.findOneAndDelete({_id,status:"online"});
    if(!deleteuserr) return next(new Error("login first",{cause:401}))
    res.status(200).json({
         message:"deleted successfully"
        })    
}


/** 
 *@param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { user account }
 * @description get user account
*/

export const getuseraccount=async(req,res,next)=>{

    ///destruct data
    const{_id}=req.authUser;

    const finduser=await User.findOne({_id,status:"online"});
    if(!finduser) return next(new Error("user not found",{cause:400}))
    
    res.status(200).json({
        user:finduser
    })    
}



/** 
 *@param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { user account }
 * @description get user account by his id
*/
export const get_another_user=async(req,res,next)=>{

    const{userid}=req.params;

    ///get user
    const getuser=await User.findById(userid)
    if(!getuser) return next(new Error("user not found",{cause:4004}))
    
    res.status(200).json({
        user:getuser
    })    


}


/** 
 *@param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message }
 * @description update password
*/

export const update_password=async(req,res,next)=>{

    ///destruct data
    const{_id}=req.authUser;
    const{password}=req.body;

    const finduser=await User.findById(_id)
    if(!finduser) return next(new Error("user not found"))
    
    const passwordexist=await User.findOne({password})
    if(passwordexist)  return next(new Error("change password"))  
    
    ///hash password
    
    const hashedpass=bcrypt.hashSync(password,+process.env.SALT_ROUNDS)

    const updateduser=await User.findByIdAndUpdate(_id,{password:hashedpass})
    if(!updateduser) return next(new Error("somthing wrong"))
     
     res.status(200).json({
        message:"user password updated succesfully"
     })   
}

/** 
 *@param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message }
 * @description forget password password
*/

export const forget_password=async(req,res,next)=>{
    //destruct email to find user and send otp to him
    const{email}=req.body;

    const finduser=await User.findOne({email})
    if(!finduser) return next(new Error("user not found-email not found",{cause:400}))
    
    const otp=generateOTP()

    const sendemail=await sendemailservices({
        to:email,
        subject:`OTP`,
        message:`<h1>To be safe, to reset the password for this account,
         you will need to confirm your identity by entering the following single-use code </h1>
        <b style="font-size: 50px ; text-align: center">code is  ${otp}  </b>`
    }) 
    if(!sendemail) return next(new Error("email doesnt send"))

    finduser.otp=otp
    await finduser.save()

    res.status(200).json({
        message:"please check you email"
    })


}

/** 
 *@param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message }
 * @description reset password password
*/

export const resetpassword=async(req,res,next)=>{

    const{newpassword,otp}=req.body;

    const finduser=await User.findOne({otp});

    if(!finduser) return next(new Error("user not found",{cause:400}))

    const hashedpass=bcrypt.hashSync(newpassword,+process.env.SALT_ROUNDS)
    
    finduser.password=hashedpass;
    finduser.otp=null
    await finduser.save()

    res.status(200).json({
        message:"password chnage"
    })
}

/** 
 *@param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return response { message,user with specific recovery email }
 * @description Get all accounts associated to a specific recovery Email 
*/

export const all_accounts_with_sp_recovey_email=async(req,res,next)=>{
   
     const{recoveryEmail}=req.params
    ///
    const findaccount=await User.find({recoveryEmail})
    res.status(200).json({accounts:findaccount})


}
