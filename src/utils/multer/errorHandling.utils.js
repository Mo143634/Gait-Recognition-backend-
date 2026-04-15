export const globalErrorHandler = (err,req,res,next)=>{
        const status = err.cause || 500
        return res.status(status).json({
            message:"Somsething went Wrong",
            error:err.message,
            stack:process.env.MOOD==="PROD" ? err.stack:undefined
        });
};