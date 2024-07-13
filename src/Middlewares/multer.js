import multer from "multer";
import generateuniquestring from "../utils/generate-unique-str.js";


export const multerhost=()=>{

    const storage=multer.diskStorage({
        filename:(req,file,cb)=>{
            const uniquestr=generateuniquestring(4) + '_'+file.originalname
            cb(null,uniquestr)
        }
    })

    const filefilter=(req,file,cb)=>{
        if(file.mimetype =="pdf")
            return cb(null,true)
        cb(new Error('pdf format is not allowed!'), false)

    }

    const file=multer({filefilter,storage})
    return file
}