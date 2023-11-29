import { Router } from "express";
const router = Router();
import userController from './controllers/userController.js';
import tripController from './controllers/tripController.js';

//Trips
router.post('/trip/create', tripController.postCreate);
//router.get('/trip/:id')
router.get('/trips', tripController.getFilteredTrips);

//User account
router.post('/user/account/register', userController.postRegister);
router.post('/user/account/login', userController.postLogin);
router.get('/user/account/:driverId', userController.getDriver)
router.put('/user/account/cars', userController.putCar)
router.put('/user/account/tripsAsDriver', userController.putTripsAsDriver)
router.put('/user/account/creditsAvailable', userController.putAvailableCredits)
router.put('/user/account/creditsOnHold', userController.putOnHoldCredits)
//need also route to assign trip to user
 
router.get('/user/account', userController.getUser)

export default router;