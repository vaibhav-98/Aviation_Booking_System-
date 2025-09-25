const { StatusCodes } = require("http-status-codes");
const AppError = require('../utils/errors/app-error')

const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");


/**
 * POST : /Singup
 * req-body {email: "abc@abstract.com", password: "12546"}
 */

async function singup(req,res) {
     //console.log(req.body);
     
    try {
        const user = await UserService.create({
           email: req.body.email,
           password: req.body.password,
           name: req.body.name,         // new
           phNumber: req.body.phNumber  // new
        })
      //  console.log("user >", user);
        
        SuccessResponse.data = user
        return res 
                  .status(StatusCodes.CREATED)
                  .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res 
                  .status(error.statusCode)
                  .json(ErrorResponse)
    }
}



async function singin(req,res) {
 
    try {
        const user = await UserService.singIn({
            email:req.body.email,
            password: req.body.password
        })
        
        SuccessResponse.data = user
        return res 
                  .status(StatusCodes.CREATED)
                  .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res 
                  .status(error.statusCode)
                  .json(ErrorResponse)
    }
}



async function addRoleToUser(req,res) {
        console.log(req.body);
        
    try {
        const user = await UserService.addRoleToUser({
            role:req.body.role,
           id: req.body.id
        })
        
        SuccessResponse.data = user
        return res 
                  .status(StatusCodes.CREATED)
                  .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error = error;
        return res 
                  .status(error.statusCode)
                  .json(ErrorResponse)
    }
}



async function getUserById(req, res) {
  try {
    const user = await UserService.getUserById(req.params.id);
    SuccessResponse.data = user;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}


module.exports = {
    singup,
    singin,
    addRoleToUser,
    getUserById
}
