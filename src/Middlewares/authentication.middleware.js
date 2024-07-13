
import User from "../../DB/models/User.js";
import jwt from 'jsonwebtoken'


export const authentication=()=>{
    return async(req,res,next)=>{
       
    try{
                ///destruct token
       const{accesstoken}=req.headers;
       //check
       if(!accesstoken) return next(new Error('please login first', { cause: 400 }))
       ///check on secret prefix
       if(!accesstoken.startsWith(process.env.Token_Prefix)) return next(new Error("invalid prefix",{cause: 400 }))
       
       ///split
       const token=accesstoken.split(process.env.Token_Prefix)[1];
       
       const decoded=jwt.verify(token,process.env.JWT_LOGIN_SIGNATURE)

       if(!decoded?._id) return next(Error('invalid token payload'))

       ///check on user
       const user=await User.findById(decoded?._id)

       if(!user) return next(Error("user not found signup first",{cause:404}))

       req.authUser=user 
       next()

    }
    catch(err){
            
            next(new Error('token expired', { cause: 500 }))
    }
        

    }
}

