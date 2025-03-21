const Joi = require('joi');

const validateRegsiterationData= (data)=>{
    const schema=Joi.object({
        username:Joi.string().min(3).max(50).required(),
        email:Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })

    return schema.validate(data);
}


const validateloginData = (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
  
    return schema.validate(data);
};



module.exports={validateRegsiterationData,validateloginData};