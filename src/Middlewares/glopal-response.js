
export const glopalresponse=(err,req,res,next)=>{

    if(err)
    {
        res.status(err['cause']||400).json({
            message:'catch error',
            err_msg:err.message
        })
        next()
    }

}