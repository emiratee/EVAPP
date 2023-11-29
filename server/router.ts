import { Router } from "express";
const router = Router();
import userController from './controllers/userController.js';
import tripController from './controllers/tripController.js';

//Trips
router.post('/trip/create', tripController.postCreate);
//router.get('/trip/:id')
router.get('/trips', tripController.getFilteredTrips);

//User account (Setting etc.)
router.post('/user/account/register', userController.postRegister);
router.post('/user/account/login', userController.postLogin);

//User (get certain information about the user directly)
router.get('/user', userController.getUser);
router.put('/user/cars', userController.putCar);
router.get('/user/:driverId', userController.getDriver);

//User trips (add passenger aswell?)
router.put('/user/trips/driver', userController.putTripsAsDriver);
//User (all about credits)
router.put('/user/credits/available', userController.putAvailableCredits);
router.put('/user/credits/hold', userController.putOnHoldCredits);
//need also route to assign trip to user

export default router;