const express = require('express');


const { makePayment } = require('../../controllers');

const { UserController,BookingController } = require('../../controllers');
const { AuthRequestMiddleware } = require('../../middlewares')

const router = express.Router();

router.post ('/singup', AuthRequestMiddleware.validateBodyData,AuthRequestMiddleware.validateAuthRequest ,UserController.singup )

router.post ('/singin', AuthRequestMiddleware.validateAuthRequest ,UserController.singin )

router.get('/:id', UserController.getUserById);

router.post('/role',AuthRequestMiddleware.checkAuth, AuthRequestMiddleware.isAdmin ,UserController.addRoleToUser)

router.post("/bookings", AuthRequestMiddleware.checkAuth, BookingController.createBooking);

router.post('/payments', AuthRequestMiddleware.checkAuth, BookingController.makePayment);
module.exports = router;
