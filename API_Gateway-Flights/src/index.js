const express = require('express');
const rateLimit = require('express-rate-limit')
const {createProxyMiddleware} = require('http-proxy-middleware')
const cors = require('cors');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();


const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 10, // Limit each IP to 10 requests per 'window' {}
});

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(limiter)

app.use('/api', apiRoutes);

app.use('/flightsService', createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE, 
    changeOrigin: true, 
    pathRewrite:{'^/flightsService' : '/'}}))
app.use('/bookingService', createProxyMiddleware({target: ServerConfig.BOOKING_SERVICE, changeOrigin: true}))



app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});


/**
 * user
 *  |  
 *  v
 * localhost:3001/flightsservice/api/v1/flights (API Gateway) localhost:4000/api/v1/booking
 *  |
 *  v
 * localhost:3000/api/v1/flights
 */