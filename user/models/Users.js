const mongoose= require('mongoose');
const argon2=require('argon2');


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
},{timestamps:true});

async function hashPassword(next) {
    if (this.isModified('password')) {
        try {
            this.password = await argon2.hash(this.password); //The this keyword in hashPassword refers to the Mongoose document
        } catch (error) {
            return next(error);
        }
    }
    next();
}

userSchema.pre('save', hashPassword);

userSchema.methods.comparePassword=async function(userPassword){
    try{
        return await argon2.verify(this.password,userPassword)
    }catch(err){
        throw err;
    }
}

userSchema.index({username:'text'});

const User= mongoose.model('User',userSchema);
module.exports= User;




