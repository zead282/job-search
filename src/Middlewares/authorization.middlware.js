

export const authorization=(accessrole)=>{
    return(req,res,next)=>{
      // Get the loggedIn user from the request authUser from auth middleware
      const user=req.authUser;
      // Check if the allowed roles array includes the user role
      
      if(!accessrole.includes(user.role))
          return next(Error('you are not authorized'))
      next()
 }  
 }