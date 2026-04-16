import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

export const fileValidation = {
    image: ["image/png","image/jpeg","image/jpg"],
    videos:["video/mp4" , "video/mpeg" , "video/avi"],
    audios:["audio/mpeg","audio/mp3","audio/wav"],
    documents:[
        "application/pdf" ,
        "application/msword" ,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
}
export const localFileUpload = ({customPath = "general" , validation = []}={})=>{
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = process.env.UPLOAD_PATH || 'uploads'
            const fullPath = path.resolve(uploadDir, customPath, req.user?._id || 'general')

            if(!fs.existsSync(fullPath)) fs.mkdirSync(fullPath , {recursive:true})
            cb(null , fullPath)
        },
        filename:(req,file,cb)=>{    
            const uniqueFileName = Date.now() + "__" + Math.random() + "__" + file.originalname
            const uploadDir = process.env.UPLOAD_PATH || 'uploads'
            file.finalPath = `${uploadDir}/${customPath}/${req.user?._id || 'general'}/${uniqueFileName}`
            cb(null,uniqueFileName)
        }
    });
    const fileFilter = (req , file , cb)=>{
        if(validation.includes(file.mimetype)){
            cb(null,true);
        }else{
            return cb(new Error("Invalid File Type"),false)
        }
    }
    return multer({
        fileFilter,
        storage,
    })
};