const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services');

function validateBodyData(req, res, next) {
  if (!req.body.name) {
    ErrorResponse.message = "Something went wrong authenticating user";
    ErrorResponse.error = new AppError(
      ['name not found in the incoming request'],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  if (!req.body.phNumber) {
    ErrorResponse.message = "Something went wrong authenticating user";
    ErrorResponse.error = new AppError(
      ['phNumber not found in the incoming request'],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  next();
}

function validateAuthRequest(req, res, next) {
  if (!req.body.email) {
    ErrorResponse.message = "Something went wrong authenticating user";
    ErrorResponse.error = new AppError(
      ['Email not found in the incoming request'],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  if (!req.body.password) {
    ErrorResponse.message = "Something went wrong authenticating user";
    ErrorResponse.error = new AppError(
      ['password not found in the incoming request'],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  next();
}

async function checkAuth(req, res, next) {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      ErrorResponse.message = "Authentication failed";
      ErrorResponse.error = new AppError(
        ['Missing JWT token'],
        StatusCodes.UNAUTHORIZED
      );
      return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
    }

    const response = await UserService.isAuthenticated(token);

    if (response) {
     // console.log("mid", response);
      req.user = response; // ✅ attach user info here
      return next();
    }
  } catch (error) {
    ErrorResponse.message = "Authentication failed";
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

async function isAdmin(req, res, next) {
  try {
    const response = await UserService.isAdmin(req.user.id); // ✅ pass only user.id
    if (!response) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'User not authorized for this action' });
    }
    next();
  } catch (error) {
    ErrorResponse.message = "Authorization failed";
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
}

module.exports = {
  validateAuthRequest,
  checkAuth,
  isAdmin,
  validateBodyData
};
