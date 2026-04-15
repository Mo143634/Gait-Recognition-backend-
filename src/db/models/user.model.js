import mongoose, { Schema } from "mongoose";

export const genderEnum = {
    male:"male",
    female:"female" 
};
export const providers = {
    system:"SYSTEM",
    google:"GOOGLE" ,
};
export const roles = {
    user:"USER",
    admin:"ADMIN" ,
    researcher:"RESEARCHER",
    securityOfficer:"SECURITY_OFFICER"
};
export const userSchema =new Schema({
    first_name:{
        type: String,
        required: true,
        trim: true,
        minLength: [3,"First name must be at least 3 characters"],
        maxLength:[20,"First name must be at most 20 characters"]
    },
    last_name:{
        type: String,
        required: true,
        trim: true,
        minLength: [3,"Last name must be at least 3 characters"],
        maxLength:[20,"Last name must be at most 20 characters"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password:{
        type: String,
        required: function(){
            return this.provider === providers.system ? true : false;
        }
    },
    gender:{
        type: String,
        enum:{
            values : Object.values(genderEnum),
            message:"Gender must be male or female"
        }
    },
    phone:{
        type: String
    },
    
    confirm_email_otp: String,

    forget_password_otp: String,

    otp_expired_at:{ type: Date , default: Date.now() },

    field_attempts: { type: Number, default: 0 },

    lock_until: { type: Date , default: null },

    confirm_email: { type: Boolean, default: false },

    changeCredentialsTime: {type: Date}, 

    profile_Image: String,

    cover_Images: [String],

    profile_cloud_Image:{public_id:String , secure_url:String},

    cover_cloud_Images:[{public_id:String , secure_url:String}],


    provider:{
        type:String,
        enum:Object.values(providers),
        message:"Provider must be either System or Google",
        default: providers.system
    },
    role:{
        type:String,
        enum:{
            values:Object.values(roles),
            message:"Role must be either user or admin",
        },
        default:roles.user,  
    },
    freezed_at: { type: Date, default: null },
    freezed_by:{type:mongoose.Schema.Types.ObjectId , ref:"User"},

    restored_at: { type: Date, default: null },
    restored_by:{type:mongoose.Schema.Types.ObjectId , ref:"User"},

    gaitProfiles:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "GaitProfile"
    }],

    analysisHistory:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "GaitAnalysis"
    }]

},
    {timestamps:true , toJSON:{virtuals:true} , toObject:{virtuals:true}}
); 
export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);