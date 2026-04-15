import { create, findOne } from "../../db/dbService.js";
import { providers, UserModel } from "../../db/models/user.model.js";
import { encrypt } from "../../utils/Encryption/encription.utils.js";
import { compare, hash } from "../../utils/Hashing/hash.utils.js";
import { successResponse } from "../../utils/multer/successResponse.utils.js";
import { getNewLoginCredentials, logoutEnum, } from "../../utils/Token/token.utils.js";
import { OAuth2Client } from"google-auth-library";
import * as dbService from "../../db/dbService.js"
import { emailEvent } from "../../utils/Event/events.utils.js";
import { customAlphabet } from "nanoid"; 
import TokenModel from "../../db/models/token.model.js";

export const signup = async (req, res, next) => { 
  const { fullname, password, email, gender, phone , role } = req.body;

  if (await findOne({ model: UserModel, filter: { email } })) 
    return next(new Error("a", { cause: 409 }));

  const hashedPassword = await hash({plainText: password});
  const encryptionPhone = encrypt(phone);

  // Generate OTP
  const otp = customAlphabet("0123456789", 6)();
  const hashOtp = await hash({plainText:otp});
  const otp_expired_at = new Date(Date.now()+2 * 60 * 1000);
  emailEvent.emit("confirmEmail",{to:email , otp , fullname });

  const user = await create({
    model: UserModel,
    data:[{
      fullname,
      password:hashedPassword, 
      email,
      gender,
      phone:encryptionPhone,
      role,
      confirm_email_otp : hashOtp,
      otp_expired_at
    }],
  });
  user.field_attempts = 0;
  user.lock_until = null;

  return successResponse({
    res,
    statusCode: 201,
    message: "User Created Successfuly",
    data: user ,
  });
};

export const login = async (req, res, next) => { 

  const { password, email } = req.body;

  const user = await findOne({ model: UserModel, filter: { email }});

  if (!user) {
    return next(new Error("Invalied email or password", { cause: 401 }));
  }

  if (user.confirm_email !== true) {
    return next(new Error("Email is not confirmed yet", { cause: 403 }));
  }    
  // Compore the hash password
  const isMatch = await compare({ 
    plainText: password, 
    hash: user.password 
  });

  if (!isMatch) {
    return next(new Error("Invalid email or password", { cause: 401 }));
  }
  

  const newCredentials = await getNewLoginCredentials(user)

  // emailEvent.emit("LoginSuccessfuly", {
  //   to: user.email,
  //   fullname: user.fullname
  // });

  return successResponse({  
    res,
    statusCode: 201,
    message: "Login successfully",
    data: {newCredentials},
  });
};

export const logout = async (req, res, next) => {
  const { flag } = req.body;
  let status = 200;

  switch (flag) {
    case logoutEnum.allDevices:
      await dbService.updateOne({
        model: UserModel,
        filter: { _id: req.user._id },
        data: {
          changeCredentialsTime: Date.now()
        }
      });
      break;

    default:
      await dbService.create({
        model: TokenModel,
        data: {
          jti: req.decoded.jti,
          userId: req.user._id,
          expireIn: Date.now() - req.decoded.exp
        }
      });
      status = 201;
      break;
  }

  return successResponse({
    res,
    statusCode: status,
    message: "Logout successfully",
  });
};

export const confirmEmail = async (req,res,next)=>{
  const { email , otp } = req.body;

  const user = await dbService.findOne({
    model: UserModel,
    filter:{
      email,
      confirm_email: false,
      confirm_email_otp: { $exists: true }
    }
  }); 

  if(!user){
    return next(new Error("User Not Found Or Email Already Confirmed",{ cause:401 }));
  }

  if(user.lock_until && user.lock_until > Date.now()){
    return next(new Error("Account is locked. Please try again later",{ cause:403 }));
  }

  if(!user.confirm_email_otp || user.otp_expired_at < Date.now()){
    return next(new Error("OTP has expired. Please request a new one.",{ cause:400 }));
  }
  if(user.field_attempts >= 5){
    await dbService.updateOne({
      model: UserModel,
      filter:{ email },
      data:{
        lock_until: new Date(Date.now() + 15 * 60 * 1000), // Lock for 15 minutes
        field_attempts:0
      }
    });
    return next(new Error("Too many invalid attempts. Account is locked for 15 minutes.",{ cause:403 }));
  }

  await dbService.updateOne({
    model: UserModel,
    filter:{ email },
    data:{
      $inc:{ field_attempts: 1 }
    }
  });

  const isMatch = await compare({
    plainText: otp,
    hash: user.confirm_email_otp
  });

  if(!isMatch){
    return next(new Error("Invalid OTP",{ cause:400 }));
  }

  await dbService.updateOne({
    model: UserModel,
    filter:{ email },
    data:{
      confirm_email: true,
      $unset:{ confirm_email_otp: true , otp_expired_at: 0 , field_attempts: 0 , lock_until: 0  },
      $inc:{ __v:1 }
    }
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Email confirmed successfully" 
  });
};

async function verfiyGoogleAccount({ idToken }) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;

  const { email, email_verified, picture, given_name, family_name } =
    await verfiyGoogleAccount({ idToken });

  if (!email_verified) {
    return next(new Error("Email is Not Verfied", { cause: 401 }));
  }

  const user = await dbService.findOne({
    model: UserModel,
    filter: { email },
  });

  if (user) {
    if (user.provider === providerEnum.google) {
      const access_token = generateToken({
        payload: { _id: user._id },
        options: {
          issuer: "SarahaApp",
          subject: "Authentication",
        },
      });

      const refresh_token = generateToken({
        payload: { _id: user._id },
        options: {
          issuer: "SarahaApp",
          subject: "Authentication",
        },
      });

      return successResponse({
        res,
        statusCode: 200,
        message: "Login Successfully",
        data: { access_token, refresh_token },
      });
    }
  }

  const newUser = await dbService.create({
    model: UserModel,
    data: [
      {
        email,
        fullname: `${given_name} ${family_name}`,
        photo: picture,
        provider: providerEnum.google,
        confirm_email: Date.now(),
      },
    ],
  });

  const access_token = generateToken({
    payload: { _id: newUser._id },
    options: {
      issuer: "SarahaApp",
      subject: "Authentication",
    },
  });

  const refresh_token = generateToken({
    payload: { _id: newUser._id },
    options: {
      issuer: "SarahaApp",
      subject: "Authentication",
    },
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "User Created Successfully",
    data: { access_token, refresh_token },
  });
};

export const refreshToken = async(req,res,next)=>{
  const user = req.user;

  const newCredentials = await getNewLoginCredentials(user)

  return successResponse({  
    res,
    statusCode: 201,
    message: "New Credentials Created Successfully",
    data: {newCredentials},
  });
};

export const forgetPassword = async(req,res,next)=>{
  const { email } = req.body;
  const otp = await customAlphabet("0123456789", 6)();
  const hashOtp = await hash({plainText:otp})
  const otp_expired_at = new Date(Date.now()+2 * 60 * 1000);

  const user = await dbService.findOneAndUpdate({
    model:UserModel,
    filter:{ 
      email,
      provider: providers.system,
      confirm_email:{$exists:true},
      freezed_at:null
    },
    data:{forget_password_otp:hashOtp,otp_expired_at}
  });
  if(!user){
    return next (new Error("User Not Found",{ cause:404 }));
  }
  emailEvent.emit("forgetPassword",{to:email , otp , fullname:user.fullname });

  return successResponse({
    res,
    statusCode:200,
    message:"OTP sent to your email successfully"
  })

};

export const resetPassword = async(req,res,next)=>{
  const { email , otp , password}  = req.body;

  const user = await dbService.findOne({
    model: UserModel,
    filter:{
      email,
      provider: providers.system,
      confirm_email:{$exists:true},
      freezed_at:null,
      forget_password_otp: { $exists: true }
    }
  });
  if(!user){
    return next(new Error("User Not Found",{ cause:404 }));
  }

  if(!await compare({ plainText: otp , hash: user.forget_password_otp })){
    return next (new Error("Invalid OTP",{ cause:400 }));
  }

  if(user.otp_expired_at < Date.now()){
    return next (new Error("OTP has expired. Please request a new one.",{ cause:400 }));
  }

  const hashedPassword = await hash({plainText: password});

  await dbService.updateOne({
    model: UserModel,
    filter:{ email },
    data:{
      password:hashedPassword,
      $unset:{ forget_password_otp: "" , otp_expired_at: "" },
      inc:{ __v:1 }
    }
  });

  return successResponse({
    res,
    statusCode:200,
    message:"Password Reset Successfully"
  });
};