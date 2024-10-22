const validator= require("validator")

const validateSignUpData =(req)=>{

    const{firstName,lastName, emailId,password}= req.body
    if(!firstName || !lastName){
        throw new Error("Name is valid")
    }else if(firstName.leng<3 || firstName.length>20){
        throw new Error("Name must be at 3-20 characters")

    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Credenshials are wrong")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Credenshials are wrong")
    }

}
module.exports={validateSignUpData}