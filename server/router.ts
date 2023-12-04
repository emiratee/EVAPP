import { Router } from "express";
import multer from "multer";
import tripController from './controllers/tripController.js';
import userController from './controllers/userController.js';
const router = Router();
const upload = multer({ dest: "uploads/" });

//Trips
router.post('/trip/create', tripController.postCreate);
//router.get('/trip/:id')
router.get('/trips', tripController.getFilteredTrips);
router.put('/trips/request', tripController.putMakeRequest);

router.put('/user/trips/approve', tripController.putApprovePassenger);
router.put('/user/trips/reject', tripController.putRejectPassenger);

//User account (Setting etc.)
router.post('/user/account/register', userController.postRegister);
router.post('/user/account/login', userController.postLogin);
router.put('/user/account/update', userController.putUpdateAccount);

//User (get certain information about the user directly)
router.get('/user/history', userController.getHistory)
router.get('/user', userController.getUser);
router.put('/user/cars', userController.putCar);
router.get('/user/:driverId', userController.getDriver);

//User trips (add passenger aswell?)
router.put('/user/trips/driver', userController.putTripsAsDriver);
//User (all about credits)
router.put('/user/credits/available', userController.putAvailableCredits);
router.put('/user/credits/hold', userController.putOnHoldCredits);
router.put('/user/credits/earnings', userController.putEarningsCredits);
//need also route to assign trip to user



export default router;